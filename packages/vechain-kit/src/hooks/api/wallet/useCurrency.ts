import { useVeChainKitConfig } from '@/providers';
import { CURRENCY } from '@/types';

const allCurrencies: CURRENCY[] = ['usd', 'eur', 'gbp'];

/**
 * Hook for managing currency preferences
 */
export const useCurrency = () => {
    const { currentCurrency, setCurrentCurrency } = useVeChainKitConfig();

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
