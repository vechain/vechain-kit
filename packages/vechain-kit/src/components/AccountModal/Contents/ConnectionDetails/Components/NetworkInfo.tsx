import { getConfig } from '@/config';
import { useWallet } from '@/hooks';
import { useVeChainKitConfig } from '@/providers';
import { HStack, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

export const NetworkInfo = () => {
    const { t } = useTranslation();
    const { darkMode: isDark, network } = useVeChainKitConfig();
    const { connection } = useWallet();
    return (
        <>
            <HStack w="full" justifyContent="space-between">
                <Text fontSize="sm" color={isDark ? '#dfdfdd' : '#4d4d4d'}>
                    {t('Connection Type')}:
                </Text>
                <Text fontSize="sm" color={isDark ? '#dfdfdd' : '#4d4d4d'}>
                    {connection.source.type}
                </Text>
            </HStack>
            <HStack w="full" justifyContent="space-between">
                <Text fontSize="sm" color={isDark ? '#dfdfdd' : '#4d4d4d'}>
                    {t('Network')}:
                </Text>
                <Text fontSize="sm" color={isDark ? '#dfdfdd' : '#4d4d4d'}>
                    {network.type}
                </Text>
            </HStack>
            <HStack w="full" justifyContent="space-between">
                <Text fontSize="sm" color={isDark ? '#dfdfdd' : '#4d4d4d'}>
                    {t('Node')}:
                </Text>
                <Text fontSize="sm" color={isDark ? '#dfdfdd' : '#4d4d4d'}>
                    {network.nodeUrl || getConfig(network.type).nodeUrl}
                </Text>
            </HStack>
            <HStack w="full" justifyContent="space-between">
                <Text fontSize="sm" color={isDark ? '#dfdfdd' : '#4d4d4d'}>
                    {t('Active Smart Account')}:
                </Text>
                <Text fontSize="sm" color={isDark ? '#dfdfdd' : '#4d4d4d'}>
                    {connection.isConnectedWithPrivy ? 'Yes' : 'No'}
                </Text>
            </HStack>
        </>
    );
};
