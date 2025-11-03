import { SwapAggregator } from '@/types/swap';
import { betterSwapAggregator } from '@/utils/swap/betterSwap';
import { veTradeAggregator } from '@/utils/swap/veTrade';

/**
 * Configuration file for swap aggregators
 * 
 * Add or remove aggregators by importing their modules and adding them to this array.
 * Each aggregator module must export a default object implementing the SwapAggregator interface.
 */
export const swapAggregators: SwapAggregator[] = [
    betterSwapAggregator,
    veTradeAggregator,
];

