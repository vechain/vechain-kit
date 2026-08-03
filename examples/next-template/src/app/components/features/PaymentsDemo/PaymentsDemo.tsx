'use client';

import { Box, Button, Heading, VStack, Text, useToken } from '@chakra-ui/react';
import {
    PayWithTransakButton,
    SubscribeButton,
} from '@vechain/vechain-kit';
import { useTranslation } from 'react-i18next';

const DEMO_PLAN = {
    id: 'premium-monthly',
    name: 'Premium Plan',
    description: 'Unlock all premium features including priority support and advanced analytics.',
    amount: '9.99',
    currency: 'usd',
    interval: 'month' as const,
    features: [
        'All basic features',
        'Priority support',
        'Advanced analytics',
        'Custom branding',
        'API access',
    ],
    cryptoPayment: {
        recipientAddress: '0x435933c8064b4A5A96BbCb9c0166E096032F88dD',
        tokenAddress: undefined,
        amount: '100',
    },
};

export function PaymentsDemo() {
    const { t } = useTranslation();
    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');

    return (
        <Box>
            <Heading size="md" mb={4}>
                <b>{t('Fiat & Crypto Payments Demo')}</b>
            </Heading>

            <VStack spacing={6} align="stretch">
                <Box borderWidth="1px" borderRadius="lg" p={4}>
                    <Text fontWeight="bold" mb={2}>
                        {t('Buy VET with Transak')}
                    </Text>
                    <Text fontSize="sm" color={textSecondary} mb={4}>
                        {t('Buy VET with your preferred payment method. Powered by Transak.')}
                    </Text>
                    <PayWithTransakButton
                        fiatAmount="10"
                        onSuccess={() => console.log('Purchase successful!')}
                    />
                </Box>

                <Box borderWidth="1px" borderRadius="lg" p={4}>
                    <Text fontWeight="bold" mb={2}>
                        {t('Subscription with Crypto')}
                    </Text>
                    <Text fontSize="sm" color={textSecondary} mb={4}>
                        {t('Subscribe to a plan and pay with VET or B3TR on-chain.')}
                    </Text>
                    <SubscribeButton
                        plan={DEMO_PLAN}
                        onSuccess={() => console.log('Subscription created!')}
                    />
                </Box>
            </VStack>
        </Box>
    );
}
