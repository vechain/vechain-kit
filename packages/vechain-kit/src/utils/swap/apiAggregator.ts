import { TransactionClause } from '@vechain/sdk-core';
import { SwapAggregator, SwapQuote, SwapSimulation, SwapParams } from '@/types/swap';
import { NETWORK_TYPE } from '@/config/network';
import { ThorClient } from '@vechain/sdk-network';
import React from 'react';

/**
 * API response structure from VeTrade API
 */
interface VeTradeQuoteResponse {
    amountOut: string;
    amountOutMin: string;
    clauses: Array<{
        to: string;
        value: string;
        data: string;
        comment?: string;
    }>;
    path: string[];
}

/**
 * Configuration for an API-based aggregator
 */
export interface ApiAggregatorConfig {
    /**
     * Name of the aggregator (e.g., "VeTrade")
     */
    name: string;
    /**
     * Base URL for the API endpoint
     */
    apiBaseUrl: string;
    /**
     * Network type (main, test, or solo)
     */
    network: NETWORK_TYPE;
    /**
     * Icon component factory function
     * @param boxSize Size of the icon (e.g., "20px", "24px")
     * @returns React element representing the aggregator icon
     */
    getIcon: (boxSize?: string) => React.ReactElement;
}

/**
 * Convert hex value to decimal string for TransactionClause
 * TransactionClause expects value as a string representation of the number
 */
const hexToDecimalString = (hexValue: string): string => {
    if (!hexValue.startsWith('0x')) {
        return hexValue;
    }
    return BigInt(hexValue).toString();
};

/**
 * Convert API clause format to TransactionClause format
 */
const convertApiClauseToTransactionClause = (apiClause: VeTradeQuoteResponse['clauses'][0]): TransactionClause => {
    return {
        to: apiClause.to,
        value: hexToDecimalString(apiClause.value),
        data: apiClause.data,
        comment: apiClause.comment || `Swap on aggregator`,
    };
};

/**
 * Create a SwapAggregator instance that fetches quotes from an API
 */
export const createApiAggregator = (config: ApiAggregatorConfig): SwapAggregator => {
    const aggregator: SwapAggregator = {
        name: config.name,
        getIcon: config.getIcon,

        async getQuote(params: SwapParams, _thor: ThorClient): Promise<SwapQuote> {
            try {
                // Build query parameters
                const queryParams = new URLSearchParams({
                    fromAddress: params.fromTokenAddress,
                    toAddress: params.toTokenAddress,
                    amountIn: params.amountIn,
                    recipient: params.userAddress,
                    slippageBps: String((params.slippageTolerance || 1) * 100), // Convert percentage to basis points
                    network: config.network,
                });

                // Fetch quote from API
                const response = await fetch(`${config.apiBaseUrl}/quote?${queryParams.toString()}`);

                if (!response.ok) {
                    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
                }

                const quoteData: VeTradeQuoteResponse = await response.json();

                // Convert API clauses to TransactionClause format
                const clauses = quoteData.clauses.map(convertApiClauseToTransactionClause);

                // Convert amounts to bigint
                const outputAmount = BigInt(quoteData.amountOut);
                const minimumOutputAmount = BigInt(quoteData.amountOutMin);

                return {
                    aggregatorName: config.name,
                    aggregator,
                    outputAmount,
                    minimumOutputAmount,
                    priceImpact: 0,
                    data: {
                        clauses,
                        path: quoteData.path,
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
                        clauses: [],
                        path: [],
                    },
                };
            }
        },

        async simulateSwap(params: SwapParams, quote: SwapQuote, thor: ThorClient): Promise<SwapSimulation> {
            try {
                // Extract clauses from quote data
                if (!quote.data || typeof quote.data !== 'object' || !('clauses' in quote.data)) {
                    return {
                        gasCostVTHO: 0,
                        success: false,
                        error: 'Invalid quote data: clauses not found',
                    };
                }

                const clauses = quote.data.clauses as TransactionClause[];

                if (clauses.length === 0) {
                    return {
                        gasCostVTHO: 0,
                        success: false,
                        error: 'No clauses found in quote',
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
            // Extract clauses from quote data
            if (!quote.data || typeof quote.data !== 'object' || !('clauses' in quote.data)) {
                throw new Error('Invalid quote data: clauses not found');
            }

            const clauses = quote.data.clauses as TransactionClause[];

            if (clauses.length === 0) {
                throw new Error('No clauses found in quote');
            }

            // Validate minimum output amount
            if (!quote.minimumOutputAmount || quote.minimumOutputAmount === 0n) {
                throw new Error('Invalid quote: minimumOutputAmount is missing or zero');
            }

            // Return the clauses from the API response
            // These clauses are already in the correct format for execution
            return clauses;
        },
    };

    return aggregator;
};

