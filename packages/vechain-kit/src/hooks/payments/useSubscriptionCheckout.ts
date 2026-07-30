'use client';

import { useState, useCallback, useMemo, useRef } from 'react';
import { useDisclosure } from '@chakra-ui/react';
import { useSubscription } from './useSubscription';
import { useTransakCheckout } from './useTransakCheckout';
import { useSendTransaction } from '@/hooks/thor/transactions/useSendTransaction';
import { useWallet } from '@/hooks/api/wallet/useWallet';
import { SubscriptionPlan, UserSubscription } from '@/types';
import { parseEther, parseUnits } from 'viem';

export type UseSubscriptionCheckoutOptions = {
    onSuccess?: () => void;
    onError?: (error: Error) => void;
};

export type SubscriptionCheckoutStatus =
    | 'idle'
    | 'selecting'
    | 'processing'
    | 'success'
    | 'error';

export type PaymentMethod = 'fiat' | 'crypto';

export type UseSubscriptionCheckoutReturn = {
    isOpen: boolean;
    open: (plan?: SubscriptionPlan) => void;
    close: () => void;
    plan: SubscriptionPlan | null;
    selectPlan: (plan: SubscriptionPlan) => void;
    subscribe: () => Promise<void>;
    status: SubscriptionCheckoutStatus;
    paymentMethod: PaymentMethod;
    selectPaymentMethod: (pm: PaymentMethod) => void;
    availablePlans: SubscriptionPlan[];
    currentSubscription: UserSubscription | null;
    error: Error | null;
    reset: () => void;
    isLoading: boolean;
    isTransactionPending: boolean;
    isWaitingForWalletConfirmation: boolean;
    /** Re-initialized every render — call to open Transak widget for fiat funding */
    transakOpen: (params?: {
        fiatAmount?: string;
        fiatCurrency?: string;
    }) => void;
    transakStatus: 'idle' | 'processing' | 'success' | 'error';
};

// ERC-20 / VIP-180 transfer function selector
const ERC20_TRANSFER_SELECTOR = '0xa9059cbb';

const encodeTransferData = (to: string, amount: bigint): string => {
    const toPadded = to.slice(2).padStart(64, '0');
    const amountPadded = amount.toString(16).padStart(64, '0');
    return `${ERC20_TRANSFER_SELECTOR}${toPadded}${amountPadded}`;
};

