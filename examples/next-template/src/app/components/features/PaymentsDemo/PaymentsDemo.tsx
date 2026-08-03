'use client';

import { Box, Heading, VStack, Text, useToken } from '@chakra-ui/react';
import { PayWithTransakButton } from '@vechain/vechain-kit';
import { useTranslation } from 'react-i18next';

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
            </VStack>
        </Box>
    );
}
