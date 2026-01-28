'use client';

/**
 * Type for the optional wagmi useAccount hook return value.
 * Returns default values when WagmiProvider/PrivyCrossAppProvider is not available.
 */
export type UseOptionalWagmiAccountReturnType = {
    address: `0x${string}` | undefined;
    isConnected: boolean;
    isConnecting: boolean;
    isReconnecting: boolean;
    isDisconnected: boolean;
    status: 'connected' | 'disconnected' | 'connecting' | 'reconnecting';
};

// Default return value when WagmiProvider is not available
const DEFAULT_ACCOUNT_STATE: UseOptionalWagmiAccountReturnType = {
    address: undefined,
    isConnected: false,
    isConnecting: false,
    isReconnecting: false,
    isDisconnected: true,
    status: 'disconnected',
};

// Cached reference to the useAccount hook
let cachedAccountHook: (() => UseOptionalWagmiAccountReturnType) | undefined;
let hookLoadAttempted = false;

/**
 * Optional hook to access wagmi's useAccount.
 * Returns default values when WagmiProvider is not available (i.e., when ecosystem login is disabled).
 * This prevents errors when PrivyCrossAppProvider is not rendered.
 *
 * @returns Account info from wagmi, or disconnected state if provider is not available
 */
export const useOptionalWagmiAccount = (): UseOptionalWagmiAccountReturnType => {
    // Lazy load the hook to avoid importing wagmi when not needed
    if (!hookLoadAttempted) {
        hookLoadAttempted = true;
        try {
            // Dynamic require to check if wagmi is available
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const wagmiModule = require('wagmi');
            cachedAccountHook = wagmiModule.useAccount;
        } catch {
            // Wagmi not available
            cachedAccountHook = undefined;
        }
    }

    // If hook failed to load, return defaults
    if (!cachedAccountHook) {
        return DEFAULT_ACCOUNT_STATE;
    }

    try {
        const result = cachedAccountHook();
        return {
            address: result.address,
            isConnected: result.isConnected ?? false,
            isConnecting: result.isConnecting ?? false,
            isReconnecting: result.isReconnecting ?? false,
            isDisconnected: result.isDisconnected ?? true,
            status: result.status ?? 'disconnected',
        };
    } catch {
        // Hook threw (probably no provider), return defaults
        return DEFAULT_ACCOUNT_STATE;
    }
};
