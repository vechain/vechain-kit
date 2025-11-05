import { SwapAggregator } from '@/types/swap';
import { NETWORK_TYPE } from '@/config/network';
import { createApiAggregator } from './apiAggregator';
import { VeTradeLogo } from '@/assets/icons';
import React from 'react';

/**
 * VeTrade aggregator configuration
 * 
 * VeTrade API: https://vetrade.vet/api
 * Fetches quotes and transaction clauses from the VeTrade API
 */
const VETRADE_API_BASE_URL = 'https://vetrade.vet/api';

/**
 * Create VeTrade aggregator instance for a specific network
 * 
 * @param networkType - The network type (main, test, or solo)
 * @returns SwapAggregator instance configured for the specified network
 */
export const createVeTradeAggregator = (networkType: NETWORK_TYPE): SwapAggregator => {
    return createApiAggregator({
        name: 'VeTrade.vet',
        apiBaseUrl: VETRADE_API_BASE_URL,
        network: networkType,
        getIcon: (boxSize = '20px') => React.createElement(VeTradeLogo, { boxSize }),
    });
};
