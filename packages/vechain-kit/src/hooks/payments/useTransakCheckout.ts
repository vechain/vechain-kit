'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useVeChainKitConfig } from '@/providers';
import { useWallet } from '@/hooks';

export type TransakCheckoutStatus = 'idle' | 'processing' | 'success' | 'error';

/** DOM id of the container the Transak iframe is embedded into. Rendering the
 * widget inside the host modal (instead of the SDK's own full-screen overlay)
 * avoids focus-trap conflicts that make the widget flicker/unfocus on click. */
export const TRANSAK_WIDGET_CONTAINER_ID = 'vechain-kit-transak-widget-container';

export type UseTransakCheckoutResult = {
    isOpen: boolean;
    open: (params?: {
        fiatAmount?: string;
        fiatCurrency?: string;
        walletAddress?: string;
    }) => void;
    close: () => void;
    status: TransakCheckoutStatus;
    orderId: string | null;
    error: Error | null;
    reset: () => void;
};

const setupTransak = (
    TransakSDK: any,
    widgetUrl: string,
    handlers: {
        onOrderSuccessful: (data: { orderId?: string }) => void;
        onOrderFailed: (data: { failureReason?: string }) => void;
        onWidgetClose: () => void;
    },
): { instance: any } => {
    const instance = new TransakSDK({
        widgetUrl,
        containerId: TRANSAK_WIDGET_CONTAINER_ID,
    });

    TransakSDK.on(
        TransakSDK.EVENTS.TRANSAK_ORDER_SUCCESSFUL,
        handlers.onOrderSuccessful,
    );
    TransakSDK.on(
        TransakSDK.EVENTS.TRANSAK_ORDER_FAILED,
        handlers.onOrderFailed,
    );
    TransakSDK.on(
        TransakSDK.EVENTS.TRANSAK_WIDGET_CLOSE,
        handlers.onWidgetClose,
    );

    instance.init();

    return { instance };
};

export const useTransakCheckout = (
    onSuccess?: () => void,
    onError?: (error: Error) => void,
): UseTransakCheckoutResult => {
    const { transak: transakConfig } = useVeChainKitConfig();
    const { account } = useWallet();
    const [isOpen, setIsOpen] = useState(false);
    const [status, setStatus] = useState<TransakCheckoutStatus>('idle');
    const [orderId, setOrderId] = useState<string | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const instanceRef = useRef<any>(null);
    const genRef = useRef(0);
    const onSuccessRef = useRef(onSuccess);
    onSuccessRef.current = onSuccess;
    const onErrorRef = useRef(onError);
    onErrorRef.current = onError;

    const reset = useCallback(() => {
        setStatus('idle');
        setOrderId(null);
        setError(null);
    }, []);

    // Remove the embedded iframe from its container when the widget is closed
    // so repeated opens don't leave stale iframes behind. Uses the SDK's
    // `cleanup()` (not `close()`), which actually removes the iframe element in
    // container mode.
    const removeEmbeddedWidget = useCallback(() => {
        instanceRef.current?.cleanup();
        instanceRef.current = null;
        document.getElementById(TRANSAK_WIDGET_CONTAINER_ID)?.replaceChildren();
    }, []);

    useEffect(() => {
        return () => {
            removeEmbeddedWidget();
        };
    }, [removeEmbeddedWidget]);

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
            if (!walletAddress) {
                const err = new Error('No wallet address available');
                setError(err);
                setStatus('error');
                onErrorRef.current?.(err);
                return;
            }

            setStatus('processing');
            setIsOpen(true);

            try {
                removeEmbeddedWidget();
                genRef.current += 1;
                const gen = genRef.current;

                const { Transak: TransakSDK } = await import(
                    '@transak/ui-js-sdk'
                );

                const widgetUrl = await transakConfig.widgetUrlBuilder({
                    walletAddress,
                    fiatAmount: params?.fiatAmount ?? '50',
                    fiatCurrency: params?.fiatCurrency ?? 'USD',
                    cryptoCurrency: 'VET',
                    network: 'vechain',
                });

                const { instance } = setupTransak(TransakSDK, widgetUrl, {
                    onOrderSuccessful: (data) => {
                        if (genRef.current !== gen) return;
                        setOrderId(data.orderId ?? null);
                        setStatus('success');
                        onSuccessRef.current?.();
                    },
                    onOrderFailed: (data) => {
                        if (genRef.current !== gen) return;
                        const err = new Error(
                            data.failureReason ?? 'Transak order failed',
                        );
                        setError(err);
                        setStatus('error');
                        onErrorRef.current?.(err);
                    },
                    onWidgetClose: () => {
                        if (genRef.current !== gen) return;
                        setIsOpen(false);
                        setStatus((prev) =>
                            prev === 'processing' ? 'idle' : prev,
                        );
                    },
                });

                instanceRef.current = instance;
            } catch (err) {
                const error =
                    err instanceof Error
                        ? err
                        : new Error('Failed to open Transak');
                setError(error);
                setStatus('error');
                onErrorRef.current?.(error);
            }
        },
        [transakConfig, account?.address],
    );

    const close = useCallback(() => {
        removeEmbeddedWidget();
        setIsOpen(false);
        setTimeout(reset, 300);
    }, [removeEmbeddedWidget, reset]);

    return {
        isOpen,
        open,
        close,
        status,
        orderId,
        error,
        reset,
    };
};
