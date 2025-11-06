import { TransactionClause, Clause, ABIContract, Address as VeChainAddress, VET, Units } from '@vechain/sdk-core';
import { SwapAggregator, SwapQuote, SwapSimulation, SwapParams } from '@/types/swap';
import { Address } from 'viem';
import { UNISWAP_V2_ROUTER_ABI } from './uniswapV2RouterAbi';
import { ThorClient } from '@vechain/sdk-network';
import React from 'react';

/**
 * ERC20 ABI for approve function
 */
const ERC20_APPROVE_ABI = [
    {
        inputs: [
            { internalType: 'address', name: 'spender', type: 'address' },
            { internalType: 'uint256', name: 'amount', type: 'uint256' },
        ],
        name: 'approve',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function',
    },
] as const;

/**
 * Helper to check if token is VET (native token)
 */
const isVET = (address: string): boolean => {
    return address === '0x' || address === '0x0000000000000000000000000000000000000000';
};

/**
 * Helper to get deadline (20 minutes from now)
 */
const getDeadline = (): bigint => {
    return BigInt(Math.floor(Date.now() / 1000) + 20 * 60);
};


/**
 * Configuration for a Uniswap V2 compatible aggregator
 */
export interface UniswapV2AggregatorConfig {
    /**
     * Name of the aggregator (e.g., "BetterSwap", "VeTrade")
     */
    name: string;
    /**
     * Router contract address
     */
    routerAddress: Address;
    /**
     * Wrapped VET (WVET) contract address
     * Used in swap paths instead of native VET address
     */
    wrappedVET: Address;
    /**
     * Icon component factory function
     * @param boxSize Size of the icon (e.g., "20px", "24px")
     * @returns React element representing the aggregator icon
     */
    getIcon: (boxSize?: string) => React.ReactElement;
}

/**
 * Create a SwapAggregator instance for a Uniswap V2 compatible router
 */
