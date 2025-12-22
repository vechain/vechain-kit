'use client';

import { Button, Text, VStack, useColorMode } from '@chakra-ui/react';
import { useConnectModal } from '@vechain/vechain-kit';
import { useTranslation } from 'react-i18next';

export function LoginToContinueBox() {
    const { colorMode } = useColorMode();
    const { open } = useConnectModal();
    const { t } = useTranslation();

    return (
        <VStack
            w="full"
            p={4}
            rounded="md"
            spacing={3}
            borderRadius="lg"
            boxShadow="xl"
            bg="whiteAlpha.100"
            backdropFilter="blur(10px)"
        >
            <Text fontSize="lg" fontWeight="medium" textAlign="center">
                {t('Connect your wallet to explore all features')}
            </Text>
            <Text
                fontSize="sm"
                color={colorMode === 'light' ? 'gray.600' : 'gray.400'}
                textAlign="center"
            >
                {t(
                    'Sign in to access transaction examples, signing capabilities, profile customization and more.',
                )}
            </Text>
            <Button width="full" onClick={() => open()}>
                {t('Click here to sign in!')}
            </Button>
        </VStack>
    );
}
