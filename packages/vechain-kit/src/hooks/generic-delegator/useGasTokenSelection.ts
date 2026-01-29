import { useCallback } from 'react';
import { LocalStorageKey, useSyncableLocalStorage } from '../cache';
import type { GasTokenPreferences, GasTokenType } from '../../types/gasToken';
import {
    DEFAULT_GAS_TOKEN_PREFERENCES,
    SUPPORTED_GAS_TOKENS,
} from '../../utils/constants';

export const useGasTokenSelection = () => {
    const [preferences, setPreferences] =
        useSyncableLocalStorage<GasTokenPreferences>(
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
            setPreferences((prev) => {
                const newAvailableGasTokens = newOrder.filter(
                    (t) =>
                        prev.availableGasTokens.includes(t) &&
                        !prev.excludedTokens.includes(t),
                );
                return {
                    ...prev,
                    tokenPriority: newOrder,
                    availableGasTokens: newAvailableGasTokens,
                    gasTokenToUse:
                        newAvailableGasTokens[0] ?? prev.gasTokenToUse,
                };
            });
        },
        [setPreferences],
    );

    const toggleTokenExclusion = useCallback(
        (token: GasTokenType) => {
            setPreferences((prev) => {
                const isExcluded = prev.excludedTokens.includes(token);
                const newExcluded = isExcluded
                    ? prev.excludedTokens.filter((t) => t !== token)
                    : [...prev.excludedTokens, token];
                // pop the token from the available tokens if it is in excluded tokens, else add the token back to available tokens in the order of the token priority
                const tokenPriorityPosition = prev.tokenPriority.indexOf(token);
                const newAvailableTokens = isExcluded
                    ? [
                          ...prev.availableGasTokens.slice(
                              0,
                              tokenPriorityPosition,
                          ),
                          token,
                          ...prev.availableGasTokens.slice(
                              tokenPriorityPosition,
                          ),
                      ]
                    : prev.availableGasTokens.filter((t) => t !== token);

                return {
                    ...prev,
                    excludedTokens: newExcluded,
                    availableGasTokens: newAvailableTokens,
                    gasTokenToUse: newAvailableTokens[0] ?? prev.gasTokenToUse,
                };
            });
        },
        [setPreferences],
    );

    return {
        preferences,
        supportedTokens: SUPPORTED_GAS_TOKENS,
        updatePreferences,
        reorderTokenPriority,
        toggleTokenExclusion,
    };
};
