'use client';

// Use static import to ensure we use the same module instance as DAppKitProvider
// This avoids ESM/CJS interop issues that can occur with require() in Next.js
import { useWalletModal } from '@vechain/dapp-kit-react';
import { useVeChainKitConfig } from '../../../providers/VeChainKitContext';

/**
 * Type for the optional DAppKitWalletModal hook return value.
 * Uses ReturnType to ensure type compatibility with the actual hook.
 */
export type UseOptionalDAppKitWalletModalReturnType =
    | ReturnType<typeof useWalletModal>
    | {
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
 * Returns default values when DAppKit is not configured, avoiding the need
 * to wrap every usage in a try-catch or conditional check.
 *
 * Checks VeChainKitConfig to determine if DAppKit is configured before
 * using the DAppKit wallet modal result.
 *
 * @returns DAppKit wallet modal functions, or default values if DAppKit is not configured
 */
export const useOptionalDAppKitWalletModal =
    (): UseOptionalDAppKitWalletModalReturnType => {
        const config = useVeChainKitConfig();
        const isDAppKitConfigured = !!config.dappKit;

        // Always call hooks unconditionally to satisfy React's rules of hooks
        let dappKitModalResult: ReturnType<typeof useWalletModal> | null = null;
        try {
            dappKitModalResult = useWalletModal();
        } catch {
            // Hook threw (no DAppKitProvider in tree), will use defaults
        }

        // If DAppKit is not configured, return defaults immediately
        if (!isDAppKitConfigured) {
            return DEFAULT_DAPPKIT_WALLET_MODAL_STATE as unknown as UseOptionalDAppKitWalletModalReturnType;
        }

        // DAppKit is configured, return actual values (or defaults if hook threw)
        if (!dappKitModalResult) {
            return DEFAULT_DAPPKIT_WALLET_MODAL_STATE as unknown as UseOptionalDAppKitWalletModalReturnType;
        }

        return dappKitModalResult;
    };
