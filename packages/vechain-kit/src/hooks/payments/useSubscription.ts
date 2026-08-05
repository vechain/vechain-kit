'use client';

import { useState, useCallback, useEffect } from 'react';
import { useVeChainKitConfig } from '@/providers';
import {
    SubscriptionPlan,
    UserSubscription,
    SubscriptionTypedData,
} from '@/types';
import { useSignTypedData } from '@/hooks/signing';
import { useWallet } from '@/hooks/api/wallet/useWallet';
import {
    buildSubscriptionAction,
    buildSubscriptionAuthorization,
} from '@/utils/subscriptions';

export type UseSubscriptionResult = {
    createSubscription: (plan: SubscriptionPlan) => Promise<UserSubscription>;
    pauseSubscription: (subscriptionId: string) => Promise<void>;
    resumeSubscription: (subscriptionId: string) => Promise<void>;
    cancelSubscription: (subscriptionId: string) => Promise<void>;
    currentSubscription: UserSubscription | null;
    availablePlans: SubscriptionPlan[];
    fetchPlans: () => Promise<void>;
    isLoading: boolean;
    isSigningPending: boolean;
    error: Error | null;
    refresh: () => Promise<void>;
};

export const useSubscription = (): UseSubscriptionResult => {
    const { subscriptions, network } = useVeChainKitConfig();
    const { account } = useWallet();
    const { signTypedData, isSigningPending } = useSignTypedData();

    const [currentSubscription, setCurrentSubscription] =
        useState<UserSubscription | null>(null);
    const [availablePlans, setAvailablePlans] = useState<SubscriptionPlan[]>(
        [],
    );
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const apiBaseUrl = subscriptions?.apiBaseUrl;
    const networkType = network.type;
    const accountAddress = account?.address;

    const signAuthorization = useCallback(
        async (data: SubscriptionTypedData): Promise<string> => {
            if (subscriptions?.signAuthorization) {
                return subscriptions.signAuthorization(data);
            }
            return signTypedData({
                domain: data.domain,
                types: data.types,
                primaryType: data.primaryType,
                message: data.message,
            });
        },
        [subscriptions?.signAuthorization, signTypedData],
    );

    const fetchPlans = useCallback(async () => {
        if (!apiBaseUrl) {
            setAvailablePlans(subscriptions?.plans ?? []);
            return;
        }

        const response = await fetch(`${apiBaseUrl}/subscriptions/plans`);
        if (!response.ok) throw new Error('Failed to fetch subscription plans');
        const plans: SubscriptionPlan[] = await response.json();
        setAvailablePlans(plans);
    }, [apiBaseUrl, subscriptions?.plans]);

    const fetchCurrentSubscription = useCallback(async () => {
        if (!apiBaseUrl || !accountAddress) return;

        const response = await fetch(
            `${apiBaseUrl}/subscriptions/current?address=${accountAddress}`,
        );
        if (response.status === 404) {
            setCurrentSubscription(null);
            return;
        }
        if (!response.ok) {
            setCurrentSubscription(null);
            return;
        }
        setCurrentSubscription(await response.json());
    }, [apiBaseUrl, accountAddress]);

    const refresh = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            await Promise.all([fetchPlans(), fetchCurrentSubscription()]);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err
                    : new Error('Failed to load subscription data'),
            );
        } finally {
            setIsLoading(false);
        }
    }, [fetchPlans, fetchCurrentSubscription]);

    useEffect(() => {
        refresh();
    }, [apiBaseUrl, accountAddress, refresh]);

    const createSubscription = useCallback(
        async (plan: SubscriptionPlan): Promise<UserSubscription> => {
            setError(null);
            if (!plan.cryptoPayment?.recipientAddress) {
                throw new Error('Plan has no on-chain payment details');
            }

            const authorization = buildSubscriptionAuthorization(
                plan,
                networkType,
            );
            const signature = await signAuthorization(authorization);

            if (!apiBaseUrl) {
                const demo: UserSubscription = {
                    id: `sub_${Date.now()}`,
                    planId: plan.id,
                    status: 'active',
                    currentPeriodStart: new Date().toISOString(),
                    currentPeriodEnd: new Date(
                        Date.now() + 30 * 24 * 60 * 60 * 1000,
                    ).toISOString(),
                    cancelAtPeriodEnd: false,
                };
                setCurrentSubscription(demo);
                return demo;
            }

            const response = await fetch(`${apiBaseUrl}/subscriptions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    planId: plan.id,
                    authorization: {
                        domain: authorization.domain,
                        types: authorization.types,
                        primaryType: authorization.primaryType,
                        message: authorization.message,
                        signature,
                    },
                }),
            });

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                throw new Error(
                    data.message || 'Failed to create subscription',
                );
            }

            const subscription: UserSubscription = await response.json();
            setCurrentSubscription(subscription);
            return subscription;
        },
        [apiBaseUrl, networkType, signAuthorization],
    );

    const runAction = useCallback(
        async (
            subscriptionId: string,
            action: 'pause' | 'resume' | 'cancel',
        ) => {
            setError(null);
            const authorization = buildSubscriptionAction(
                subscriptionId,
                action,
                networkType,
            );
            const signature = await signAuthorization(authorization);

            if (!apiBaseUrl) {
                setCurrentSubscription((sub) =>
                    sub && sub.id === subscriptionId
                        ? {
                              ...sub,
                              status:
                                  action === 'cancel'
                                      ? 'canceled'
                                      : action === 'pause'
                                        ? 'paused'
                                        : 'active',
                              cancelAtPeriodEnd: action === 'cancel',
                          }
                        : sub,
                );
                return;
            }

            const response = await fetch(
                `${apiBaseUrl}/subscriptions/${subscriptionId}/${action}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        authorization: {
                            domain: authorization.domain,
                            types: authorization.types,
                            primaryType: authorization.primaryType,
                            message: authorization.message,
                            signature,
                        },
                    }),
                },
            );

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                throw new Error(data.message || `Failed to ${action} subscription`);
            }

            await fetchCurrentSubscription();
        },
        [apiBaseUrl, networkType, signAuthorization, fetchCurrentSubscription],
    );

    const pauseSubscription = useCallback(
        (subscriptionId: string) => runAction(subscriptionId, 'pause'),
        [runAction],
    );
    const resumeSubscription = useCallback(
        (subscriptionId: string) => runAction(subscriptionId, 'resume'),
        [runAction],
    );
    const cancelSubscription = useCallback(
        (subscriptionId: string) => runAction(subscriptionId, 'cancel'),
        [runAction],
    );

    return {
        createSubscription,
        pauseSubscription,
        resumeSubscription,
        cancelSubscription,
        currentSubscription,
        availablePlans,
        fetchPlans,
        isLoading,
        isSigningPending,
        error,
        refresh,
    };
};
