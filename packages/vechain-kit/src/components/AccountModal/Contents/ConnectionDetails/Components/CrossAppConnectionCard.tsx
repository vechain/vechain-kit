import { Text, HStack, VStack, useToken } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { CrossAppConnectionCache } from '@/types';
import { NetworkInfo } from './NetworkInfo';

type Props = {
    connectionCache: CrossAppConnectionCache;
};

export const CrossAppConnectionCard = ({ connectionCache }: Props) => {
    const { t } = useTranslation();

    const cardBg = useToken('colors', 'vechain-kit-card');
    const textColorSecondary = useToken('colors', 'vechain-kit-text-secondary');
    const textPrimary = useToken('colors', 'vechain-kit-text-primary');

    return (
        <>
            {connectionCache.ecosystemApp && (
                <VStack
                    p={4}
                    bg={cardBg}
                    borderRadius={'xl'}
                    spacing={4}
                    w="full"
                >
                    <HStack w="full" justifyContent="space-between">
                        <Text fontSize="sm" color={textPrimary}>
                            {t('Logged in with')}:
                        </Text>
                        <Text fontSize="sm" color={textColorSecondary}>
                            {connectionCache.ecosystemApp.name}
                        </Text>
                    </HStack>

                    <HStack w="full" justifyContent="space-between">
                        <Text fontSize="sm" color={textPrimary}>
                            {t('At')}:
                        </Text>
                        <Text fontSize="sm" color={textColorSecondary}>
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
