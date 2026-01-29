'use client';

// Use static import to ensure we use the same module instance as WagmiProvider
// This avoids ESM/CJS interop issues that can occur with require() in Next.js
import { useAccount } from 'wagmi';
import { useVeChainKitConfig } from '../../../providers/VeChainKitContext';

/**
 * Type for the optional wagmi useAccount hook return value.
 * Uses ReturnType to ensure type compatibility with the actual hook.
 */
export type UseOptionalWagmiAccountReturnType =
    | ReturnType<typeof useAccount>
    | {
          address: undefined;
          isConnected: false;
          isConnecting: false;
          isReconnecting: false;
          isDisconnected: true;
          status: 'disconnected';
      };

// Default return value when WagmiProvider is not available
const DEFAULT_ACCOUNT_STATE = {
    address: undefined as undefined,
    isConnected: false as const,
    isConnecting: false as const,
    isReconnecting: false as const,
    isDisconnected: true as const,
    status: 'disconnected' as const,
};

/**
 * Optional hook to access wagmi's useAccount.
 * Returns default values when ecosystem login is not configured (i.e., when WagmiProvider is not rendered).
 * This prevents errors when PrivyCrossAppProvider is not rendered.
 *
 * Checks VeChainKitConfig to determine if ecosystem login is enabled before
 * using wagmi's useAccount result, avoiding false loading states.
 *
 * @returns Account info from wagmi, or disconnected state if ecosystem login is not configured
 */
export const useOptionalWagmiAccount =
    (): UseOptionalWagmiAccountReturnType => {
        const config = useVeChainKitConfig();

        // Check if ecosystem login is enabled (which means WagmiProvider is rendered)
        const isEcosystemLoginEnabled = config.loginMethods?.some(
            (method) =>
                method.method === 'ecosystem' || method.method === 'vechain',
        );

        // Always call hooks unconditionally to satisfy React's rules of hooks
        let wagmiResult: ReturnType<typeof useAccount> | null = null;
        try {
            wagmiResult = useAccount();
        } catch {
            // Hook threw (no WagmiProvider in tree), will use defaults
        }

        // If ecosystem login is not enabled, return defaults immediately
        // This handles the case where useAccount() returns connecting states instead of throwing
        if (!isEcosystemLoginEnabled) {
            return DEFAULT_ACCOUNT_STATE as unknown as UseOptionalWagmiAccountReturnType;
        }

        // Ecosystem login is enabled, return actual values (or defaults if hook threw)
        if (!wagmiResult) {
            return DEFAULT_ACCOUNT_STATE as unknown as UseOptionalWagmiAccountReturnType;
        }

        return wagmiResult;
    };
