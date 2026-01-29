'use client';

import { ThorClient } from '@vechain/sdk-network';
import { useFallbackThor } from '../../../providers/ThorProvider';
// Use static import to ensure we use the same module instance as LazyDAppKitProvider
// This avoids ESM/CJS interop issues that can occur with require() in bundled contexts
import { useThor } from '@vechain/dapp-kit-react';
import { useVeChainKitConfig } from '../../../providers/VeChainKitContext';

/**
 * Type for the optional Thor hook return value.
 * Returns ThorClient when available, null otherwise.
 */
export type UseOptionalThorReturnType = ThorClient | null;

/**
 * Optional hook to access Thor client.
 * First tries to use DAppKit's useThor if available and configured,
 * then falls back to ThorProvider.
 * Returns null if neither is available.
 *
 * Uses static import to ensure the same module instance as LazyDAppKitProvider,
 * avoiding ESM/CJS interop issues that can occur with require().
 *
 * @returns Thor client or null if not available
 */
export const useOptionalThor = (): UseOptionalThorReturnType => {
    const config = useVeChainKitConfig();
    const isDAppKitConfigured = !!config.dappKit;
    const fallbackThor = useFallbackThor();

    // Always call hooks unconditionally to satisfy React's rules of hooks
    let dappKitThor: ThorClient | null = null;
    try {
        dappKitThor = useThor();
    } catch {
        // Hook threw (no DAppKitProvider in tree), will use fallback
    }

    // If DAppKit is not configured, use fallback immediately
    if (!isDAppKitConfigured) {
        return fallbackThor;
    }

    // DAppKit is configured, return actual Thor client (or fallback if hook threw)
    if (dappKitThor) {
        return dappKitThor;
    }

    // Return fallback Thor client if available
    return fallbackThor;
};
