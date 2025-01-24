import { getConfig } from '@/config';
import { useVeChainKitConfig } from '@/providers';
import { HStack, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

export const NetworkInfo = () => {
    const { t } = useTranslation();
    const { darkMode: isDark, network } = useVeChainKitConfig();

    return (
        <>
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
        </>
    );
};
