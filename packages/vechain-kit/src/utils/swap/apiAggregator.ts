import { TransactionClause } from '@vechain/sdk-core';
import { SwapAggregator, SwapQuote, SwapSimulation, SwapParams } from '@/types/swap';
import { NETWORK_TYPE } from '@/config/network';
import { ThorClient } from '@vechain/sdk-network';
import React from 'react';
import { encodeFunctionData } from 'viem';
import type { Abi, AbiFunction } from 'viem';
import { simulateSwapWithClauses } from './simulateSwap';

/**
 * API response structure from VeTrade API
 */
interface VeTradeQuoteResponse {
    amountOut: string;
    amountOutMin: string;
    clauses: Array<{
        to: string;
        value: string;
        comment?: string;
        functionCall: {
            functionName?: string; // API may use functionName
            name?: string; // Or name
            abi: Abi | Array<{
                name: string;
                type: string;
                internalType?: string;
                components?: Array<{
                    name: string;
                    type: string;
                    internalType?: string;
                }>;
            }>; // ABI may be just inputs array or full ABI
            args: unknown[];
        };
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
    /**
     * List of supported contract addresses for interaction
     * Clauses will be filtered to only include those targeting these addresses
     */
    supportedAddresses?: string[];
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
 * Convert inputs array to full function ABI format expected by viem
 */
const buildFunctionABI = (
    functionName: string,
    inputs: Array<{
        name: string;
        type: string;
        internalType?: string;
        components?: Array<{
            name: string;
            type: string;
            internalType?: string;
        }>;
    }>
): AbiFunction => {
    return {
        name: functionName,
        type: 'function',
        inputs: inputs.map(input => ({
            name: input.name,
            type: input.type,
            internalType: input.internalType,
            components: input.components,
        })),
        outputs: [], // Empty outputs array for encoding (not needed for encoding)
        stateMutability: 'nonpayable',
    };
};

/**
 * Normalize ABI to full function format if needed
 */
const normalizeABI = (
    abi: VeTradeQuoteResponse['clauses'][0]['functionCall']['abi'],
    functionName: string
): Abi => {
    // Check if ABI is already in full format (has function definitions)
    if (Array.isArray(abi) && abi.length > 0) {
        const firstItem = abi[0];

        // If it's already a function definition with name and type, return as is
        if (typeof firstItem === 'object' && 'name' in firstItem && 'type' in firstItem && firstItem.type === 'function') {
            return abi as unknown as Abi;
        }

        // Check if this is an inputs array (has name/type but not function structure)
        // An inputs array item will have name/type but won't have stateMutability or outputs
        if (typeof firstItem === 'object' && 'name' in firstItem && 'type' in firstItem) {
            const hasFunctionStructure = 'stateMutability' in firstItem || 'outputs' in firstItem;
            if (!hasFunctionStructure) {
                // This is likely just the inputs array, convert to full function ABI
                const inputsArray = abi as unknown as Array<{
                    name: string;
                    type: string;
                    internalType?: string;
                    components?: Array<{
                        name: string;
                        type: string;
                        internalType?: string;
                    }>;
                }>;
                const functionABI = buildFunctionABI(functionName, inputsArray);
                return [functionABI] as Abi;
            }
        }
    }

    // Return as is if already in correct format
    return abi as unknown as Abi;
};

/**
 * Encode function call data using ABI, function name, and arguments
 */
const encodeFunctionCallData = (functionCall: VeTradeQuoteResponse['clauses'][0]['functionCall']): string => {
    try {
        // Get function name from either functionName or name field
        const functionName = functionCall.functionName || functionCall.name;

        if (!functionName) {
            throw new Error('Function name is required (either functionName or name must be provided)');
        }

        // Normalize ABI to full function format
        const normalizedABI = normalizeABI(functionCall.abi, functionName);

        // Use viem's encodeFunctionData to encode the function call
        return encodeFunctionData({
            abi: normalizedABI,
            functionName: functionName,
            args: functionCall.args,
        });
    } catch (error) {
        console.error('Failed to encode function call:', error);
        const functionName = functionCall.functionName || functionCall.name || 'unknown';
        throw new Error(`Failed to encode function call ${functionName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};

/**
 * Convert API clause format to TransactionClause format
 * Encodes function call data locally using the provided ABI, function name, and arguments
 */
const convertApiClauseToTransactionClause = (apiClause: VeTradeQuoteResponse['clauses'][0]): TransactionClause => {
    // Encode the function call data locally
    const encodedData = encodeFunctionCallData(apiClause.functionCall);

    return {
        to: apiClause.to,
        value: hexToDecimalString(apiClause.value),
        data: encodedData,
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
                const response = await fetch(`${config.apiBaseUrl}?${queryParams.toString()}`);

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

            // Delegate to shared simulation helper that also verifies ERC20 inflow/outflow
            return simulateSwapWithClauses(params, quote, clauses, thor);
        },

        async buildSwapTransaction(params: SwapParams, quote: SwapQuote): Promise<TransactionClause[]> {

            // Extract clauses from quote data
            if (!quote.data || typeof quote.data !== 'object' || !('clauses' in quote.data)) {
                throw new Error('Invalid quote data: clauses not found');
            }

            let clauses = quote.data.clauses as TransactionClause[];

            if (clauses.length === 0) {
                throw new Error('No clauses found in quote');
            }

            // Filter clauses to only include those targeting supported addresses
            if (config.supportedAddresses && config.supportedAddresses.length > 0) {
                const supportedAddressesLower = config.supportedAddresses.map(addr => addr.toLowerCase());
                clauses = clauses.filter(clause => {
                    if (!clause.to) return false;
                    return supportedAddressesLower.includes(clause.to.toLowerCase());
                });

                if (clauses.length === 0) {
                    throw new Error('No clauses found matching supported addresses');
                }
            }

            // Validate minimum output amount
            if (!quote.minimumOutputAmount || quote.minimumOutputAmount === 0n) {
                throw new Error('Invalid quote: minimumOutputAmount is missing or zero');
            }

            // Return the filtered clauses from the API response
            // These clauses are already in the correct format for execution
            return clauses;
        },
    };

    return aggregator;
};

