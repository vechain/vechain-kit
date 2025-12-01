import { useVeChainKitConfig } from '@/providers';

/**
 * Hook to get and set the current currency in VeChainKit
 *
 * This hook provides the current runtime currency value and a function to change it.
 * Changes made via this hook will sync to VeChainKit settings and trigger callbacks.
 *
 * @returns Object with:
 * - `currentCurrency`: Current currency code ('usd', 'eur', or 'gbp')
 * - `setCurrency`: Function to change the currency
 *
 * @example
 * ```tsx
 * const { currentCurrency, setCurrency } = useCurrentCurrency();
 *
 * return (
 *   <select value={currentCurrency} onChange={(e) => setCurrency(e.target.value as CURRENCY)}>
 *     <option value="usd">USD ($)</option>
 *     <option value="eur">EUR (€)</option>
 *     <option value="gbp">GBP (£)</option>
 *   </select>
 * );
 * ```
 */
export const useCurrentCurrency = () => {
    const { currentCurrency, setCurrency } = useVeChainKitConfig();
    return {
        currentCurrency,
        setCurrency,
    };
};

