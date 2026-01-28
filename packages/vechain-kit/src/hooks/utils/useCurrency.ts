import { useEffect } from 'react';
// Import directly from VeChainKitProvider to avoid circular dependency with providers/index.ts
import { useVeChainKitConfig } from '../../providers/VeChainKitProvider';
import type { CURRENCY } from '../../types';
import { setLocalStorageItem } from '../../utils/ssrUtils';

const STORAGE_KEY = 'vechain_kit_currency';
const allCurrencies: CURRENCY[] = ['usd', 'eur', 'gbp'];

/**
 * Hook for managing currency preferences
 *
 * Note: This hook now uses the currency from VeChainKit context.
 * For setting currency, use the setCurrency function from useCurrentCurrency() hook instead.
 */
export const useCurrency = () => {
    const { currentCurrency, setCurrency } = useVeChainKitConfig();

    // Sync currency changes to localStorage
    useEffect(() => {
        setLocalStorageItem(STORAGE_KEY, currentCurrency);
    }, [currentCurrency]);

    const changeCurrency = (newCurrency: CURRENCY) => {
        if (!allCurrencies.includes(newCurrency)) {
            console.error(`Invalid currency: ${newCurrency}`);
            return;
        }
        setCurrency(newCurrency);
    };

    return {
        currentCurrency,
        allCurrencies,
        changeCurrency,
    };
};
