'use client';

import type { CertificateResponse, CertificateMessage, CertificateOptions, VeChainSignerDAppKit, TransactionMessage, TransactionOptions, TransactionResponse } from '@vechain/dapp-kit';
import type { CertificateData } from '@vechain/sdk-core';

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
        getAddress: async () => { throw notConfiguredError(); },
        getNonce: async () => { throw notConfiguredError(); },
        populateCall: async () => { throw notConfiguredError(); },
        populateTransaction: async () => { throw notConfiguredError(); },
        estimateGas: async () => { throw notConfiguredError(); },
        call: async () => { throw notConfiguredError(); },
        provider: null as any,
        connect: () => { throw notConfiguredError(); },
    } as unknown as VeChainSignerDAppKit;
};

/**
 * Type for the optional DAppKitWallet hook return value.
 * Returns default values when DAppKit is not configured.
 */
export type UseOptionalDAppKitWalletReturnType = {
    account: string | null;
    source: string | null;
    connectionCertificate: CertificateData | null;
    connect: () => void;
    disconnect: () => void;
    setSource: (source: string) => void;
    availableSources: string[];
    requestCertificate: (message: CertificateMessage, options?: CertificateOptions) => Promise<CertificateResponse>;
    requestTransaction: (clauses: TransactionMessage[], options?: TransactionOptions) => Promise<TransactionResponse>;
    signer: VeChainSignerDAppKit;
};

// Default return value when DAppKit is not available
const DEFAULT_DAPPKIT_WALLET_STATE: UseOptionalDAppKitWalletReturnType = {
    account: null,
    source: null,
    connectionCertificate: null,
    connect: () => {
        console.warn(
            'DAppKit is not configured. Add dappKit prop to VeChainKitContext to enable wallet connections.',
        );
    },
    disconnect: () => {},
    setSource: () => {},
    availableSources: [],
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
};

// Cached reference to the useWallet hook - null means not yet loaded, undefined means failed to load
let cachedWalletHook: (() => UseOptionalDAppKitWalletReturnType) | undefined;
let hookLoadAttempted = false;

/**
 * Optional hook to access DAppKit wallet context.
 * Returns default values when DAppKit is not configured, avoiding the need
 * to wrap every usage in a try-catch or conditional check.
 *
 * @returns DAppKit wallet info and functions, or default values if DAppKit is not available
 */
export const useOptionalDAppKitWallet = (): UseOptionalDAppKitWalletReturnType => {
    // Lazy load the hook to avoid importing DAppKit when not needed
    if (!hookLoadAttempted) {
        hookLoadAttempted = true;
        try {
            // Dynamic require to check if DAppKit is available
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const dappKitModule = require('@vechain/dapp-kit-react');
            cachedWalletHook = dappKitModule.useWallet;
        } catch {
            // DAppKit not available
            cachedWalletHook = undefined;
        }
    }

    // If hook failed to load, return defaults
    if (!cachedWalletHook) {
        return DEFAULT_DAPPKIT_WALLET_STATE;
    }

    try {
        const result = cachedWalletHook();
        return {
            account: result.account ?? null,
            source: result.source ?? null,
            connectionCertificate: result.connectionCertificate ?? null,
            connect: result.connect ?? (() => {}),
            disconnect: result.disconnect ?? (() => {}),
            setSource: result.setSource ?? (() => {}),
            availableSources: result.availableSources ?? [],
            requestCertificate: result.requestCertificate ?? DEFAULT_DAPPKIT_WALLET_STATE.requestCertificate,
            requestTransaction: result.requestTransaction ?? DEFAULT_DAPPKIT_WALLET_STATE.requestTransaction,
            signer: result.signer ?? DEFAULT_DAPPKIT_WALLET_STATE.signer,
        };
    } catch {
        // Hook threw (probably no provider), return defaults
        return DEFAULT_DAPPKIT_WALLET_STATE;
    }
};
