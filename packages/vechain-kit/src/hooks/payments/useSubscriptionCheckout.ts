'use client';

import { useState, useCallback, useMemo, useRef } from 'react';
import { useDisclosure } from '@chakra-ui/react';
import { useSubscription } from './useSubscription';
import { useSendTransaction } from '@/hooks/thor/transactions/useSendTransaction';
import { useWallet } from '@/hooks/api/wallet/useWallet';
import { useThor } from '@vechain/dapp-kit-react';
import { SubscriptionPlan, UserSubscription } from '@/types';
import { parseEther, parseUnits, isAddress } from 'viem';
import { IERC20__factory } from '@vechain/vechain-contract-types';
import { ZERO_ADDRESS } from '@/utils/subscriptions';

export type UseSubscriptionCheckoutOptions = {
    onSuccess?: () => void;
    onError?: (error: Error) => void;
};

export type SubscriptionCheckoutStatus =
    | 'idle'
    | 'processing'
    | 'success'
    | 'error';

export type UseSubscriptionCheckoutReturn = {
    isOpen: boolean;
    open: (plan?: SubscriptionPlan) => void;
    close: () => void;
    plan: SubscriptionPlan | null;
    subscribe: () => Promise<void>;
    status: SubscriptionCheckoutStatus;
    availablePlans: SubscriptionPlan[];
    currentSubscription: UserSubscription | null;
    error: Error | null;
    reset: () => void;
    isLoading: boolean;
    isSigningPending: boolean;
    isTransactionPending: boolean;
    isWaitingForWalletConfirmation: boolean;
};

/**
 * Checkout flow for crypto-backed subscriptions:
 *
 * 1. On-chain first payment: for ERC-20 plans the user approves a capped
 *    allowance (`maxPeriods` × period amount, or unlimited when `maxPeriods`
 *    is 0) and transfers the first period; VET plans just transfer VET.
 * 2. The kit builds the EIP-712 `Subscribe` typed message and signs it with
 *    the connected wallet.
 * 3. The signed authorization is submitted to the backend, which recovers the
 *    signer (no Bearer token) and activates the subscription.
 *
 * ERC-20 plans authorize a capped allowance so the backend keeper can
 * auto-pull subsequent periods via fee-delegated `transferFrom`. VET plans
 * are paid manually each period — there is no allowance mechanism for VET,
 * so the backend must not auto-pull.
 */
export const useSubscriptionCheckout = (
    options?: UseSubscriptionCheckoutOptions,
): UseSubscriptionCheckoutReturn => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const {
        createSubscription,
        currentSubscription,
        availablePlans,
        isLoading: subLoading,
        isSigningPending,
        error: subError,
    } = useSubscription();

    const { account } = useWallet();
    const thor = useThor();

    const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
    const [status, setStatus] = useState<SubscriptionCheckoutStatus>('idle');
    const [error, setError] = useState<Error | null>(null);
    const [onChainSubscription, setOnChainSubscription] =
        useState<UserSubscription | null>(null);

    const planRef = useRef(plan);
    planRef.current = plan;
    const optionsRef = useRef(options);
    optionsRef.current = options;

    const {
        sendTransaction,
        isTransactionPending,
        isWaitingForWalletConfirmation,
    } = useSendTransaction({
        signerAccountAddress: account?.address ?? '',
        onTxConfirmed: async () => {
            const currentPlan = planRef.current;
            const currentOptions = optionsRef.current;
            if (!currentPlan) return;

            try {
                const subscription =
                    await createSubscription(currentPlan);
                setOnChainSubscription(subscription);
                setStatus('success');
                currentOptions?.onSuccess?.();
            } catch (err) {
                const error =
                    err instanceof Error
                        ? err
                        : new Error('Subscription failed');
                setError(error);
                setStatus('error');
                currentOptions?.onError?.(error);
            }
        },
        onTxFailedOrCancelled: async (err) => {
            const error =
                err instanceof Error
                    ? err
                    : new Error('Transaction failed');
            setError(error);
            setStatus('error');
            optionsRef.current?.onError?.(error);
        },
    });

    /** Clauses that pay the first period and authorize the keeper to auto-pull. */
    const paymentClauses = useMemo(() => {
        const currentPlan = plan;
        if (!currentPlan?.cryptoPayment || !account?.address) return [];

        const { recipientAddress, tokenAddress, amount } =
            currentPlan.cryptoPayment;

        if (!isAddress(recipientAddress)) return [];

        if (tokenAddress && tokenAddress !== ZERO_ADDRESS) {
            if (!isAddress(tokenAddress)) return [];
            const tokenContract = thor.contracts.load(
                tokenAddress,
                IERC20__factory.abi,
            );

            const periodAmount = parseUnits(amount, 18);
            const maxPeriods = currentPlan.cryptoPayment?.maxPeriods ?? 0;
            const allowance =
                maxPeriods <= 0
                    ? (2n ** 256n) - 1n
                    : periodAmount * BigInt(maxPeriods);

            return [
                {
                    ...tokenContract.clause
                        .approve(recipientAddress, allowance)
                        .clause,
                    comment: 'Approve subscription auto-pull',
                },
                {
                    ...tokenContract.clause
                        .transfer(recipientAddress, periodAmount)
                        .clause,
                    comment: `Subscription payment: ${currentPlan.name}`,
                },
            ];
        }

        return [
            {
                to: recipientAddress as `0x${string}`,
                value: parseEther(amount).toString(),
                data: '0x',
                comment: `Subscription payment: ${currentPlan.name}`,
            },
        ];
    }, [plan, account?.address, thor]);

    const reset = useCallback(() => {
        setStatus('idle');
        setPlan(null);
        setError(null);
        setOnChainSubscription(null);
    }, []);

    const open = useCallback(
        (p?: SubscriptionPlan) => {
            reset();
            if (p) setPlan(p);
            onOpen();
        },
        [reset, onOpen],
    );

    const close = useCallback(() => {
        onClose();
        setTimeout(reset, 300);
    }, [onClose, reset]);

    const subscribe = useCallback(async () => {
        const currentPlan = planRef.current;
        if (!currentPlan) {
            setError(new Error('No plan selected'));
            setStatus('error');
            return;
        }

        setStatus('processing');
        setError(null);

        if (!currentPlan.cryptoPayment?.recipientAddress) {
            setError(new Error('Plan has no on-chain payment details'));
            setStatus('error');
            return;
        }

        try {
            await sendTransaction(paymentClauses);
        } catch (err) {
            const error =
                err instanceof Error
                    ? err
                    : new Error('Transaction failed');
            setError(error);
            setStatus('error');
            options?.onError?.(error);
        }
    }, [sendTransaction, paymentClauses, options]);

    const current = onChainSubscription ?? currentSubscription;
    const isLoading = subLoading || isTransactionPending;

    return {
        isOpen,
        open,
        close,
        plan,
        subscribe,
        status,
        availablePlans,
        currentSubscription: current,
        error: error ?? subError,
        reset,
        isLoading,
        isSigningPending,
        isTransactionPending,
        isWaitingForWalletConfirmation,
    };
};
