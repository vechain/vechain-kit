import { useFetchAppInfo } from '@/hooks';
import { useVeChainKitConfig } from '@/providers';
import { VStack, Text, Spinner, HStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { NetworkInfo } from './NetworkInfo';

export const PrivyConnectionCard = () => {
    const { t } = useTranslation();
    const { privy, darkMode: isDark } = useVeChainKitConfig();
    const { data: appInfo, isLoading } = useFetchAppInfo(privy?.appId ?? '');

    if (isLoading)
        return (
            <VStack w="full" h="full" justify="center" align="center">
                <Spinner />
            </VStack>
        );

    return (
        <>
            {appInfo && (
                <VStack
                    p={4}
                    bg={isDark ? '#1a1a1a' : '#f5f5f5'}
                    borderRadius={'xl'}
                    spacing={4}
                    w="full"
                    justifyContent="space-between"
                >
                    <HStack w="full" justifyContent="space-between">
                        <Text
                            fontSize="sm"
                            color={isDark ? '#dfdfdd' : '#4d4d4d'}
                        >
                            {t('Logged in with')}:
                        </Text>

                        <Text
                            fontSize="sm"
                            color={isDark ? '#dfdfdd' : '#4d4d4d'}
                        >
                            {Object.values(appInfo)[0].name}
                        </Text>
                    </HStack>
                    <NetworkInfo />
                </VStack>
            )}
        </>
    );
};
