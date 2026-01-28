'use client';

import type { User } from '@privy-io/react-auth';

/**
 * Type for the optional Privy hook return value.
 * Returns null values when Privy is not configured.
 */
export type UseOptionalPrivyReturnType = {
    user: User | null;
    authenticated: boolean;
    ready: boolean;
    logout: () => Promise<void>;
};

// Default return value when Privy is not available
const DEFAULT_PRIVY_STATE: UseOptionalPrivyReturnType = {
    user: null,
    authenticated: false,
    ready: true,
    logout: async () => {},
};

// Cached reference to the usePrivy hook - null means not yet loaded, undefined means failed to load
let cachedPrivyHook: (() => UseOptionalPrivyReturnType) | undefined;
let hookLoadAttempted = false;

/**
 * Optional hook to access Privy context.
 * Returns default values when Privy is not configured, avoiding the need
 * to wrap every usage in a try-catch or conditional check.
 *
 * @returns Privy user info and auth state, or null values if Privy is not available
 */
export const useOptionalPrivy = (): UseOptionalPrivyReturnType => {
    // Lazy load the hook to avoid importing Privy when not needed
    if (!hookLoadAttempted) {
        hookLoadAttempted = true;
        try {
            // Dynamic require to check if Privy is available
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const privyModule = require('@privy-io/react-auth');
            cachedPrivyHook = privyModule.usePrivy;
        } catch {
            // Privy not available
            cachedPrivyHook = undefined;
        }
    }

    // If hook failed to load, return defaults
    if (!cachedPrivyHook) {
        return DEFAULT_PRIVY_STATE;
    }

    try {
        const result = cachedPrivyHook();
        return {
            user: result.user ?? null,
            authenticated: result.authenticated ?? false,
            ready: result.ready ?? true,
            logout: result.logout ?? (async () => {}),
        };
    } catch {
        // Hook threw (probably no provider), return defaults
        return DEFAULT_PRIVY_STATE;
    }
};
