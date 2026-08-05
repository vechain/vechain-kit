'use client';

import { ReactElement, useCallback, useState } from 'react';
import {
    Box,
    Button,
    Code,
    Heading,
    HStack,
    Text,
    VStack,
} from '@chakra-ui/react';
import {
    SubscribeButton,
    SubscriptionModal,
    useSubscription,
} from '@vechain/vechain-kit';
import type { SubscriptionPlan } from '@vechain/vechain-kit';

const staticPlans: SubscriptionPlan[] = [
    {
        id: 'premium-monthly',
        name: 'Premium (monthly)',
        description: 'Monthly premium membership',
        amount: '5',
        currency: 'usd',
        interval: 'month',
        cryptoPayment: {
            recipientAddress: '0x4B2f83cD39DF63Fb0B8cc2E1B99cB28a47C8C05d',
            tokenAddress: '0x95761346d18244bb91664181bf91193376197088',
            amount: '100',
            maxPeriods: 12,
        },
        features: ['Early access', 'Priority support'],
    },
    {
        id: 'premium-yearly',
        name: 'Premium (yearly)',
        description: 'Yearly premium membership',
        amount: '50',
        currency: 'usd',
        interval: 'year',
        cryptoPayment: {
            recipientAddress: '0x4B2f83cD39DF63Fb0B8cc2E1B99cB28a47C8C05d',
            tokenAddress: '0x95761346d18244bb91664181bf91193376197088',
            amount: '1000',
            maxPeriods: 2,
        },
        features: ['Early access', 'Priority support', 'Annual discount'],
    },
];

export function PaymentsDemo(): ReactElement {
    const { currentSubscription, availablePlans, fetchPlans, refresh, error } =
        useSubscription();

    const [modalOpen, setModalOpen] = useState(false);

    const plans = availablePlans.length > 0 ? availablePlans : staticPlans;

    return (
        <Box>
            <Heading size="md">
                <b>Subscriptions</b>
            </Heading>
            <Text mt={2} fontSize="sm" color="gray.500">
                Configure the <Code>subscriptions</Code> prop on
                VeChainKitProvider to connect a backend. Without it, the demo
                falls back to the static plans below.
            </Text>

            <VStack mt={4} spacing={4} align="stretch">
                {plans.map((plan) => (
                    <Box
                        key={plan.id}
                        p={4}
                        borderWidth="1px"
                        borderRadius="lg"
                    >
                        <Text fontWeight="bold">{plan.name}</Text>
                        <Text fontSize="sm">
                            ${plan.amount}/{plan.interval === 'month'
                                ? 'month'
                                : 'year'}
                        </Text>
                        <SubscribeButton
                            plan={plan}
                            onSuccess={() => refresh()}
                            buttonProps={{ mt: 3 }}
                        />
                    </Box>
                ))}
            </VStack>

            <HStack mt={4} spacing={4}>
                <Button onClick={() => fetchPlans()}>
                    Fetch plans from backend
                </Button>
                <Button onClick={() => setModalOpen(true)}>
                    Manage subscription
                </Button>
            </HStack>

            <SubscriptionModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
            />

            {currentSubscription && (
                <Code mt={4} p={2} borderRadius="md" display="block">
                    {JSON.stringify(currentSubscription, null, 2)}
                </Code>
            )}
            {error && (
                <Text mt={2} color="red.400" fontSize="sm">
                    {error.message}
                </Text>
            )}
        </Box>
    );
}
