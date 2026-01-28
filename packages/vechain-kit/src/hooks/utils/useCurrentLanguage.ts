import { useVeChainKitConfig } from '../../providers';

/**
 * Hook to get and set the current language in VeChainKit
 *
 * This hook provides the current runtime language value and a function to change it.
 * Changes made via this hook will sync to VeChainKit settings and trigger callbacks.
 *
 * @returns Object with:
 * - `currentLanguage`: Current language code (e.g., 'en', 'fr', 'de')
 * - `setLanguage`: Function to change the language
 *
 * @example
 * ```tsx
 * const { currentLanguage, setLanguage } = useCurrentLanguage();
 *
 * return (
 *   <select value={currentLanguage} onChange={(e) => setLanguage(e.target.value)}>
 *     <option value="en">English</option>
 *     <option value="fr">Français</option>
 *   </select>
 * );
 * ```
 */
export const useCurrentLanguage = () => {
    const { currentLanguage, setLanguage } = useVeChainKitConfig();
    return {
        currentLanguage,
        setLanguage,
    };
};

