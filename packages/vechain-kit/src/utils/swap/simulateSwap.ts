import { ERC20_ABI, TransactionClause } from '@vechain/sdk-core';
import { ThorClient } from '@vechain/sdk-network';
import { decodeEventLog, zeroAddress, type Hex } from 'viem';
import type { SwapParams, SwapQuote, SwapSimulation } from '../../types/swap';

/**
 * Helper to detect VeChain native token (VET) placeholder addresses.
 */
const isVETAddress = (address: string): boolean => {
    return address === '0x' || address === zeroAddress;
};

/**
 * Calculate asset inflow and outflow per token (including native VET) for a given user address.
 * - ERC20 flows are derived from Transfer events.
 * - VET flows are derived from clause value (outflow) and transfers array (inflow).
 * The result is a map: tokenAddress -> { inflow, outflow }.
 * For VET, the tokenAddress key is the zeroAddress.
 */
const calculateTokenFlowsFromEvents = (
    events: {
        address: string;
        topics: string[];
        data: string;
    }[],
    transfers: {
        sender: string;
        recipient: string;
        amount: string;
    }[],
    clauseValue: string | number | bigint | undefined,
    userAddress: string,
): Record<string, { inflow: bigint; outflow: bigint }> => {
    const flowsByToken: Record<string, { inflow: bigint; outflow: bigint }> =
        {};
    const user = userAddress.toLowerCase();

    // ERC20 token flows from Transfer events
    for (const event of events) {
        try {
            const decoded = decodeEventLog({
                abi: ERC20_ABI,
                eventName: 'Transfer',
                topics: event.topics as unknown as [Hex, ...Hex[]],
                data: event.data as Hex,
            }) as {
                args: {
                    from: string;
                    to: string;
                    value: bigint | string;
                };
            };

            const from = decoded.args.from.toLowerCase();
            const to = decoded.args.to.toLowerCase();
            const rawValue = decoded.args.value;
            const value =
                typeof rawValue === 'bigint' ? rawValue : BigInt(rawValue);

            // Only consider flows where the user is directly involved
            if (from !== user && to !== user) {
                continue;
            }

            const tokenAddress = event.address.toLowerCase();
            const current = flowsByToken[tokenAddress] ?? {
                inflow: 0n,
                outflow: 0n,
            };

            if (from === user) {
                current.outflow += value;
            }

            if (to === user) {
                current.inflow += value;
            }

            flowsByToken[tokenAddress] = current;
        } catch {
            // Not an ERC20 Transfer event, ignore
            continue;
        }
    }

    // VET outflow: value (VET) sent by the user in the clause
    if (clauseValue !== undefined) {
        const valueBigInt = BigInt(clauseValue);
        if (valueBigInt > 0n) {
            const current = flowsByToken[zeroAddress] ?? {
                inflow: 0n,
                outflow: 0n,
            };
            current.outflow += valueBigInt;
            flowsByToken[zeroAddress] = current;
        }
    }

    // VET inflow: transfers where the recipient is the user
    for (const transfer of transfers) {
        const recipient = transfer.recipient.toLowerCase();

        if (recipient !== user) {
            continue;
        }

        const amount = BigInt(transfer.amount);
        if (amount <= 0n) {
            continue;
        }

        const current = flowsByToken[zeroAddress] ?? {
            inflow: 0n,
            outflow: 0n,
        };
        current.inflow += amount;
        flowsByToken[zeroAddress] = current;
    }

    return flowsByToken;
};

/**
 * Shared swap simulation logic used by all aggregators.
 * It:
 * - simulates the provided clauses
 * - computes gas cost
 * - accumulates ERC20 inflow/outflow for the user
 * - verifies that flows match amountIn and minimumOutputAmount when applicable
 * - verifies that no unexpected token outflows occur (only fromToken should have outflow)
 */
