'use client';

import {
    HStack,
    Tag,
    Text,
    useColorMode,
    VStack,
} from '@chakra-ui/react';
import { useWallet } from '@vechain/vechain-kit';
import { useTranslation } from 'react-i18next';

export function ConnectionInfo() {
    const { connection } = useWallet();
    const { colorMode } = useColorMode();
    const { t } = useTranslation();

    if (!connection) return null;

    const description = (() => {
        switch (connection.source.type) {
            case 'privy':
                return t(
                    "You're connected using Privy authentication, which provides a dedicated user management system for this application.",
                );
            case 'privy-cross-app':
                return t(
                    "You're connected through the VeChain cross-app ecosystem, sharing authentication with other VeChain apps.",
                );
            case 'wallet':
                return t(
                    "You're connected directly through a Web3 wallet (VeWorld, Sync2, or WalletConnect).",
                );
            default:
                return t('Connection type not recognized.');
        }
    })();

    return (
        <VStack
            align="stretch"
            spacing={3}
            p={5}
            borderRadius="md"
            borderWidth="1px"
            borderColor={
                colorMode === 'light' ? 'gray.200' : 'whiteAlpha.200'
            }
            bg={colorMode === 'light' ? 'gray.50' : 'whiteAlpha.50'}
        >
            <HStack spacing={4} flexWrap="wrap">
                <HStack spacing={2}>
                    <Text fontSize="sm" opacity={0.7}>
                        {t('Source')}:
                    </Text>
                    <Tag size="sm" colorScheme="blue">
                        {connection.source.type}
                    </Tag>
                </HStack>
                <HStack spacing={2}>
                    <Text fontSize="sm" opacity={0.7}>
                        {t('Network')}:
                    </Text>
                    <Tag size="sm" colorScheme="purple">
                        {connection.network}
                    </Tag>
                </HStack>
            </HStack>
            <Text fontSize="sm">{description}</Text>
        </VStack>
    );
}
