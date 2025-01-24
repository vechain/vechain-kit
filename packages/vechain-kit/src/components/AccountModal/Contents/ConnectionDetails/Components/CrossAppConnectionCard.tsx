import { Text, HStack, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { CrossAppConnectionCache } from '@/types';
import { useVeChainKitConfig } from '@/providers';
import { NetworkInfo } from './NetworkInfo';

type Props = {
    connectionCache: CrossAppConnectionCache;
};

export const CrossAppConnectionCard = ({ connectionCache }: Props) => {
    const { t } = useTranslation();
    const { darkMode: isDark } = useVeChainKitConfig();

    return (
        <>
            {connectionCache.ecosystemApp && (
                <VStack
                    p={4}
                    bg={isDark ? '#1a1a1a' : '#f5f5f5'}
                    borderRadius={'xl'}
                    spacing={4}
                    w="full"
                >
                    <HStack w="full" justifyContent="space-between">
                        <Text
                            fontSize="sm"
                            color={isDark ? '#dfdfdd' : '#4d4d4d'}
                        >
                            {t('Connected through')}:
                        </Text>
                        <Text
                            fontSize="sm"
                            color={isDark ? '#dfdfdd' : '#4d4d4d'}
                        >
                            {connectionCache.ecosystemApp.name}
                        </Text>
                    </HStack>

                    <HStack w="full" justifyContent="space-between">
                        <Text
                            fontSize="sm"
                            color={isDark ? '#dfdfdd' : '#4d4d4d'}
                        >
                            {t('Connected at')}:
                        </Text>
                        <Text
                            fontSize="sm"
                            color={isDark ? '#dfdfdd' : '#4d4d4d'}
                        >
                            {new Date(
                                connectionCache.timestamp,
                            ).toLocaleString()}
                        </Text>
                    </HStack>
                    <NetworkInfo />
                </VStack>
            )}
        </>
    );
};
