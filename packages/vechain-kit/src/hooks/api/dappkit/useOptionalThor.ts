'use client';

import { ThorClient } from '@vechain/sdk-network';
import { useFallbackThor } from '../../../providers/ThorProvider';
// Use static import to ensure we use the same module instance as DAppKitProvider
// This avoids ESM/CJS interop issues that can occur with require() in Next.js
import { useThor } from '@vechain/dapp-kit-react';

/**
 * Type for the optional Thor hook return value.
 * Returns ThorClient when available, null otherwise.
 */
export type UseOptionalThorReturnType = ThorClient | null;

/**
 * Optional hook to access Thor client.
 * First tries to use DAppKit's useThor if available, then falls back to ThorProvider.
 * Returns null if neither is available.
 *
 * Uses static import to ensure the same module instance as DAppKitProvider,
 * avoiding ESM/CJS interop issues that can occur with require() in Next.js.
 *
 * @returns Thor client or null if not available
 */
export const useOptionalThor = (): UseOptionalThorReturnType => {
    const fallbackThor = useFallbackThor();

    try {
        // Call the hook directly - it will throw if not inside DAppKitProvider
        const result = useThor();
        if (result) {
            return result;
        }
    } catch {
        // Hook threw (no DAppKitProvider in tree), fall through to fallback
    }

    // Return fallback Thor client if available
    return fallbackThor;
};