export const useSubscriptionCheckout = (
    options?: UseSubscriptionCheckoutOptions,
): UseSubscriptionCheckoutReturn => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const {
        createSubscription,
        currentSubscription: apiSubscription,
        availablePlans,
        isLoading: subLoading,
        error: subError,
    } = useSubscription();

    const { account } = useWallet();

    const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
    const [status, setStatus] = useState<SubscriptionCheckoutStatus>('idle');
    const [error, setError] = useState<Error | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('fiat');
    const [cryptoSubscription, setCryptoSubscription] =
        useState<UserSubscription | null>(null);

    const planRef = useRef(plan);
    planRef.current = plan;
    const optionsRef = useRef(options);
    optionsRef.current = options;

    const {
        open: transakOpen,
        status: transakStatus,
        error: transakError,
    } = useTransakCheckout(
        // onSuccess
        useCallback(() => {
            const currentPlan = planRef.current;
            const currentOptions = optionsRef.current;
            if (!currentPlan) return;

            createSubscription(currentPlan.id, 'transak')
                .then(() => {
                    setStatus('success');
                    currentOptions?.onSuccess?.();
                })
                .catch((err) => {
                    const error =
                        err instanceof Error
                            ? err
                            : new Error('Subscription failed');
                    setError(error);
                    setStatus('error');
                    currentOptions?.onError?.(error);
                });
        }, [createSubscription]),
        // onError
        useCallback(
            (err: Error) => {
                setError(err);
                setStatus('error');
                optionsRef.current?.onError?.(err);
            },
            [],
        ),
    );

    const cryptoClauses = useMemo(() => {
        if (!plan?.cryptoPayment || !account?.address) return [];
        const { recipientAddress, tokenAddress, amount } = plan.cryptoPayment;

        if (tokenAddress) {
            return [
                {
                    to: tokenAddress as `0x${string}`,
                    value: '0x0',
                    data: encodeTransferData(
                        recipientAddress,
                        parseUnits(amount, 18),
                    ),
                    comment: `Subscription payment: ${plan.name}`,
                },
            ];
        }

        return [
            {
                to: recipientAddress as `0x${string}`,
                value: parseEther(amount).toString(),
                data: '0x',
                comment: `Subscription payment: ${plan.name}`,
            },
        ];
    }, [plan, account?.address]);

    const {
        sendTransaction,
        isTransactionPending,
        isWaitingForWalletConfirmation,
    } = useSendTransaction({
        signerAccountAddress: account?.address ?? '',
        onTxConfirmed: async () => {
            const mock: UserSubscription = {
                id: `sub_crypto_${Date.now()}`,
                planId: plan?.id ?? '',
                status: 'active',
                currentPeriodStart: new Date().toISOString(),
                currentPeriodEnd: new Date(
                    Date.now() + 30 * 24 * 60 * 60 * 1000,
                ).toISOString(),
                cancelAtPeriodEnd: false,
            };
            setCryptoSubscription(mock);
            setStatus('success');
            options?.onSuccess?.();
        },
        onTxFailedOrCancelled: async (err) => {
            const error =
                err instanceof Error
                    ? err
                    : new Error('Transaction failed');
            setError(error);
            setStatus('error');
            options?.onError?.(error);
        },
    });

    const reset = useCallback(() => {
        setStatus('idle');
        setPlan(null);
        setError(null);
        setPaymentMethod('fiat');
        setCryptoSubscription(null);
    }, []);

    const selectPlan = useCallback((p: SubscriptionPlan) => {
        setPlan(p);
        setStatus('selecting');
        setError(null);
        setPaymentMethod(p.cryptoPayment ? 'crypto' : 'fiat');
    }, []);

    const selectPaymentMethod = useCallback((pm: PaymentMethod) => {
        setPaymentMethod(pm);
    }, []);

    const open = useCallback((p?: SubscriptionPlan) => {
        reset();
        if (p) {
            setPlan(p);
            setStatus('selecting');
            setPaymentMethod(p.cryptoPayment ? 'crypto' : 'fiat');
        }
        onOpen();
    }, [reset, onOpen]);

    const close = useCallback(() => {
        onClose();
        setTimeout(reset, 300);
    }, [onClose, reset]);

    const subscribe = useCallback(async () => {
        if (!plan) {
            setError(new Error('No plan selected'));
            return;
        }

        setStatus('processing');
        setError(null);

        if (paymentMethod === 'crypto' && plan.cryptoPayment) {
            try {
                await sendTransaction(cryptoClauses);
            } catch (err) {
                const error =
                    err instanceof Error
                        ? err
                        : new Error('Transaction failed');
                setError(error);
                setStatus('error');
                options?.onError?.(error);
            }
            return;
        }

        if (paymentMethod === 'fiat') {
            transakOpen({
                fiatAmount: plan.amount,
            });
            return;
        }

        setError(new Error('Unsupported payment method'));
        setStatus('error');
    }, [
        plan,
        paymentMethod,
        sendTransaction,
        cryptoClauses,
        options,
        transakOpen,
    ]);

    const currentSubscription = cryptoSubscription ?? apiSubscription;
    const isLoading = subLoading || isTransactionPending;

    return {
        isOpen,
        open,
        close,
        plan,
        selectPlan,
        subscribe,
        status,
        paymentMethod,
        selectPaymentMethod,
        availablePlans,
        currentSubscription,
        error: error ?? subError ?? transakError,
        reset,
        isLoading,
        isTransactionPending,
        isWaitingForWalletConfirmation,
        transakOpen,
        transakStatus,
    };
};
