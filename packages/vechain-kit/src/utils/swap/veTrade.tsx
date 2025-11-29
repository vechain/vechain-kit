import { SwapAggregator } from '@/types/swap';
import { NETWORK_TYPE } from '@/config/network';
import { zeroAddress, type Address } from 'viem';
import { createUniswapV2Aggregator } from './uniswapV2Aggregator';
import { VeTradeLogo } from '@/assets/icons';
import React from 'react';

/**
 * VeTrade router and wrapped VET addresses for different networks
 */
const VETRADE_ADDRESSES: Record<NETWORK_TYPE, { routerAddress: Address; wrappedVET: Address }> = {
    main: {
        routerAddress: '0xE5fA980a6EfE5B79C2150a529da06AeF455963b6' as Address,
        wrappedVET: zeroAddress
    },
    test: {
        routerAddress: zeroAddress,
        wrappedVET: zeroAddress,
    },
    solo: {
        routerAddress: zeroAddress,
        wrappedVET: zeroAddress,
    },
};

/**
 * Create VeTrade aggregator instance for a specific network
 * 
 * VeTrade Router Contract addresses vary by network
 * Uses Uniswap V2 compatible interface
 * 
 * @param networkType - The network type (main, test, or solo)
 * @returns SwapAggregator instance configured for the specified network
 */
export const createVeTradeAggregator = (networkType: NETWORK_TYPE): SwapAggregator => {
    const addresses = VETRADE_ADDRESSES[networkType] ?? VETRADE_ADDRESSES['main'];
    
    return createUniswapV2Aggregator({
        name: 'VeTrade.vet',
        routerAddress: addresses.routerAddress,
        wrappedVET: addresses.wrappedVET,
        getIcon: (boxSize = '20px') => React.createElement(VeTradeLogo, { boxSize }),
    });
};
