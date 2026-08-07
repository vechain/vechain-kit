'use client';

import { useState, useCallback, useRef } from 'react';
import { isAddress } from 'viem';
import { useVeChainKitConfig } from '@/providers';
import { useWallet } from '@/hooks';

export type TransakCheckoutStatus =
    | 'idle'
    | 'processing'
    | 'ready'
    | 'success'
    | 'error';

export type UseTransakCheckoutResult = {
    isOpen: boolean;
    open: (params?: {
        fiatAmount?: string;
        fiatCurrency?: string;
        walletAddress?: string;
    }) => void;
    close: () => void;
    status: TransakCheckoutStatus;
    /** The Secure Widget URL to open in a new tab once `status` is `'ready'`. */
    widgetUrl: string | null;
    error: Error | null;
    reset: () => void;
    /**
     * Call once the user confirms they finished the purchase in the Transak
     * tab. Opening Transak in its own tab (rather than an embedded iframe --
     * see the PR this shipped in for why) means there is no postMessage/order
     * event to detect completion automatically, so callers drive `status` to
     * `'success'` explicitly.
     */
    markCompleted: () => void;
};

export const useTransakCheckout = (
    onSuccess?: () => void,
    onError?: (error: Error) => void,
): UseTransakCheckoutResult => {
    const { transak: transakConfig, network } = useVeChainKitConfig();
    const { account } = useWallet();
    const [isOpen, setIsOpen] = useState(false);
    const [status, setStatus] = useState<TransakCheckoutStatus>('idle');
    const [widgetUrl, setWidgetUrl] = useState<string | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const genRef = useRef(0);
    const onSuccessRef = useRef(onSuccess);
    onSuccessRef.current = onSuccess;
    const onErrorRef = useRef(onError);
    onErrorRef.current = onError;

    const reset = useCallback(() => {
        setStatus('idle');
        setWidgetUrl(null);
        setError(null);
    }, []);

    const open = useCallback(
        async (params?: {
            fiatAmount?: string;
            fiatCurrency?: string;
            walletAddress?: string;
        }) => {
            if (!transakConfig?.widgetUrlBuilder) {
                const err = new Error(
                    'Transak is not configured. Provide a `transak.widgetUrlBuilder` to VeChainKitProvider that returns a Secure Widget URL from your backend.',
                );
                setError(err);
                setStatus('error');
                onErrorRef.current?.(err);
                return;
            }

            const walletAddress = params?.walletAddress ?? account?.address;
            if (!walletAddress || !isAddress(walletAddress)) {
                const err = new Error('No wallet address available');
                setError(err);
                setStatus('error');
                onErrorRef.current?.(err);
                return;
            }

            setStatus('processing');
            setIsOpen(true);
            setWidgetUrl(null);

            genRef.current += 1;
            const gen = genRef.current;

            try {
                const environment =
                    transakConfig?.environment ??
                    (network.type === 'main' ? 'production' : 'staging');

                const url = await transakConfig.widgetUrlBuilder({
                    walletAddress,
                    fiatAmount: params?.fiatAmount ?? '10',
                    fiatCurrency: params?.fiatCurrency ?? 'USD',
                    cryptoCurrency: 'VET',
                    network: 'vechain',
                    environment,
                });

                if (genRef.current !== gen) {
                    // A newer open() call has superseded this one.
                    return;
                }

                setWidgetUrl(url);
                setStatus('ready');
            } catch (err) {
                if (genRef.current !== gen) {
                    return;
                }
                const error =
                    err instanceof Error
                        ? err
                        : new Error('Failed to open Transak');
                setError(error);
                setStatus('error');
                onErrorRef.current?.(error);
            }
        },
        [transakConfig, network.type, account?.address],
    );

    const markCompleted = useCallback(() => {
        setStatus('success');
        onSuccessRef.current?.();
    }, []);

    const close = useCallback(() => {
        setIsOpen(false);
        setTimeout(reset, 300);
    }, [reset]);

    return {
        isOpen,
        open,
        close,
        status,
        widgetUrl,
        error,
        reset,
        markCompleted,
    };
};
