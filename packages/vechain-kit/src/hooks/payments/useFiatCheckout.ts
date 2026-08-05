'use client';

import { useState, useCallback } from 'react';
import { useDisclosure } from '@chakra-ui/react';
import { useBuyCrypto } from './useBuyCrypto';
import { CURRENCY } from '@/types';

export type FiatCheckoutProduct = {
    name: string;
    description?: string;
};

export type UseFiatCheckoutOptions = {
    amount: string;
    product?: FiatCheckoutProduct;
    currency?: CURRENCY;
    onSuccess?: () => void;
    onError?: (error: Error) => void;
};

export type FiatCheckoutStatus = 'idle' | 'processing' | 'success' | 'error';

export type UseFiatCheckoutReturn = {
    isOpen: boolean;
    open: () => void;
    close: () => void;
    checkout: () => Promise<void>;
    status: FiatCheckoutStatus;
    error: Error | null;
    reset: () => void;
};

export const useFiatCheckout = (
    options: UseFiatCheckoutOptions,
): UseFiatCheckoutReturn => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { buyCrypto } = useBuyCrypto();
    const [status, setStatus] = useState<FiatCheckoutStatus>('idle');
    const [error, setError] = useState<Error | null>(null);

    const reset = useCallback(() => {
        setStatus('idle');
        setError(null);
    }, []);

    const checkout = useCallback(async () => {
        setStatus('processing');
        setError(null);

        try {
            await buyCrypto({
                amount: options.amount,
                currency: options.currency ?? 'usd',
            });

            setStatus('success');
            options.onSuccess?.();
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Checkout failed');
            setError(error);
            setStatus('error');
            options.onError?.(error);
        }
    }, [options, buyCrypto]);

    const open = useCallback(() => {
        reset();
        onOpen();
    }, [reset, onOpen]);

    const close = useCallback(() => {
        onClose();
        setTimeout(reset, 300);
    }, [onClose, reset]);

    return {
        isOpen,
        open,
        close,
        checkout,
        status,
        error,
        reset,
    };
};