export const createUniswapV2Aggregator = (config: UniswapV2AggregatorConfig): SwapAggregator => {
    const aggregator: SwapAggregator = {
        name: config.name,
        getIcon: config.getIcon,

        async getQuote(params: SwapParams, thor: ThorClient): Promise<SwapQuote> {
            // Use wrapped VET in paths instead of native VET address
            const path: Address[] = [
                isVET(params.fromTokenAddress) ? config.wrappedVET : (params.fromTokenAddress as Address),
                isVET(params.toTokenAddress) ? config.wrappedVET : (params.toTokenAddress as Address),
            ];

            const amountInBigInt = BigInt(params.amountIn);

            try {
                // Call getAmountsOut on the router contract
                const contract = thor.contracts.load(config.routerAddress, UNISWAP_V2_ROUTER_ABI);
                const [amounts] = await contract.read.getAmountsOut(amountInBigInt, path);

                if (amounts.length > 0) {
                    // Get the last amount (output amount after the swap)
                    const outputAmount = amounts[amounts.length - 1];

                    // Ensure we have a valid output amount
                    if (outputAmount === 0n) {
                        throw new Error('Output amount is zero');
                    }

                    // Calculate minimum output with slippage
                    // slippageTolerance is in percentage (e.g., 1 = 1%)
                    // For 1% slippage: multiplier = 10000 - 100 = 9900 (99% of output)
                    const slippageTolerancePercent = params.slippageTolerance || 1;
                    const slippageMultiplier = BigInt(10000 - slippageTolerancePercent * 100);
                    const minimumOutputAmount = (outputAmount * slippageMultiplier) / BigInt(10000);

                    return {
                        aggregatorName: config.name,
                        aggregator,
                        outputAmount,
                        priceImpact: 0,
                        minimumOutputAmount,
                        data: {
                            path,
                            routerAddress: config.routerAddress,
                        },
                    };
                } else {
                    throw new Error('Could not extract amounts array from result');
                }
            } catch (error) {
                console.error(`${config.name} getQuote failed:`, error);
                // Return empty quote on error
                return {
                    aggregatorName: config.name,
                    aggregator,
                    outputAmount: 0n,
                    priceImpact: 0,
                    minimumOutputAmount: 0n,
                    data: {
                        path,
                        routerAddress: config.routerAddress,
                    },
                };
            }
        },

        async simulateSwap(params: SwapParams, quote: SwapQuote, thor: ThorClient): Promise<SwapSimulation> {
            try {
                // Build transaction clauses for simulation
                const clauses = await this.buildSwapTransaction(params, quote);

                if (clauses.length === 0) {
                    return {
                        gasCostVTHO: 0,
                        success: false,
                        error: 'Failed to build transaction clauses',
                    };
                }

                // Simulate the transaction
                const simulatedTx = await thor.transactions.simulateTransaction(
                    clauses,
                    {
                        caller: params.userAddress,
                    },
                );

                // Check if any clause reverted
                let reverted = false;
                let revertReason: string | undefined;
                let totalGas = 200_000;

                for (let i = 0; i < simulatedTx.length; i++) {
                    const result = simulatedTx[i];

                    if (result.reverted) {
                        reverted = true;
                        revertReason = result.vmError || 'Transaction reverted';
                        break;
                    }

                    // Calculate gas cost for this clause
                    totalGas += result.gasUsed;
                }

                // Convert gas units to VTHO
                // On VeChain, 1 gas unit = 1e-18 VTHO (since 1 VTHO = 1e18 Wei)
                const gasCostVTHO = totalGas / 1e5;

                if (reverted) {
                    return {
                        gasCostVTHO: 0,
                        success: false,
                        error: revertReason || 'Transaction reverted',
                    };
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
        },

        async buildSwapTransaction(params: SwapParams, quote: SwapQuote): Promise<TransactionClause[]> {
            if (!quote.data || typeof quote.data !== 'object' || !('path' in quote.data)) {
                throw new Error('Invalid quote data');
            }

            const deadline = getDeadline();

            // Ensure minimumOutputAmount is set and not zero
            if (!quote.minimumOutputAmount || quote.minimumOutputAmount === 0n) {
                throw new Error('Invalid quote: minimumOutputAmount is missing or zero');
            }

            const amountOutMin = quote.minimumOutputAmount;
            const amountIn = BigInt(params.amountIn);

            // Additional validation: amountOutMin should be positive
            if (amountOutMin === 0n) {
                throw new Error('Invalid quote: minimumOutputAmount is zero');
            }

            const isFromVET = isVET(params.fromTokenAddress);
            const isToVET = isVET(params.toTokenAddress);

            const routerABI = ABIContract.ofAbi(UNISWAP_V2_ROUTER_ABI);
            const clauses: TransactionClause[] = [];

            if (isFromVET) {
                // Swap VET (native) for tokens using swapExactETHForTokens
                // Note: amountIn is sent as value (VET), amountOutMin is first parameter
                clauses.push(
                    Clause.callFunction(
                        VeChainAddress.of(config.routerAddress),
                        routerABI.getFunction('swapExactETHForTokens'),
                        [
                            amountOutMin.toString(),
                            quote.data.path,
                            params.userAddress,
                            deadline.toString(),
                        ],
                        VET.of(amountIn, Units.wei),
                        {
                            comment: `Swap on ${quote.aggregatorName}`,
                        }
                    ),
                );
            } else {
                // From token is an ERC20 token, need to approve the router first
                const tokenABI = ABIContract.ofAbi(ERC20_APPROVE_ABI);
                const fromTokenAddress = VeChainAddress.of(params.fromTokenAddress);
                const routerAddress = VeChainAddress.of(config.routerAddress);

                // Add approval clause: approve router to spend amountIn
                clauses.push(
                    Clause.callFunction(
                        fromTokenAddress,
                        tokenABI.getFunction('approve'),
                        [
                            routerAddress.toString(),
                            amountIn.toString(),
                        ],
                        VET.of(0n, Units.wei),
                        {
                            comment: `Swap on ${quote.aggregatorName}`,
                        }
                    ),
                );

                // Swap tokens: either for other tokens or for VET
                if (isToVET) {
                    // Swap tokens for VET using swapExactTokensForETH
                    clauses.push(
                        Clause.callFunction(
                            routerAddress,
                            routerABI.getFunction('swapExactTokensForETH'),
                            [
                                amountIn.toString(),
                                amountOutMin.toString(),
                                quote.data.path,
                                params.userAddress,
                                deadline.toString(),
                            ],
                            VET.of(0n, Units.wei),
                            {
                                comment: `Swap on ${quote.aggregatorName}`,
                            }
                        ),
                    );
                } else {
                    // Swap tokens for tokens using swapExactTokensForTokens
                    clauses.push(
                        Clause.callFunction(
                            routerAddress,
                            routerABI.getFunction('swapExactTokensForTokens'),
                            [
                                amountIn.toString(),
                                amountOutMin.toString(),
                                quote.data.path,
                                params.userAddress,
                                deadline.toString(),
                            ],
                            VET.of(0n, Units.wei),
                            {
                                comment: `Swap on ${quote.aggregatorName}`,
                            }
                        ),
                    );
                }
            }

            return clauses;
        },
    };

    return aggregator;
};

