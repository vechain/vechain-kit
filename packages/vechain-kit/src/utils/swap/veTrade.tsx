import { SwapAggregator } from '@/types/swap';
import { type Address, zeroAddress } from 'viem';
import { createUniswapV2Aggregator } from './uniswapV2Aggregator';
import { VeTradeLogo } from '@/assets/icons';
import React from 'react';

/**
 * VeTrade aggregator configuration
 * 
 * VeTrade Router Contract: 0xE5fA980a6EfE5B79C2150a529da06AeF455963b6
 * Uses Uniswap V2 compatible interface
 */
const VETRADE_ROUTER_ADDRESS = '0xE5fA980a6EfE5B79C2150a529da06AeF455963b6' as Address;
const WRAPPED_VET_ADDRESS = zeroAddress

/**
 * VeTrade aggregator instance
 * Created using the shared Uniswap V2 aggregator module
 */
export const veTradeAggregator: SwapAggregator = createUniswapV2Aggregator({
    name: 'VeTrade.vet',
    routerAddress: VETRADE_ROUTER_ADDRESS,
    wrappedVET: WRAPPED_VET_ADDRESS,
    getIcon: (boxSize = '20px') => React.createElement(VeTradeLogo, { boxSize }),
});
