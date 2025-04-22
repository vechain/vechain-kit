import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useVeChainKitConfig } from '@/providers';
import { CURRENCY } from '@/types';

const STORAGE_KEY = 'vechain_kit_currency';
const allCurrencies: CURRENCY[] = ['usd', 'eur', 'gbp'];

type Token = {
    address: string;
    symbol: string;
    price: number;
    usdValue: number;
    valueInGbp: number;
    valueInEur: number;
    gbpUsdPrice: number;
    eurUsdPrice: number;
    balance?: string;
    numericBalance?: string;
}

export const getTotalTokenValueInSelectedCurrency = (token: Token, currentCurrency: CURRENCY) => {
    switch (currentCurrency) {
        case 'eur':
            return token.valueInEur;
        case 'gbp':
            return token.valueInGbp;
        default:
            return token.usdValue;
    }
};

export const convertTokenValueIntoSelectedCurrency = (usdValue: number, token: Token, currentCurrency: CURRENCY) => {
    switch (currentCurrency) {
        case 'eur':
            return usdValue / token.eurUsdPrice;
        case 'gbp':
            return usdValue / token.gbpUsdPrice;
        default:
            return usdValue;
    }
};

export const getBalanceInCurrency = (
    currentCurrency: CURRENCY,
    balances: { totalBalanceEur: number; totalBalanceGbp: number; totalBalanceUsd: number }
) => {
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
 * Get the currency with persistence
 * @returns Currency hook with persistent storage
 */
export const useCurrency = () => {
    const queryClient = useQueryClient();
    const { defaultCurrency = 'usd' } = useVeChainKitConfig();
    
    const getStoredCurrency = (): CURRENCY => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return (stored as CURRENCY) || defaultCurrency;
        } catch {
            return defaultCurrency;
        }
    };
    
    const setStoredCurrency = (currency: CURRENCY) => {
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
