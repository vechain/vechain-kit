import {
    SwapAggregator,
    SwapParams,
    SwapQuote,
    SwapSimulation,
} from '@/types/swap';
import {
    IERC20__factory,
    UniswapV2Router02__factory as UniswapV2Router__factory,
} from '@vechain/vechain-contract-types';
import {
    ABIContract,
    Clause,
    TransactionClause,
    Units,
    Address as VeChainAddress,
    VET,
} from '@vechain/sdk-core';
import { ThorClient } from '@vechain/sdk-network';
import React from 'react';
import { Address } from 'viem';
import { simulateSwapWithClauses } from './simulateSwap';

/**
 * Helper to check if token is VET (native token)
 */
const isVET = (address: string): boolean => {
    return (
        address === '0x' ||
        address === '0x0000000000000000000000000000000000000000'
    );
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
export const createUniswapV2Aggregator = (
    config: UniswapV2AggregatorConfig,
): SwapAggregator => {
    const aggregator: SwapAggregator = {
        name: config.name,
        getIcon: config.getIcon,

        async getQuote(
            params: SwapParams,
            thor: ThorClient,
        ): Promise<SwapQuote> {
            // Use wrapped VET in paths instead of native VET address
            const path: Address[] = [
                isVET(params.fromTokenAddress)
                    ? config.wrappedVET
                    : (params.fromTokenAddress as Address),
                isVET(params.toTokenAddress)
                    ? config.wrappedVET
                    : (params.toTokenAddress as Address),
            ];

            const amountInBigInt = BigInt(params.amountIn);

            try {
                // Call getAmountsOut on the router contract
                const contract = thor.contracts.load(
                    config.routerAddress,
                    UniswapV2Router__factory.abi,
                );
                const [amounts] = await contract.read.getAmountsOut(
                    amountInBigInt,
                    path,
                );

                // Handle both array and single value responses
                const amountsArray = Array.isArray(amounts)
                    ? amounts
                    : [amounts];
                const outputAmount = amountsArray[amountsArray.length - 1];

                // Ensure we have a valid output amount
                if (!outputAmount || outputAmount === 0n) {
                    throw new Error('Output amount is zero or invalid');
                }

                // Validate that outputAmount is a bigint
                if (typeof outputAmount !== 'bigint') {
                    throw new Error('Output amount is not a valid bigint');
                }

                // Calculate minimum output with slippage
                // slippageTolerance is in percentage (e.g., 1 = 1%)
                // For 1% slippage: multiplier = 10000 - 100 = 9900 (99% of output)
                const slippageTolerancePercent = params.slippageTolerance || 1;
                const slippageMultiplier = BigInt(
                    10000 - slippageTolerancePercent * 100,
                );
                const minimumOutputAmount =
                    (outputAmount * slippageMultiplier) / BigInt(10000);

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

        async simulateSwap(
            params: SwapParams,
            quote: SwapQuote,
            thor: ThorClient,
        ): Promise<SwapSimulation> {
            // Build transaction clauses using existing logic
            const clauses = await this.buildSwapTransaction(params, quote);

            // Delegate to shared simulation helper that also verifies ERC20 inflow/outflow
            return simulateSwapWithClauses(params, quote, clauses, thor);
        },

        async buildSwapTransaction(
            params: SwapParams,
            quote: SwapQuote,
        ): Promise<TransactionClause[]> {
            if (
                !quote.data ||
                typeof quote.data !== 'object' ||
                !('path' in quote.data)
            ) {
                throw new Error('Invalid quote data');
            }

            const deadline = getDeadline();

            // Ensure minimumOutputAmount is set and not zero
            if (
                !quote.minimumOutputAmount ||
                quote.minimumOutputAmount === 0n
            ) {
                throw new Error(
                    'Invalid quote: minimumOutputAmount is missing or zero',
                );
            }

            const amountOutMin = quote.minimumOutputAmount;
            const amountIn = BigInt(params.amountIn);

            // Additional validation: amountOutMin should be positive
            if (amountOutMin === 0n) {
                throw new Error('Invalid quote: minimumOutputAmount is zero');
            }

            const isFromVET = isVET(params.fromTokenAddress);
            const isToVET = isVET(params.toTokenAddress);

            const routerABI = ABIContract.ofAbi(UniswapV2Router__factory.abi);
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
                        },
                    ),
                );
            } else {
                // From token is an ERC20 token, need to approve the router first
                const tokenABI = ABIContract.ofAbi(IERC20__factory.abi);
                const fromTokenAddress = VeChainAddress.of(
                    params.fromTokenAddress,
                );
                const routerAddress = VeChainAddress.of(config.routerAddress);

                // Add approval clause: approve router to spend amountIn
                clauses.push(
                    Clause.callFunction(
                        fromTokenAddress,
                        tokenABI.getFunction('approve'),
                        [routerAddress.toString(), amountIn.toString()],
                        VET.of(0n, Units.wei),
                        {
                            comment: `Swap on ${quote.aggregatorName}`,
                        },
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
                            },
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
                            },
                        ),
                    );
                }
            }

            return clauses;
        },
    };

    return aggregator;
};
