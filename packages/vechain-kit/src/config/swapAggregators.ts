import { SwapAggregator } from '@/types/swap';
import { NETWORK_TYPE } from '@/config/network';
import { createVeTradeAggregator } from '@/utils/swap/veTrade';
import { createBetterSwapAggregator } from '@/utils/swap/betterSwap';

/**
 * Get swap aggregators for a specific network
 * 
 * Add or remove aggregators by importing their modules and adding them to this array.
 * Each aggregator module must export a function or object implementing the SwapAggregator interface.
 * 
 * @param networkType - The network type (main, test, or solo)
 * @returns Array of SwapAggregator instances configured for the specified network
 */
export const getSwapAggregators = (networkType: NETWORK_TYPE): SwapAggregator[] => [
    createVeTradeAggregator(networkType),
    createBetterSwapAggregator(networkType),
];