export const simulateSwapWithClauses = async (
    params: SwapParams,
    quote: SwapQuote,
    clauses: TransactionClause[],
    thor: ThorClient,
): Promise<SwapSimulation> => {
    try {
        if (clauses.length === 0) {
            return {
                gasCostVTHO: 0,
                success: false,
                error: 'No clauses found for simulation',
            };
        }

        const simulatedTx = await thor.transactions.simulateTransaction(
            clauses,
            {
                caller: params.userAddress,
            },
        );

        let reverted = false;
        let revertReason: string | undefined;
        // Base gas cost for transaction overhead (VeChain transaction base cost)
        let totalGas = 200_000;

        const aggregatedFlows: Record<
            string,
            { inflow: bigint; outflow: bigint }
        > = {};

        for (let i = 0; i < simulatedTx.length; i++) {
            const result = simulatedTx[i];
            if (result.reverted) {
                reverted = true;
                revertReason = result.vmError || 'Transaction reverted';
            }

            totalGas += result.gasUsed;

            const clause = clauses[i];
            const flowsByToken = calculateTokenFlowsFromEvents(
                result.events,
                result.transfers,
                clause?.value,
                params.userAddress,
            );

            // Merge per-clause flows into the aggregated map
            for (const [token, flows] of Object.entries(flowsByToken)) {
                const current = aggregatedFlows[token] ?? {
                    inflow: 0n,
                    outflow: 0n,
                };
                aggregatedFlows[token] = {
                    inflow: current.inflow + flows.inflow,
                    outflow: current.outflow + flows.outflow,
                };
            }
        }

        // If any clause reverted, keep behaviour consistent with previous implementation
        if (reverted) {
            return {
                gasCostVTHO: 0,
                success: false,
                error: revertReason || 'Transaction reverted',
            };
        }

        // Convert gas units to VTHO
        const gasCostVTHO = totalGas / 1e5;

        // Verify inflow/outflow for both ERC20 tokens and native VET.
        const fromIsVET = isVETAddress(params.fromTokenAddress);
        const toIsVET = isVETAddress(params.toTokenAddress);

        const expectedOutflow = BigInt(params.amountIn);

        // Outflow check: verify expected token outflow and ensure no other tokens have outflow
        if (fromIsVET) {
            const vetFlows = aggregatedFlows[zeroAddress] ?? {
                inflow: 0n,
                outflow: 0n,
            };

            if (vetFlows.outflow > expectedOutflow) {
                return {
                    gasCostVTHO,
                    success: false,
                    error: `VET outflow mismatch: expected ${expectedOutflow.toString()}, got ${vetFlows.outflow.toString()}`,
                };
            }

            // Verify no other tokens have outflow, in case an approval was granted in a different transaction
            for (const [tokenAddress, flows] of Object.entries(
                aggregatedFlows,
            )) {
                if (tokenAddress !== zeroAddress && flows.outflow > 0n) {
                    return {
                        gasCostVTHO,
                        success: false,
                        error: `Unexpected token outflow: token ${tokenAddress} has outflow ${flows.outflow.toString()}, expected 0`,
                    };
                }
            }
        } else {
            const fromTokenAddress = params.fromTokenAddress.toLowerCase();
            const tokenFlows = aggregatedFlows[fromTokenAddress] ?? {
                inflow: 0n,
                outflow: 0n,
            };

            if (tokenFlows.outflow > expectedOutflow) {
                return {
                    gasCostVTHO,
                    success: false,
                    error: `Token outflow mismatch: expected ${expectedOutflow.toString()}, got ${tokenFlows.outflow.toString()}`,
                };
            }

            // Verify no other tokens (including VET) have outflow
            for (const [tokenAddress, flows] of Object.entries(
                aggregatedFlows,
            )) {
                if (tokenAddress !== fromTokenAddress && flows.outflow > 0n) {
                    const tokenName =
                        tokenAddress === zeroAddress ? 'VET' : tokenAddress;
                    return {
                        gasCostVTHO,
                        success: false,
                        error: `Unexpected token outflow: ${tokenName} has outflow ${flows.outflow.toString()}, expected 0`,
                    };
                }
            }
        }

        // Inflow check (only when minimumOutputAmount is present)
        if (quote.minimumOutputAmount && quote.minimumOutputAmount > 0n) {
            if (toIsVET) {
                const vetFlows = aggregatedFlows[zeroAddress] ?? {
                    inflow: 0n,
                    outflow: 0n,
                };

                if (vetFlows.inflow < quote.minimumOutputAmount) {
                    return {
                        gasCostVTHO,
                        success: false,
                        error: `VET inflow mismatch: expected ${quote.minimumOutputAmount.toString()}, got ${vetFlows.inflow.toString()}`,
                    };
                }
            } else {
                const toTokenAddress = params.toTokenAddress.toLowerCase();
                const tokenFlows = aggregatedFlows[toTokenAddress] ?? {
                    inflow: 0n,
                    outflow: 0n,
                };

                if (tokenFlows.inflow < quote.minimumOutputAmount) {
                    return {
                        gasCostVTHO,
                        success: false,
                        error: `Token inflow mismatch: expected ${quote.minimumOutputAmount.toString()}, got ${tokenFlows.inflow.toString()}`,
                    };
                }
            }
        }

        return {
            gasCostVTHO,
            success: true,
        };
    } catch (error) {
        return {
            gasCostVTHO: 0,
            success: false,
            error: error instanceof Error ? error.message : 'Simulation failed',
        };
    }
};
