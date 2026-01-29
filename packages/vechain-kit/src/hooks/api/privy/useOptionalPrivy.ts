'use client';

import type { User } from '@privy-io/react-auth';
// Use static import to ensure we use the same module instance as PrivyProvider
// This avoids ESM/CJS interop issues that can occur with require() in Next.js
import { usePrivy } from '@privy-io/react-auth';

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
 * Returns default values when Privy provider is not available, avoiding the need
 * to wrap every usage in a try-catch or conditional check.
 *
 * Uses static import to ensure the same module instance as PrivyProvider,
 * avoiding ESM/CJS interop issues that can occur with require() in Next.js.
 *
 * @returns Privy user info and auth state, or null values if provider is not available
 */
export const useOptionalPrivy = (): UseOptionalPrivyReturnType => {
    try {
        // Call the hook directly - it will throw if not inside PrivyProvider
        const result = usePrivy();
        return {
            user: result.user ?? null,
            authenticated: result.authenticated ?? false,
            ready: result.ready ?? true,
            logout: result.logout ?? (async () => {}),
        };
    } catch {
        // Hook threw (no PrivyProvider in tree), return defaults
        return DEFAULT_PRIVY_STATE;
    }
};
