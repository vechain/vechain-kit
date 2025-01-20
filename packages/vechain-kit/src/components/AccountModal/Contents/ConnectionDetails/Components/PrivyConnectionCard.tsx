import { useFetchAppInfo } from '@/hooks';
import { useVeChainKitConfig } from '@/providers';
import { VStack, Text, Spinner } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

export const PrivyConnectionCard = () => {
    const { t } = useTranslation();
    const { privy } = useVeChainKitConfig();
    const { data: appInfo, isLoading } = useFetchAppInfo(privy?.appId ?? '');

    if (isLoading)
        return (
            <VStack w="full" h="full" justify="center" align="center">
                <Spinner />
            </VStack>
        );

    return (
        <VStack
            spacing={2}
            opacity={0.8}
            fontSize="sm"
            p={4}
            borderRadius="lg"
            border="1px solid"
            borderColor="gray.200"
            _dark={{ borderColor: 'gray.700' }}
            w="full"
        >
            {appInfo && (
                <VStack spacing={2}>
                    <Text>
                        {t('Connected through')}:{' '}
                        {Object.values(appInfo)[0].name}
                    </Text>
                </VStack>
            )}
        </VStack>
    );
};
