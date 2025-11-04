import { SwapAggregator } from '@/types/swap';
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
 * VeTrade aggregator instance
 * Created using the API aggregator module
 */
export const veTradeAggregator: SwapAggregator = createApiAggregator({
    name: 'VeTrade.vet',
    apiBaseUrl: VETRADE_API_BASE_URL,
    getIcon: (boxSize = '20px') => React.createElement(VeTradeLogo, { boxSize }),
});
