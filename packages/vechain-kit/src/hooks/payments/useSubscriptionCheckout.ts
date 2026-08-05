'use client';

import { useState, useCallback, useMemo } from 'react';
import { useDisclosure } from '@chakra-ui/react';
import { useSubscription } from './useSubscription';
import { useSendTransaction } from '@/hooks/thor/transactions/useSendTransaction';
import { useWallet } from '@/hooks/api/wallet/useWallet';
import { useVeChainKitConfig } from '@/providers';
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
    /** True when a fiat onramp (Privy/Stripe) is configured on VeChainKitProvider. */
    hasFiat: boolean;
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
    const { fiatOnramp } = useVeChainKitConfig();
    const hasFiat = !!fiatOnramp;

    const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
    const [status, setStatus] = useState<SubscriptionCheckoutStatus>('idle');
    const [error, setError] = useState<Error | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('fiat');
    const [cryptoSubscription, setCryptoSubscription] =
        useState<UserSubscription | null>(null);

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

    const selectPlan = useCallback(
        (p: SubscriptionPlan) => {
            setPlan(p);
            setStatus('selecting');
            setError(null);
            setPaymentMethod(
                p.cryptoPayment ? 'crypto' : hasFiat ? 'fiat' : 'crypto',
            );
        },
        [hasFiat],
    );

    const selectPaymentMethod = useCallback((pm: PaymentMethod) => {
        setPaymentMethod(pm);
    }, []);

    const open = useCallback(
        (p?: SubscriptionPlan) => {
            reset();
            if (p) {
                setPlan(p);
                setStatus('selecting');
                setPaymentMethod(
                    p.cryptoPayment ? 'crypto' : hasFiat ? 'fiat' : 'crypto',
                );
            }
            onOpen();
        },
        [reset, onOpen, hasFiat],
    );

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

        try {
            await createSubscription(plan.id, 'stripe_payment_method');
            setStatus('success');
            options?.onSuccess?.();
        } catch (err) {
            const error =
                err instanceof Error
                    ? err
                    : new Error('Subscription failed');
            setError(error);
            setStatus('error');
            options?.onError?.(error);
        }
    }, [
        plan,
        paymentMethod,
        createSubscription,
        sendTransaction,
        cryptoClauses,
        options,
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
        error: error ?? subError,
        reset,
        isLoading,
        isTransactionPending,
        isWaitingForWalletConfirmation,
        hasFiat,
    };
};
