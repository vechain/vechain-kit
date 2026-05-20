'use client';

import { Button, Text, VStack, useColorMode } from '@chakra-ui/react';
import { useConnectModal } from '@vechain/vechain-kit';
import { useTranslation } from 'react-i18next';

interface LoginToContinueBoxProps {
    title?: string;
    description?: string;
    ctaLabel?: string;
}

export function LoginToContinueBox({
    title,
    description,
    ctaLabel,
}: LoginToContinueBoxProps = {}) {
    const { colorMode } = useColorMode();
    const { open } = useConnectModal();
    const { t } = useTranslation();

    const resolvedTitle =
        title ?? t('Connect your wallet to explore all features');
    const resolvedDescription =
        description ??
        t(
            'Sign in to access transaction examples, signing capabilities, profile customization and more.',
        );
    const resolvedCta = ctaLabel ?? t('Click here to sign in!');

    return (
        <VStack
            w="full"
            p={{ base: 5, md: 6 }}
            spacing={3}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={
                colorMode === 'light' ? 'gray.200' : 'whiteAlpha.200'
            }
            bg={colorMode === 'light' ? 'gray.50' : 'whiteAlpha.50'}
        >
            <Text fontSize="lg" fontWeight="semibold" textAlign="center">
                {resolvedTitle}
            </Text>
            <Text
                fontSize="sm"
                color={colorMode === 'light' ? 'gray.600' : 'gray.400'}
                textAlign="center"
            >
                {resolvedDescription}
            </Text>
            <Button width="full" onClick={() => open()}>
                {resolvedCta}
            </Button>
        </VStack>
    );
}
