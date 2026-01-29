'use client';

// Use static import to ensure we use the same module instance as DAppKitProvider
// This avoids ESM/CJS interop issues that can occur with require() in Next.js
import { useWalletModal } from '@vechain/dapp-kit-react';

/**
 * Type for the optional DAppKitWalletModal hook return value.
 * Uses ReturnType to ensure type compatibility with the actual hook.
 */
export type UseOptionalDAppKitWalletModalReturnType = ReturnType<typeof useWalletModal> | {
    open: () => void;
    close: () => void;
    onConnectionStatusChange: () => void;
};

// Default return value when DAppKit is not available
const DEFAULT_DAPPKIT_WALLET_MODAL_STATE = {
    open: () => {
        console.warn(
            'DAppKit is not configured. Add dappKit prop to VeChainKitContext to enable wallet modal.',
        );
    },
    close: () => {},
    onConnectionStatusChange: () => {},
};

/**
 * Optional hook to access DAppKit wallet modal context.
 * Returns default values when DAppKit provider is not available, avoiding the need
 * to wrap every usage in a try-catch or conditional check.
 *
 * Uses static import to ensure the same module instance as DAppKitProvider,
 * avoiding ESM/CJS interop issues that can occur with require() in Next.js.
 *
 * @returns DAppKit wallet modal functions, or default values if provider is not available
 */
export const useOptionalDAppKitWalletModal = (): UseOptionalDAppKitWalletModalReturnType => {
    try {
        // Call the hook directly - it will throw if not inside DAppKitProvider
        // Return the result directly to preserve all properties and types
        return useWalletModal();
    } catch {
        // Hook threw (no DAppKitProvider in tree), return defaults
        return DEFAULT_DAPPKIT_WALLET_MODAL_STATE as unknown as UseOptionalDAppKitWalletModalReturnType;
    }
};
