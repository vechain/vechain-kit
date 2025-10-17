import { useCallback } from 'react';
import { LocalStorageKey, useSyncableLocalStorage } from '../cache';
import {
    GasTokenPreferences,
    GasTokenType,
    DEFAULT_GAS_TOKEN_PREFERENCES,
    SUPPORTED_GAS_TOKENS,
} from '@/types/gasToken';

export const useGasTokenSelection = () => {
    const [preferences, setPreferences] = useSyncableLocalStorage<GasTokenPreferences>(
        LocalStorageKey.GAS_TOKEN_PREFERENCES,
        DEFAULT_GAS_TOKEN_PREFERENCES,
    );

    const updatePreferences = useCallback(
        (updates: Partial<GasTokenPreferences>) => {
            setPreferences((prev) => ({ ...prev, ...updates }));
        },
        [setPreferences],
    );
 
    // updates the token priority and the available tokens in the order of the token priority but can only order the token that are in the available tokens
    const reorderTokenPriority = useCallback(
        (newOrder: GasTokenType[]) => {
            updatePreferences({ tokenPriority: newOrder });
            updatePreferences({ availableGasTokens: newOrder.filter((t) => preferences.availableGasTokens.includes(t) && !preferences.excludedTokens.includes(t)) });
        },
        [updatePreferences, preferences.availableGasTokens, preferences.excludedTokens],
    );

    const toggleTokenExclusion = useCallback(
        (token: GasTokenType) => {
            const isExcluded = preferences.excludedTokens.includes(token);
            const newExcluded = isExcluded
                ? preferences.excludedTokens.filter((t) => t !== token)
                : [...preferences.excludedTokens, token];
            // pop the token from the available tokens if it is in excluded tokens, else add the token back to available tokens in the order of the token priority
            const tokenPriorityPosition = preferences.tokenPriority.indexOf(token);
            const newAvailableTokens = isExcluded
                ? [...preferences.availableGasTokens.slice(0, tokenPriorityPosition), token, ...preferences.availableGasTokens.slice(tokenPriorityPosition)]
                : preferences.availableGasTokens.filter((t) => t !== token);

            updatePreferences({ excludedTokens: newExcluded, availableGasTokens: newAvailableTokens });
        },
        [preferences.excludedTokens, preferences.availableGasTokens, preferences.tokenPriority, updatePreferences],
    );

    const resetToDefaults = useCallback(() => {
        if (typeof window !== 'undefined') {
            window.localStorage.setItem(
                LocalStorageKey.GAS_TOKEN_PREFERENCES, 
                JSON.stringify(DEFAULT_GAS_TOKEN_PREFERENCES)
            );
        }
        setPreferences(DEFAULT_GAS_TOKEN_PREFERENCES);
    }, [setPreferences]);

    return {
        preferences,
        supportedTokens: SUPPORTED_GAS_TOKENS,
        updatePreferences,
        reorderTokenPriority,
        toggleTokenExclusion,
        resetToDefaults,
    };
};
