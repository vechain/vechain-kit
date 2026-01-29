'use client';

import type { VeChainSignerDAppKit } from '@vechain/dapp-kit';
import type { CertificateData } from '@vechain/sdk-core';
// Use static import to ensure we use the same module instance as DAppKitProvider
// This avoids ESM/CJS interop issues that can occur with require() in Next.js
import { useWallet as useDAppKitWallet } from '@vechain/dapp-kit-react';
import { useVeChainKitConfig } from '../../../providers/VeChainKitContext';

// Mock signer that throws helpful errors when DAppKit is not configured
const createMockSigner = (): VeChainSignerDAppKit => {
    const notConfiguredError = () => {
        throw new Error(
            'DAppKit is not configured. Add dappKit prop to VeChainKitContext to use signing features.',
        );
    };

    return {
        signTypedData: notConfiguredError,
        signTransaction: notConfiguredError,
        sendTransaction: notConfiguredError,
        signMessage: notConfiguredError,
        resolveName: async () => null,
        getAddress: async () => {
            throw notConfiguredError();
        },
        getNonce: async () => {
            throw notConfiguredError();
        },
        populateCall: async () => {
            throw notConfiguredError();
        },
        populateTransaction: async () => {
            throw notConfiguredError();
        },
        estimateGas: async () => {
            throw notConfiguredError();
        },
        call: async () => {
            throw notConfiguredError();
        },
        provider: null as any,
        connect: () => {
            throw notConfiguredError();
        },
    } as unknown as VeChainSignerDAppKit;
};

/**
 * Type for the optional DAppKitWallet hook return value.
 * Returns default values when DAppKit is not configured.
 * Uses ReturnType to ensure type compatibility with the actual hook.
 */
export type UseOptionalDAppKitWalletReturnType =
    | ReturnType<typeof useDAppKitWallet>
    | {
          account: null;
          source: null;
          connectionCertificate: null;
          connect: () => void;
          connectV2: () => void;
          disconnect: () => void;
          setSource: () => void;
          availableWallets: string[];
          requestCertificate: () => Promise<never>;
          requestTransaction: () => Promise<never>;
          signer: VeChainSignerDAppKit;
      };

// Default return value when DAppKit is not available
const DEFAULT_DAPPKIT_WALLET_STATE = {
    account: null as string | null,
    source: null as string | null,
    connectionCertificate: null as CertificateData | null,
    connect: () => {
        console.warn(
            'DAppKit is not configured. Add dappKit prop to VeChainKitContext to enable wallet connections.',
        );
    },
    connectV2: () => {
        console.warn(
            'DAppKit is not configured. Add dappKit prop to VeChainKitContext to enable wallet connections.',
        );
    },
    disconnect: () => {},
    setSource: () => {},
    availableWallets: [] as string[],
    requestCertificate: async () => {
        throw new Error(
            'DAppKit is not configured. Add dappKit prop to VeChainKitContext to use certificate signing.',
        );
    },
    requestTransaction: async () => {
        throw new Error(
            'DAppKit is not configured. Add dappKit prop to VeChainKitContext to use transaction signing.',
        );
    },
    signer: createMockSigner(),
} as const;

/**
 * Optional hook to access DAppKit wallet context.
 * Returns default values when DAppKit is not configured, avoiding the need
 * to wrap every usage in a try-catch or conditional check.
 *
 * Checks VeChainKitConfig to determine if DAppKit is configured before
 * using the DAppKit wallet result.
 *
 * @returns DAppKit wallet info and functions, or default values if DAppKit is not configured
 */
export const useOptionalDAppKitWallet =
    (): UseOptionalDAppKitWalletReturnType => {
        const config = useVeChainKitConfig();
        const isDAppKitConfigured = !!config.dappKit;

        // Always call hooks unconditionally to satisfy React's rules of hooks
        let dappKitResult: ReturnType<typeof useDAppKitWallet> | null = null;
        try {
            dappKitResult = useDAppKitWallet();
        } catch {
            // Hook threw (no DAppKitProvider in tree), will use defaults
        }

        // If DAppKit is not configured, return defaults immediately
        if (!isDAppKitConfigured) {
            return DEFAULT_DAPPKIT_WALLET_STATE as unknown as UseOptionalDAppKitWalletReturnType;
        }

        // DAppKit is configured, return actual values (or defaults if hook threw)
        if (!dappKitResult) {
            return DEFAULT_DAPPKIT_WALLET_STATE as unknown as UseOptionalDAppKitWalletReturnType;
        }

        return dappKitResult;
    };
