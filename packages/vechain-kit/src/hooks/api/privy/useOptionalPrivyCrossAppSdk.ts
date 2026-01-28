'use client';

import type { SignTypedDataParameters } from '@wagmi/core';

/**
 * Type for the optional PrivyCrossAppSdk hook return value.
 * Returns no-op functions when ecosystem login is not configured.
 */
export type UseOptionalPrivyCrossAppSdkReturnType = {
    login: (appID: string) => Promise<{ accounts: readonly `0x${string}`[] } | undefined>;
    logout: () => Promise<void>;
    signMessage: (message: string) => Promise<string>;
    signTypedData: (data: SignTypedDataParameters) => Promise<string>;
    isConnecting: boolean;
    connectionError: Error | null;
};

// Default return value when PrivyCrossAppProvider is not available
const DEFAULT_CROSS_APP_STATE: UseOptionalPrivyCrossAppSdkReturnType = {
    login: async () => {
        throw new Error(
            'Ecosystem login is not configured. Add ecosystem to loginMethods in VeChainKitProvider to enable this feature.',
        );
    },
    logout: async () => {},
    signMessage: async () => {
        throw new Error(
            'Ecosystem login is not configured. Cannot sign messages without PrivyCrossAppProvider.',
        );
    },
    signTypedData: async () => {
        throw new Error(
            'Ecosystem login is not configured. Cannot sign typed data without PrivyCrossAppProvider.',
        );
    },
    isConnecting: false,
    connectionError: null,
};

// Cached reference to the usePrivyCrossAppSdk hook
let cachedCrossAppHook: (() => UseOptionalPrivyCrossAppSdkReturnType) | undefined;
let hookLoadAttempted = false;

/**
 * Optional hook to access PrivyCrossAppSdk context.
 * Returns default values when ecosystem login is not configured, avoiding the need
 * to wrap every usage in a try-catch or conditional check.
 *
 * @returns Cross-app SDK functions, or no-op functions if provider is not available
 */
export const useOptionalPrivyCrossAppSdk = (): UseOptionalPrivyCrossAppSdkReturnType => {
    // Lazy load the hook to avoid importing when not needed
    if (!hookLoadAttempted) {
        hookLoadAttempted = true;
        try {
            // Dynamic require to check if the provider module is available
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const crossAppModule = require('../../../providers/PrivyCrossAppProvider');
            cachedCrossAppHook = crossAppModule.usePrivyCrossAppSdk;
        } catch {
            // Module not available
            cachedCrossAppHook = undefined;
        }
    }

    // If hook failed to load, return defaults
    if (!cachedCrossAppHook) {
        return DEFAULT_CROSS_APP_STATE;
    }

    try {
        const result = cachedCrossAppHook();
        return {
            login: result.login ?? DEFAULT_CROSS_APP_STATE.login,
            logout: result.logout ?? DEFAULT_CROSS_APP_STATE.logout,
            signMessage: result.signMessage ?? DEFAULT_CROSS_APP_STATE.signMessage,
            signTypedData: result.signTypedData ?? DEFAULT_CROSS_APP_STATE.signTypedData,
            isConnecting: result.isConnecting ?? false,
            connectionError: result.connectionError ?? null,
        };
    } catch {
        // Hook threw (probably no provider), return defaults
        return DEFAULT_CROSS_APP_STATE;
    }
};
