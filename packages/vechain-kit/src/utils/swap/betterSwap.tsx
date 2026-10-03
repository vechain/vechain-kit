import { BetterSwapLogo } from '@/assets/icons';
import { NETWORK_TYPE } from '@/config/network';
import { SwapAggregator, SwapParams, SwapQuote } from '@/types/swap';
import { ThorClient } from '@vechain/sdk-network';
import React from 'react';
import { createUniswapV2Aggregator } from './uniswapV2Aggregator';

const BETTERSWAP_ROUTER = '0x23cbbf0265f55574490ab6eb1ed8730c71e23d6c';
const BETTERSWAP_NATIVE_PLACEHOLDER =
    '0x45429a2255e7248e57fce99e7239aed3f84b7a53';
const WRAPPED_VET_ADDRESSES = new Set([
    '0xf9b02b47694fd635a413f16dc7b38af06cc16fe5',
    BETTERSWAP_NATIVE_PLACEHOLDER,
    '0xd8ccdd85abdbf68dfec95f06c973e87b1b5a9997',
    '0xb9dfd9eaeeedabeb3ad41f6a88474d4a43a2307d',
]);

export const createBetterSwapAggregator = (
    networkType: NETWORK_TYPE,
): SwapAggregator => {
    const baseAggregator = createUniswapV2Aggregator({
        name: 'BetterSwap.io',
        routerAddress: BETTERSWAP_ROUTER,
        wrappedVET: BETTERSWAP_NATIVE_PLACEHOLDER,
        getIcon: (boxSize = '20px') =>
            React.createElement(BetterSwapLogo, { boxSize }),
    });
    const validateParams = (params: SwapParams) => {
        if (networkType !== 'main')
            throw new Error('BetterSwap only supports mainnet');
        if (
            [params.fromTokenAddress, params.toTokenAddress].some((address) =>
                WRAPPED_VET_ADDRESSES.has(address.toLowerCase()),
            )
        )
            throw new Error(
                'BetterSwap requires native VET instead of wrapped VET',
            );
    };
    const aggregator: SwapAggregator = {
        ...baseAggregator,

        async getQuote(
            params: SwapParams,
            thor: ThorClient,
        ): Promise<SwapQuote> {
            try {
                validateParams(params);
                const quote = await baseAggregator.getQuote(params, thor);
                return { ...quote, aggregator, priceImpact: undefined };
            } catch (error) {
                console.error('BetterSwap.io getQuote failed:', error);
                return {
                    aggregatorName: aggregator.name,
                    aggregator,
                    outputAmount: 0n,
                    minimumOutputAmount: 0n,
                };
            }
        },

        async buildSwapTransaction(params: SwapParams, quote: SwapQuote) {
            validateParams(params);
            return baseAggregator.buildSwapTransaction(params, quote);
        },
    };

    return aggregator;
};
