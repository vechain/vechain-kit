'use client';

import { useState, useCallback, useEffect } from 'react';
import { useVeChainKitConfig } from '@/providers';
import { SubscriptionPlan, UserSubscription } from '@/types';

export type UseSubscriptionResult = {
    createSubscription: (planId: string, paymentMethodId: string) => Promise<UserSubscription>;
    cancelSubscription: (subscriptionId: string) => Promise<void>;
    currentSubscription: UserSubscription | null;
    availablePlans: SubscriptionPlan[];
    isLoading: boolean;
    error: Error | null;
    refresh: () => Promise<void>;
};

export const useSubscription = (): UseSubscriptionResult => {
    const { subscriptions } = useVeChainKitConfig();
    const [currentSubscription, setCurrentSubscription] = useState<UserSubscription | null>(null);
    const [availablePlans, setAvailablePlans] = useState<SubscriptionPlan[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const apiBaseUrl = subscriptions?.apiBaseUrl;

    const fetchPlans = useCallback(async () => {
        try {
            if (!apiBaseUrl) {
                setAvailablePlans([
                    {
                        id: 'free',
                        name: 'Free',
                        description: 'Basic features at no cost.',
                        amount: '0',
                        currency: 'usd',
                        interval: 'month',
                        features: ['Basic features', 'Community support'],
                    },
                    {
                        id: 'premium-monthly',
                        name: 'Premium',
                        description: 'Unlock all premium features.',
                        amount: '9.99',
                        currency: 'usd',
                        interval: 'month',
                        features: ['All basic features', 'Priority support', 'Advanced analytics'],
                    },
                    {
                        id: 'enterprise-yearly',
                        name: 'Enterprise',
                        description: 'For large-scale deployments.',
                        amount: '99.99',
                        currency: 'usd',
                        interval: 'year',
                        features: [
                            'All premium features',
                            'Dedicated support',
                            'Custom integrations',
                            'SLA guarantee',
                        ],
                    },
                ]);
                return;
            }

            const response = await fetch(`${apiBaseUrl}/subscriptions/plans`);
            if (!response.ok) throw new Error('Failed to fetch plans');
            const plans = await response.json();
            setAvailablePlans(plans);
        } catch (err) {
            console.error('Failed to fetch subscription plans:', err);
        }
    }, [apiBaseUrl]);

    const fetchCurrentSubscription = useCallback(async () => {
        if (!apiBaseUrl) return;

        try {
            const response = await fetch(`${apiBaseUrl}/subscriptions/current`);
            if (response.ok) {
                const sub = await response.json();
                setCurrentSubscription(sub);
            } else {
                setCurrentSubscription(null);
            }
        } catch (err) {
            console.error('Failed to fetch current subscription:', err);
            setCurrentSubscription(null);
        }
    }, [apiBaseUrl]);

    const refresh = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            await Promise.all([fetchPlans(), fetchCurrentSubscription()]);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to load subscription data'));
        } finally {
            setIsLoading(false);
        }
    }, [fetchPlans, fetchCurrentSubscription]);

    useEffect(() => {
        if (apiBaseUrl) {
            refresh();
        }
    }, [apiBaseUrl, refresh]);

    const createSubscription = useCallback(
        async (planId: string, paymentMethodId: string): Promise<UserSubscription> => {
            setIsLoading(true);
            setError(null);

            try {
                if (!apiBaseUrl) {
                    await new Promise((r) => setTimeout(r, 1500));
                    const mock: UserSubscription = {
                        id: `sub_${Date.now()}`,
                        planId,
                        status: 'active',
                        currentPeriodStart: new Date().toISOString(),
                        currentPeriodEnd: new Date(
                            Date.now() + 30 * 24 * 60 * 60 * 1000,
                        ).toISOString(),
                        cancelAtPeriodEnd: false,
                    };
                    setCurrentSubscription(mock);
                    return mock;
                }

                const response = await fetch(`${apiBaseUrl}/subscriptions`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ planId, paymentMethodId }),
                });

                if (!response.ok) {
                    const data = await response.json().catch(() => ({}));
                    throw new Error(data.message || 'Failed to create subscription');
                }

                const subscription = await response.json();
                setCurrentSubscription(subscription);
                return subscription;
            } catch (err) {
                const error = err instanceof Error ? err : new Error('Failed to create subscription');
                setError(error);
                throw error;
            } finally {
                setIsLoading(false);
            }
        },
        [apiBaseUrl],
    );

    const cancelSubscription = useCallback(
        async (subscriptionId: string): Promise<void> => {
            setIsLoading(true);
            setError(null);

            try {
                if (!apiBaseUrl) {
                    await new Promise((r) => setTimeout(r, 500));
                    setCurrentSubscription(null);
                    return;
                }

                const response = await fetch(
                    `${apiBaseUrl}/subscriptions/${subscriptionId}`,
                    { method: 'DELETE' },
                );

                if (!response.ok) {
                    const data = await response.json().catch(() => ({}));
                    throw new Error(data.message || 'Failed to cancel subscription');
                }

                setCurrentSubscription(null);
            } catch (err) {
                const error = err instanceof Error ? err : new Error('Failed to cancel subscription');
                setError(error);
                throw error;
            } finally {
                setIsLoading(false);
            }
        },
        [apiBaseUrl],
    );

    return {
        createSubscription,
        cancelSubscription,
        currentSubscription,
        availablePlans,
        isLoading,
        error,
        refresh,
    };
};
