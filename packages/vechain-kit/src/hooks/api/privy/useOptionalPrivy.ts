'use client';

import type { User } from '@privy-io/react-auth';
// Use static import to ensure we use the same module instance as PrivyProvider
// This avoids ESM/CJS interop issues that can occur with require() in Next.js
import { usePrivy } from '@privy-io/react-auth';
import { useVeChainKitConfig } from '../../../providers/VeChainKitContext';

/**
 * Type for the optional Privy hook return value.
 * Uses a subset of the actual hook return type for safer defaults.
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

/**
 * Optional hook to access Privy context.
 * Returns default values when Privy is not configured in VeChainKitProvider,
 * avoiding the need to wrap every usage in a try-catch or conditional check.
 *
 * When Privy is not configured, the PrivyProvider is not rendered, so usePrivy()
 * may return { ready: false } instead of throwing. This hook checks the
 * VeChainKitConfig first to determine if Privy is configured.
 *
 * @returns Privy user info and auth state, or default values if Privy is not configured
 */
export const useOptionalPrivy = (): UseOptionalPrivyReturnType => {
    const config = useVeChainKitConfig();
    const isPrivyConfigured = !!config.privy;

    // Always call hooks unconditionally to satisfy React's rules of hooks
    let privyResult: ReturnType<typeof usePrivy> | null = null;
    try {
        privyResult = usePrivy();
    } catch {
        // Hook threw (no PrivyProvider in tree), will use defaults
    }

    // If Privy is not configured, return defaults immediately
    // This handles the case where usePrivy() returns { ready: false } instead of throwing
    if (!isPrivyConfigured) {
        return DEFAULT_PRIVY_STATE;
    }

    // Privy is configured, return actual values (or defaults if hook threw)
    if (!privyResult) {
        return DEFAULT_PRIVY_STATE;
    }

    return {
        user: privyResult.user ?? null,
        authenticated: privyResult.authenticated ?? false,
        ready: privyResult.ready ?? true,
        logout: privyResult.logout ?? (async () => {}),
    };
};
