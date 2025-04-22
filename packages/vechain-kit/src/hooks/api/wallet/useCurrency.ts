import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useVeChainKitConfig } from '@/providers';
import { CURRENCY } from '@/types';
import { useCallback } from 'react';

const STORAGE_KEY = 'vechain_kit_currency';
const allCurrencies: CURRENCY[] = ['usd', 'eur', 'gbp'];

type Token = {
    address: string;
    symbol: string;
    usdPrice: number;
    valueInUsd: number;
    valueInGbp: number;
    valueInEur: number;
    gbpUsdPrice: number;
    eurUsdPrice: number;
}

export const getTotalTokenValueInSelectedCurrency = (token: Token, currentCurrency: CURRENCY): number => {
    switch (currentCurrency) {
        case 'eur':
            return token.valueInEur;
        case 'gbp':
            return token.valueInGbp;
        default:
            return token.valueInUsd;
    }
};

export const convertTokenValueIntoSelectedCurrency = (tokenAmountInUsd: number, token: Token, currentCurrency: CURRENCY): number => {
    switch (currentCurrency) {
        case 'eur':
            return tokenAmountInUsd / token.eurUsdPrice;
        case 'gbp':
            return tokenAmountInUsd / token.gbpUsdPrice;
        default:
            return tokenAmountInUsd;
    }
};

export const getBalanceInCurrency = (
    currentCurrency: CURRENCY,
    balances: { totalBalanceEur: number; totalBalanceGbp: number; totalBalanceUsd: number }
): number => {
    switch (currentCurrency) {
        case 'eur':
            return balances.totalBalanceEur;
        case 'gbp':
            return balances.totalBalanceGbp;
        default:
            return balances.totalBalanceUsd;
    }
};

export const getCurrencyQueryKey = () => ['VECHAIN_KIT_CURRENT_CURRENCY'];

/**
 * Hook for managing currency preferences and conversions
 * @returns {Object} An object containing currency management functions and the current currency
 * @property {CURRENCY} currentCurrency - The currency currently selected by the user
 * @property {CURRENCY[]} allCurrencies - An array of all supported currencies
 * @property {Function} changeCurrency - A function to update the current currency
 * @property {Function} getTotalTokenValueInSelectedCurrency - Function to get the total token value in the selected currency
 * @property {Function} convertTokenValueIntoSelectedCurrency - Function to convert a token's value into the selected currency
 * @property {Function} getBalanceInCurrency - Function to get the total balance in the selected currency
 */
export const useCurrency = () => {
    const queryClient = useQueryClient();
    const { defaultCurrency = 'usd' } = useVeChainKitConfig();
    
    const getStoredCurrency = useCallback((): CURRENCY => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return (stored as CURRENCY) || defaultCurrency;
        } catch {
            return defaultCurrency;
        }
    }, [defaultCurrency]);
    
    const setStoredCurrency = (currency: CURRENCY) => {
        if (!allCurrencies.includes(currency)) {
            console.error(`Invalid currency: ${currency}`);
            return;
        }
        try {
            localStorage.setItem(STORAGE_KEY, currency);
        } catch (e) {
            console.error('Failed to store currency preference:', e);
        }
    };

    const { data: currentCurrency = defaultCurrency } = useQuery({
        queryKey: getCurrencyQueryKey(),
        queryFn: getStoredCurrency,
        staleTime: Infinity,
    });

    const changeCurrency = (newCurrency: CURRENCY) => {
        setStoredCurrency(newCurrency);
        queryClient.setQueryData(getCurrencyQueryKey(), newCurrency);
    };

    return { 
        currentCurrency,
        allCurrencies,
        changeCurrency,
        getTotalTokenValueInSelectedCurrency,
        convertTokenValueIntoSelectedCurrency,
        getBalanceInCurrency,
    };
};
