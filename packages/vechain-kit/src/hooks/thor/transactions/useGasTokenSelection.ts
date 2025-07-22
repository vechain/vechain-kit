import { useCallback, useMemo } from 'react';
import { useLocalStorage, LocalStorageKey } from '@/hooks/cache';
import {
    GasTokenPreferences,
    GasTokenType,
    GasTokenEstimate,
    GasTokenSelection,
    DEFAULT_GAS_TOKEN_PREFERENCES,
    SUPPORTED_GAS_TOKENS,
} from '@/types/GasToken';
import { EnhancedClause } from '@/types';

// Mock API calls - to be replaced with actual delegator service calls
const getGasEstimateForToken = async (
    _clauses: EnhancedClause[],
    token: GasTokenType,
): Promise<{ cost: string; serviceFee?: string }> => {
    // Mock response
    const costs = {
        VTHO: { cost: '0.59106322', serviceFee: '0.059106322' },
        VET: { cost: '0.075', serviceFee: '0.0075' },
        B3TR: { cost: '0.027', serviceFee: '0.0027' },
    };

    const tokenCost = costs[token];
    return {
        cost: (parseFloat(tokenCost.cost) * 1e18).toString(),
        serviceFee: (parseFloat(tokenCost.serviceFee) * 1e18).toString(),
    };
};

const checkTokenBalance = async (
    token: GasTokenType,
    _userAddress: string,
): Promise<string> => {
    // Mock balances
    const mockBalances = {
        VTHO: '5000000000000000000000',
        B3TR: '10000000000000000000000',
        VET: '100000000000000000000000',
    };

    return mockBalances[token];
};

export const useGasTokenSelection = () => {
    const [preferences, setPreferences] = useLocalStorage<GasTokenPreferences>(
        LocalStorageKey.GAS_TOKEN_PREFERENCES,
        DEFAULT_GAS_TOKEN_PREFERENCES,
    );

    const availableTokens = useMemo(() => {
        return preferences.tokenPriority.filter(
            (token: GasTokenType) => !preferences.excludedTokens.includes(token),
        );
    }, [preferences]);

    const estimateGasCosts = useCallback(
        async (clauses: EnhancedClause[]): Promise<GasTokenEstimate[]> => {
            const estimates: GasTokenEstimate[] = [];

            for (const token of availableTokens) {
                try {
                    const estimate = await getGasEstimateForToken(
                        clauses,
                        token,
                    );
                    const balance = await checkTokenBalance(
                        token,
                        'mock-address',
                    );

                    const totalCost = estimate.serviceFee
                        ? (
                              BigInt(estimate.cost) +
                              BigInt(estimate.serviceFee)
                          ).toString()
                        : estimate.cost;

                    estimates.push({
                        token,
                        cost: estimate.cost,
                        available: BigInt(balance) >= BigInt(totalCost),
                        balance,
                    });
                } catch {
                    estimates.push({
                        token,
                        cost: '0',
                        available: false,
                    });
                }
            }

            return estimates;
        },
        [availableTokens],
    );

    const selectOptimalGasToken = useCallback(
        async (
            clauses: EnhancedClause[],
        ): Promise<GasTokenSelection | null> => {
            const estimates = await estimateGasCosts(clauses);

            // find first available token in priority order
            const selectedEstimate = estimates.find(
                (estimate) => estimate.available,
            );

            if (!selectedEstimate) {
                return null;
            }

            return {
                selectedToken: selectedEstimate.token,
                cost: selectedEstimate.cost,
                hasServiceFee: false, // Will be true when actually using generic delegator
            };
        },
        [estimateGasCosts],
    );

    const checkPreferredTokenAvailability = useCallback(
        async (
            clauses: EnhancedClause[],
            preferredToken?: GasTokenType,
        ): Promise<{
            preferredAvailable: boolean;
            preferredEstimate?: GasTokenEstimate;
            alternatives: GasTokenEstimate[];
        }> => {
            const estimates = await estimateGasCosts(clauses);
            const targetToken = preferredToken || availableTokens[0];

            const preferredEstimate = estimates.find(
                (est) => est.token === targetToken,
            );
            const alternatives = estimates.filter(
                (est) => est.token !== targetToken && est.available,
            );

            return {
                preferredAvailable: preferredEstimate?.available || false,
                preferredEstimate,
                alternatives,
            };
        },
        [estimateGasCosts, availableTokens],
    );

    const updatePreferences = useCallback(
        (updates: Partial<GasTokenPreferences>) => {
            setPreferences((prev: GasTokenPreferences) => ({ ...prev, ...updates }));
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
                ? preferences.excludedTokens.filter((t: GasTokenType) => t !== token)
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
        estimateGasCosts,
        selectOptimalGasToken,
        checkPreferredTokenAvailability,
        updatePreferences,
        reorderTokenPriority,
        toggleTokenExclusion,
        resetToDefaults,
    };
};
