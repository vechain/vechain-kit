'use client';

import { ThorClient } from '@vechain/sdk-network';
import { useFallbackThor } from '../../../providers/ThorProvider';

/**
 * Type for the optional Thor hook return value.
 * Returns ThorClient when available, null otherwise.
 */
export type UseOptionalThorReturnType = ThorClient | null;

// Cached reference to the useThor hook - null means not yet loaded, undefined means failed to load
let cachedThorHook: (() => ThorClient) | undefined;
let hookLoadAttempted = false;

/**
 * Optional hook to access Thor client.
 * First tries to use DAppKit's useThor if available, then falls back to ThorProvider.
 * Returns null if neither is available.
 *
 * @returns Thor client or null if not available
 */
export const useOptionalThor = (): UseOptionalThorReturnType => {
    const fallbackThor = useFallbackThor();

    // Lazy load the hook to avoid importing DAppKit when not needed
    if (!hookLoadAttempted) {
        hookLoadAttempted = true;
        try {
            // Dynamic require to check if DAppKit is available
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const dappKitModule = require('@vechain/dapp-kit-react');
            cachedThorHook = dappKitModule.useThor;
        } catch {
            // DAppKit not available
            cachedThorHook = undefined;
        }
    }

    // If hook loaded successfully, try to use it
    if (cachedThorHook) {
        try {
            const result = cachedThorHook();
            if (result) {
                return result;
            }
        } catch {
            // Hook threw (probably no provider), fall through to fallback
        }
    }

    // Return fallback Thor client if available
    return fallbackThor;
};
