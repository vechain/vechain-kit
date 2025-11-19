import { useFetchAppInfo } from '@/hooks';
import { useVeChainKitConfig } from '@/providers';
import { VStack, Text, Spinner, HStack, useToken } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { NetworkInfo } from './NetworkInfo';

export const PrivyConnectionCard = () => {
    const { t } = useTranslation();
    const { privy } = useVeChainKitConfig();
    const { data: appInfo, isLoading } = useFetchAppInfo(privy?.appId ?? '');
    
    const cardBg = useToken('colors', 'vechain-kit-card');
    const textColor = useToken('colors', 'vechain-kit-text-secondary');

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
                    bg={cardBg}
                    borderRadius={'xl'}
                    spacing={4}
                    w="full"
                    justifyContent="space-between"
                >
                    <HStack w="full" justifyContent="space-between">
                        <Text fontSize="sm" color={textColor}>
                            {t('Logged in with')}:
                        </Text>

                        <Text fontSize="sm" color={textColor}>
                            {Object.values(appInfo)[0].name}
                        </Text>
                    </HStack>
                    <NetworkInfo />
                </VStack>
            )}
        </>
    );
};
