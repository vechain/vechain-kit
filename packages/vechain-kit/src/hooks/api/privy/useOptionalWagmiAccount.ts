'use client';

// Use static import to ensure we use the same module instance as WagmiProvider
// This avoids ESM/CJS interop issues that can occur with require() in Next.js
import { useAccount } from 'wagmi';

/**
 * Type for the optional wagmi useAccount hook return value.
 * Uses ReturnType to ensure type compatibility with the actual hook.
 */
export type UseOptionalWagmiAccountReturnType = ReturnType<typeof useAccount> | {
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
 * Returns default values when WagmiProvider is not available (i.e., when ecosystem login is disabled).
 * This prevents errors when PrivyCrossAppProvider is not rendered.
 *
 * Uses static import to ensure the same module instance as WagmiProvider,
 * avoiding ESM/CJS interop issues that can occur with require() in Next.js.
 *
 * @returns Account info from wagmi, or disconnected state if provider is not available
 */
export const useOptionalWagmiAccount = (): UseOptionalWagmiAccountReturnType => {
    try {
        // Call the hook directly - it will throw if not inside WagmiProvider
        // Return the result directly to preserve all properties and types
        return useAccount();
    } catch {
        // Hook threw (no WagmiProvider in tree), return defaults
        return DEFAULT_ACCOUNT_STATE as unknown as UseOptionalWagmiAccountReturnType;
    }
};
