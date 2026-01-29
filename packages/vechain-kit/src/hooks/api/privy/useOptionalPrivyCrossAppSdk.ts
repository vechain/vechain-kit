'use client';

// Use static import to ensure we use the same module instance
// This avoids ESM/CJS interop issues that can occur with require() in Next.js
import { usePrivyCrossAppSdk } from '../../../providers/PrivyCrossAppProvider';

/**
 * Type for the optional PrivyCrossAppSdk hook return value.
 * Uses ReturnType to ensure type compatibility with the actual hook.
 */
export type UseOptionalPrivyCrossAppSdkReturnType = ReturnType<typeof usePrivyCrossAppSdk> | {
    login: () => Promise<never>;
    logout: () => Promise<void>;
    signMessage: () => Promise<never>;
    signTypedData: () => Promise<never>;
    isConnecting: false;
    connectionError: null;
};

// Default return value when PrivyCrossAppProvider is not available
const DEFAULT_CROSS_APP_STATE = {
    login: async () => {
        throw new Error(
            'Ecosystem login is not configured. Add ecosystem to loginMethods in VeChainKitContext to enable this feature.',
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
    isConnecting: false as const,
    connectionError: null as null,
};

/**
 * Optional hook to access PrivyCrossAppSdk context.
 * Returns default values when ecosystem login is not configured, avoiding the need
 * to wrap every usage in a try-catch or conditional check.
 *
 * Uses static import to ensure the same module instance as PrivyCrossAppProvider,
 * avoiding ESM/CJS interop issues that can occur with require() in Next.js.
 *
 * @returns Cross-app SDK functions, or no-op functions if provider is not available
 */
export const useOptionalPrivyCrossAppSdk = (): UseOptionalPrivyCrossAppSdkReturnType => {
    try {
        // Call the hook directly - it will throw if not inside PrivyCrossAppProvider
        // Return the result directly to preserve all properties and types
        return usePrivyCrossAppSdk();
    } catch {
        // Hook threw (no PrivyCrossAppProvider in tree), return defaults
        return DEFAULT_CROSS_APP_STATE as unknown as UseOptionalPrivyCrossAppSdkReturnType;
    }
};
