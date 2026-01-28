import type { SwapAggregator } from '../../types/swap';
import { NETWORK_TYPE } from '@/config/network';
import { zeroAddress, type Address } from 'viem';
import { createUniswapV2Aggregator } from './uniswapV2Aggregator';
import { BetterSwapLogo } from '@/assets/icons';
import React from 'react';

/**
 * BetterSwap router and wrapped VET addresses for different networks
 */
const BETTERSWAP_ADDRESSES: Record<NETWORK_TYPE, { routerAddress: Address; wrappedVET: Address }> = {
    main: {
        routerAddress: '0xf21Dd7108D93af56FaB07423EfB90F4a3604DA89' as Address,
        wrappedVET: '0xf9b02b47694fd635A413F16dC7B38aF06Cc16fe5' as Address,
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
 * Create BetterSwap aggregator instance for a specific network
 * 
 * BetterSwap Router Contract addresses vary by network
 * Uses Uniswap V2 compatible interface
 * 
 * @param networkType - The network type (main, test, or solo)
 * @returns SwapAggregator instance configured for the specified network
 */
export const createBetterSwapAggregator = (networkType: NETWORK_TYPE): SwapAggregator => {
    const addresses = BETTERSWAP_ADDRESSES[networkType] ?? BETTERSWAP_ADDRESSES['main'];
    
    return createUniswapV2Aggregator({
        name: 'BetterSwap.io',
        routerAddress: addresses.routerAddress,
        wrappedVET: addresses.wrappedVET,
        getIcon: (boxSize = '20px') => React.createElement(BetterSwapLogo, { boxSize }),
    });
};
