'use client';

import { Box, Button, Heading, VStack } from '@chakra-ui/react';
import {
    PayWithFiatButton,
    SubscribeButton,
    useFiatCheckout,
    FiatCheckoutModal,
} from '@vechain/vechain-kit';
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
    const {
        isOpen: isCheckoutOpen,
        open: openCheckout,
        close: closeCheckout,
        status: checkoutStatus,
    } = useFiatCheckout({
        amount: '29.99',
        product: { name: 'Pro Access Pass', description: 'One-time payment for lifetime Pro Access' },
        onSuccess: () => console.log('Checkout completed!'),
    });

    return (
        <>
            <Box>
                <Heading size="md" mb={4}>
                    <b>Fiat Payments Demo</b>
                </Heading>

                <VStack spacing={6} align="stretch">
                    <Box borderWidth="1px" borderRadius="lg" p={4}>
                        <PayWithFiatButton
                            amount="29.99"
                            productName="Pro Access Pass"
                            productDescription="One-time payment for lifetime Pro Access"
                            onSuccess={() => console.log('Purchase successful!')}
                        />
                    </Box>

                    <Box borderWidth="1px" borderRadius="lg" p={4}>
                        <Button
                            onClick={openCheckout}
                            variant="vechainKitSecondary"
                            isLoading={checkoutStatus === 'processing'}
                            w="full"
                        >
                            Open Checkout Modal ($29.99)
                        </Button>
                    </Box>

                    <Box borderWidth="1px" borderRadius="lg" p={4}>
                        <SubscribeButton
                            plan={DEMO_PLAN}
                            onSuccess={() => console.log('Subscription created!')}
                        />
                    </Box>
                </VStack>
            </Box>

            <FiatCheckoutModal
                isOpen={isCheckoutOpen}
                onClose={closeCheckout}
                amount="29.99"
                product={{ name: 'Pro Access Pass', description: 'One-time payment for lifetime Pro Access' }}
                onSuccess={() => console.log('Checkout completed via hook!')}
            />
        </>
    );
}
