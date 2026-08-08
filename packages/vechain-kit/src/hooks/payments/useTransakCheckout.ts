'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { isAddress } from 'viem';
import { useVeChainKitConfig } from '@/providers';
import { useWallet } from '@/hooks';

export type TransakCheckoutStatus =
    | 'idle'
    | 'processing'
    | 'ready'
    | 'success'
    | 'error';

/** Transak's Secure Widget URL is single-use and valid for 5 minutes
 * (docs/recipes/transak-onramp.md) -- past either bound, `widgetUrlExpired`
 * flips so callers can prompt the user to generate a fresh one instead of
 * following a dead link. */
const WIDGET_URL_TTL_MS = 5 * 60 * 1000;

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
    /** True once `widgetUrl` can no longer be used (5 minutes elapsed, or
     * `markWidgetUrlOpened` was called) -- callers should ask the user to
     * regenerate it (via `open()` again) rather than link to it. */
    widgetUrlExpired: boolean;
    /** Call when the user follows `widgetUrl` (e.g. the link's `onClick`) --
     * the URL is single-use, so this marks it unusable for a second click. */
    markWidgetUrlOpened: () => void;
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
    const [widgetUrlExpired, setWidgetUrlExpired] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const genRef = useRef(0);
    const expiryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const onSuccessRef = useRef(onSuccess);
    onSuccessRef.current = onSuccess;
    const onErrorRef = useRef(onError);
    onErrorRef.current = onError;

    const clearExpiryTimer = useCallback(() => {
        if (expiryTimerRef.current) {
            clearTimeout(expiryTimerRef.current);
            expiryTimerRef.current = null;
        }
    }, []);

    useEffect(() => clearExpiryTimer, [clearExpiryTimer]);

    const reset = useCallback(() => {
        clearExpiryTimer();
        setStatus('idle');
        setWidgetUrl(null);
        setWidgetUrlExpired(false);
        setError(null);
    }, [clearExpiryTimer]);

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
            clearExpiryTimer();

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
                    // A newer open() call, or a close()/reset() in between,
                    // has superseded this one.
                    return;
                }

                setWidgetUrl(url);
                setWidgetUrlExpired(false);
                setStatus('ready');
                expiryTimerRef.current = setTimeout(() => {
                    if (genRef.current === gen) setWidgetUrlExpired(true);
                }, WIDGET_URL_TTL_MS);
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
        [transakConfig, network.type, account?.address, clearExpiryTimer],
    );

    const markWidgetUrlOpened = useCallback(() => {
        clearExpiryTimer();
        setWidgetUrlExpired(true);
    }, [clearExpiryTimer]);

    const markCompleted = useCallback(() => {
        setStatus((current) => {
            if (current === 'success') return current;
            onSuccessRef.current?.();
            return 'success';
        });
    }, []);

    const close = useCallback(() => {
        // Invalidate any in-flight widgetUrlBuilder call so a late resolve
        // cannot move the closed checkout back to 'ready'.
        genRef.current += 1;
        clearExpiryTimer();
        setIsOpen(false);
        setTimeout(reset, 300);
    }, [reset, clearExpiryTimer]);

    return {
        isOpen,
        open,
        close,
        status,
        widgetUrl,
        widgetUrlExpired,
        markWidgetUrlOpened,
        error,
        reset,
        markCompleted,
    };
};
