import { SwapAggregator } from '@/types/swap';
import { type Address } from 'viem';
import { createUniswapV2Aggregator } from './uniswapV2Aggregator';
import { BetterSwapLogo } from '@/assets/icons';
import React from 'react';

/**
 * BetterSwap aggregator configuration
 * 
 * BetterSwap Router Contract: 0xf21Dd7108D93af56FaB07423EfB90F4a3604DA89
 * Uses Uniswap V2 compatible interface
 */
const BETTERSWAP_ROUTER_ADDRESS = '0xf21Dd7108D93af56FaB07423EfB90F4a3604DA89' as Address;
const WRAPPED_VET_ADDRESS = '0xf9b02b47694fd635A413F16dC7B38aF06Cc16fe5' as Address;

/**
 * BetterSwap aggregator instance
 * Created using the shared Uniswap V2 aggregator module
 */
export const betterSwapAggregator: SwapAggregator = createUniswapV2Aggregator({
    name: 'BetterSwap.io',
    routerAddress: BETTERSWAP_ROUTER_ADDRESS,
    wrappedVET: WRAPPED_VET_ADDRESS,
    getIcon: (boxSize = '20px') => React.createElement(BetterSwapLogo, { boxSize }),
});
