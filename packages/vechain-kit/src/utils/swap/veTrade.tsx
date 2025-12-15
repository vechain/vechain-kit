import { SwapAggregator, SwapParams, SwapQuote, SwapSimulation } from '@/types/swap';
import { NETWORK_TYPE } from '@/config/network';
import { type Address } from 'viem';
import { createApiAggregator } from './apiAggregator';
import { VeTradeLogo } from '@/assets/icons';
import React from 'react';
import { TransactionClause, ABIContract, Clause, Address as VeChainAddress, VET, Units } from '@vechain/sdk-core';
import { ERC20__factory } from '@hooks/contracts';
import { ThorClient } from '@vechain/sdk-network';
import { simulateSwapWithClauses } from './simulateSwap';

/**
 * VeTrade supported addresses for different networks
 * These addresses are used to filter clauses from the API response
 */
const VETRADE_ADDRESSES: Record<NETWORK_TYPE, { supportedAddresses: Address[] }> = {
    main: {
        supportedAddresses: [
            '0xE5fA980a6EfE5B79C2150a529da06AeF455963b6' as Address, // Uniswap compatible Router
            '0x7C755EC0165fCD926cC6faB10E7BB16a72E9f34A' as Address // Custom Router
        ],
    },
    test: {
        supportedAddresses: [],
    },
    solo: {
        supportedAddresses: [],
    },
};

/**
 * Helper to check if token is VET (native token)
 */
const isVET = (address: string): boolean => {
    return address === '0x' || address === '0x0000000000000000000000000000000000000000';
};

/**
 * Get VeTrade API base URL for a specific network
 */
const getVeTradeApiUrl = (networkType: NETWORK_TYPE): string => {
    const apiUrls: Record<NETWORK_TYPE, string> = {
        main: 'https://vetrade.vet/api/quote/vck',
        test: 'https://vetrade.vet/api/quote/vck',
        solo: 'https://vetrade.vet/api/quote/vck',
    };
    return apiUrls[networkType] || apiUrls.main;
};

/**
 * Create VeTrade aggregator instance for a specific network
 * 
 * VeTrade uses an API-based aggregator that returns clauses with function calls
 * that are encoded locally. Only clauses targeting supported addresses are used.
 * 
 * @param networkType - The network type (main, test, or solo)
 * @returns SwapAggregator instance configured for the specified network
 */
export const createVeTradeAggregator = (networkType: NETWORK_TYPE): SwapAggregator => {
    const addresses = VETRADE_ADDRESSES[networkType] ?? VETRADE_ADDRESSES['main'];

    // Create base API aggregator with supported addresses
    const baseAggregator = createApiAggregator({
        name: 'VeTrade.vet',
        apiBaseUrl: getVeTradeApiUrl(networkType),
        network: networkType,
        getIcon: (boxSize = '20px') => React.createElement(VeTradeLogo, { boxSize }),
        supportedAddresses: addresses.supportedAddresses,
    });

    // Wrap the aggregator to add approve clause when needed
    const aggregator: SwapAggregator = {
        ...baseAggregator,

        async simulateSwap(params: SwapParams, quote: SwapQuote, thor: ThorClient): Promise<SwapSimulation> {
            try {
                // Build transaction clauses for simulation (includes approve clause if needed)
                // This ensures simulation uses the same clauses that will be executed
                const clauses = await this.buildSwapTransaction(params, quote);

                // Delegate to shared simulation helper that also verifies ERC20 inflow/outflow
                return simulateSwapWithClauses(params, quote, clauses, thor);
            } catch (error) {
                return {
                    gasCostVTHO: 0,
                    success: false,
                    error: error instanceof Error ? error.message : 'Simulation failed',
                };
            }
        },

        async buildSwapTransaction(params: SwapParams, quote: SwapQuote): Promise<TransactionClause[]> {
            const clauses: TransactionClause[] = [];

            // Get clauses from base aggregator (already filtered by supported addresses)
            const baseClauses = await baseAggregator.buildSwapTransaction(params, quote);

            if(!baseClauses || baseClauses.length === 0) {
                throw new Error('Failed to build swap transaction');
            }

            // Check if fromToken is VET (native token)
            const isFromVET = isVET(params.fromTokenAddress);

            // If fromToken is not VET, add approve clause as first clause
            if (!isFromVET) {
                // Get the router address from supported addresses (first address is typically the router)
                if (addresses.supportedAddresses.length === 0) {
                    throw new Error('No supported addresses configured for VeTrade on this network');
                }
                const tokenABI = ABIContract.ofAbi(ERC20__factory.abi);
                const fromTokenAddress = VeChainAddress.of(params.fromTokenAddress);
                const amountIn = BigInt(params.amountIn);

                // Add approval clause: approve router to spend amountIn
                clauses.push(
                    Clause.callFunction(
                        fromTokenAddress,
                        tokenABI.getFunction('approve'),
                        [
                            baseClauses[0].to,
                            amountIn.toString(),
                        ],
                        VET.of(0n, Units.wei),
                        {
                            comment: `Approve ${quote.aggregatorName} to access ${params.fromTokenAddress}`,
                        }
                    ),
                );
            }
            else {
                baseClauses[0].value = params.amountIn
            }

            // Add base clauses after approve clause
            clauses.push(...baseClauses);

            return clauses;
        },
    };

    return aggregator;
};
