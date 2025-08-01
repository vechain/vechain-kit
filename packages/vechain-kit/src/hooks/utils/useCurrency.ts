import { useState, useEffect } from 'react';
import { useVeChainKitConfig } from '@/providers';
import { CURRENCY } from '@/types';
import { getLocalStorageItem, setLocalStorageItem } from '@/utils/ssrUtils';

const STORAGE_KEY = 'vechain_kit_currency';
const allCurrencies: CURRENCY[] = ['usd', 'eur', 'gbp'];

/**
 * Hook for managing currency preferences
 */
export const useCurrency = () => {
    const { defaultCurrency = 'usd' } = useVeChainKitConfig();
    const [currentCurrency, setCurrentCurrency] = useState<CURRENCY>(() => {
        try {
            const stored = getLocalStorageItem(STORAGE_KEY);
            return (stored as CURRENCY) || defaultCurrency;
        } catch (error) {
            console.error(error);
            return defaultCurrency;
        }
    });

    useEffect(() => {
        setLocalStorageItem(STORAGE_KEY, currentCurrency);
    }, [currentCurrency]);

    const changeCurrency = (newCurrency: CURRENCY) => {
        if (!allCurrencies.includes(newCurrency)) {
            console.error(`Invalid currency: ${newCurrency}`);
            return;
        }
        setCurrentCurrency(newCurrency);
    };

    return {
        currentCurrency,
        allCurrencies,
        changeCurrency,
    };
};
