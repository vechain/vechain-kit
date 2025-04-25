import { useState, useEffect } from 'react';
import { useVeChainKitConfig } from '@/providers';
import { CURRENCY } from '@/types';

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

/**
 * Hook for managing currency preferences and conversions
 */
export const useCurrency = () => {
    const { defaultCurrency = 'usd' } = useVeChainKitConfig();
    const [currentCurrency, setCurrentCurrency] = useState<CURRENCY>(() => {
        try {
            const stored = window.localStorage.getItem(STORAGE_KEY);
            return (stored as CURRENCY) || defaultCurrency;
        } catch (error) {
            console.error(error);
            return defaultCurrency;
        }
    });

    useEffect(() => {
        try {
            window.localStorage.setItem(STORAGE_KEY, currentCurrency);
        } catch (error) {
            console.error('Failed to store currency preference:', error);
        }
    }, [currentCurrency]);

    const changeCurrency = (newCurrency: CURRENCY) => {
        if (!allCurrencies.includes(newCurrency)) {
            console.error(`Invalid currency: ${newCurrency}`);
            return;
        }
        setCurrentCurrency(newCurrency);
    };

    const getTokenValue = (token: Token) => {
        switch (currentCurrency) {
            case 'eur':
                return token.valueInEur;
            case 'gbp':
                return token.valueInGbp;
            default:
                return token.valueInUsd;
        }
    };

    const convertTokenValue = (tokenAmountInUsd: number, token: Token) => {
        switch (currentCurrency) {
            case 'eur':
                return tokenAmountInUsd / token.eurUsdPrice;
            case 'gbp':
                return tokenAmountInUsd / token.gbpUsdPrice;
            default:
                return tokenAmountInUsd;
        }
    };

    return {
        currentCurrency,
        allCurrencies,
        changeCurrency,
        getTokenValue,
        convertTokenValue,
    };
};
