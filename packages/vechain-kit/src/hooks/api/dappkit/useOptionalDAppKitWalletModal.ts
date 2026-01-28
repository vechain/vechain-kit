'use client';

/**
 * Type for the optional DAppKitWalletModal hook return value.
 * Returns default values when DAppKit is not configured.
 */
export type UseOptionalDAppKitWalletModalReturnType = {
    open: () => void;
    close: () => void;
    onConnectionStatusChange: (callback: (status: { isConnected: boolean }) => void) => () => void;
};

// Default return value when DAppKit is not available
const DEFAULT_DAPPKIT_WALLET_MODAL_STATE: UseOptionalDAppKitWalletModalReturnType = {
    open: () => {
        console.warn(
            'DAppKit is not configured. Add dappKit prop to VeChainKitContext to enable wallet modal.',
        );
    },
    close: () => {},
    onConnectionStatusChange: () => () => {},
};

// Cached reference to the useWalletModal hook - null means not yet loaded, undefined means failed to load
let cachedWalletModalHook: (() => UseOptionalDAppKitWalletModalReturnType) | undefined;
let hookLoadAttempted = false;

/**
 * Optional hook to access DAppKit wallet modal context.
 * Returns default values when DAppKit is not configured, avoiding the need
 * to wrap every usage in a try-catch or conditional check.
 *
 * @returns DAppKit wallet modal functions, or default values if DAppKit is not available
 */
export const useOptionalDAppKitWalletModal = (): UseOptionalDAppKitWalletModalReturnType => {
    // Lazy load the hook to avoid importing DAppKit when not needed
    if (!hookLoadAttempted) {
        hookLoadAttempted = true;
        try {
            // Dynamic require to check if DAppKit is available
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const dappKitModule = require('@vechain/dapp-kit-react');
            cachedWalletModalHook = dappKitModule.useWalletModal;
        } catch {
            // DAppKit not available
            cachedWalletModalHook = undefined;
        }
    }

    // If hook failed to load, return defaults
    if (!cachedWalletModalHook) {
        return DEFAULT_DAPPKIT_WALLET_MODAL_STATE;
    }

    try {
        const result = cachedWalletModalHook();
        return {
            open: result.open ?? (() => {}),
            close: result.close ?? (() => {}),
            onConnectionStatusChange: result.onConnectionStatusChange ?? (() => () => {}),
        };
    } catch {
        // Hook threw (probably no provider), return defaults
        return DEFAULT_DAPPKIT_WALLET_MODAL_STATE;
    }
};
