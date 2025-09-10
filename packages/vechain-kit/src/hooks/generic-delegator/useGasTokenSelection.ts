import { useCallback, useMemo } from 'react';
import { LocalStorageKey, useLocalStorage } from '../cache';
import {
    GasTokenPreferences,
    GasTokenType,
    DEFAULT_GAS_TOKEN_PREFERENCES,
    SUPPORTED_GAS_TOKENS,
} from '@/types/gasToken';

export const useGasTokenSelection = () => {
    const [preferences, setPreferences] = useLocalStorage<GasTokenPreferences>(
        LocalStorageKey.GAS_TOKEN_PREFERENCES,
        DEFAULT_GAS_TOKEN_PREFERENCES,
    );

    const availableTokens = useMemo(() => {
        return preferences.tokenPriority.filter(
            (token) => !preferences.excludedTokens.includes(token),
        );
    }, [preferences]);

    const updatePreferences = useCallback(
        (updates: Partial<GasTokenPreferences>) => {
            setPreferences((prev) => ({ ...prev, ...updates }));
        },
        [setPreferences],
    );

    const reorderTokenPriority = useCallback(
        (newOrder: GasTokenType[]) => {
            updatePreferences({ tokenPriority: newOrder });
        },
        [updatePreferences],
    );

    const toggleTokenExclusion = useCallback(
        (token: GasTokenType) => {
            const isExcluded = preferences.excludedTokens.includes(token);
            const newExcluded = isExcluded
                ? preferences.excludedTokens.filter((t) => t !== token)
                : [...preferences.excludedTokens, token];

            updatePreferences({ excludedTokens: newExcluded });
        },
        [preferences.excludedTokens, updatePreferences],
    );

    const resetToDefaults = useCallback(() => {
        setPreferences(DEFAULT_GAS_TOKEN_PREFERENCES);
    }, [setPreferences]);

    return {
        preferences,
        availableTokens,
        supportedTokens: SUPPORTED_GAS_TOKENS,
        updatePreferences,
        reorderTokenPriority,
        toggleTokenExclusion,
        resetToDefaults,
    };
};
