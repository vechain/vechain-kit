'use client';

// Use static import to ensure we use the same module instance
// This avoids ESM/CJS interop issues that can occur with require() in Next.js
import { usePrivyCrossAppSdk } from '../../../providers/PrivyCrossAppProvider';
import { useVeChainKitConfig } from '../../../providers/VeChainKitContext';

/**
 * Type for the optional PrivyCrossAppSdk hook return value.
 * Uses ReturnType to ensure type compatibility with the actual hook.
 */
export type UseOptionalPrivyCrossAppSdkReturnType =
    | ReturnType<typeof usePrivyCrossAppSdk>
    | {
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
 * Checks VeChainKitConfig to determine if ecosystem login is enabled before
 * using the PrivyCrossAppSdk result.
 *
 * @returns Cross-app SDK functions, or no-op functions if ecosystem login is not configured
 */
export const useOptionalPrivyCrossAppSdk =
    (): UseOptionalPrivyCrossAppSdkReturnType => {
        const config = useVeChainKitConfig();

        // Check if ecosystem login is enabled (which means PrivyCrossAppProvider is rendered)
        const isEcosystemLoginEnabled = config.loginMethods?.some(
            (method) =>
                method.method === 'ecosystem' || method.method === 'vechain',
        );

        // Always call hooks unconditionally to satisfy React's rules of hooks
        let crossAppResult: ReturnType<typeof usePrivyCrossAppSdk> | null =
            null;
        try {
            crossAppResult = usePrivyCrossAppSdk();
        } catch {
            // Hook threw (no PrivyCrossAppProvider in tree), will use defaults
        }

        // If ecosystem login is not enabled, return defaults immediately
        if (!isEcosystemLoginEnabled) {
            return DEFAULT_CROSS_APP_STATE as unknown as UseOptionalPrivyCrossAppSdkReturnType;
        }

        // Ecosystem login is enabled, return actual values (or defaults if hook threw)
        if (!crossAppResult) {
            return DEFAULT_CROSS_APP_STATE as unknown as UseOptionalPrivyCrossAppSdkReturnType;
        }

        return crossAppResult;
    };
