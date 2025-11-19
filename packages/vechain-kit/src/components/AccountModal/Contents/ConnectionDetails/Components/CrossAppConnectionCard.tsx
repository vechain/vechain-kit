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
    const textColor = useToken('colors', 'vechain-kit-text-secondary');

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
                        <Text fontSize="sm" color={textColor}>
                            {t('Logged in with')}:
                        </Text>
                        <Text fontSize="sm" color={textColor}>
                            {connectionCache.ecosystemApp.name}
                        </Text>
                    </HStack>

                    <HStack w="full" justifyContent="space-between">
                        <Text fontSize="sm" color={textColor}>
                            {t('At')}:
                        </Text>
                        <Text fontSize="sm" color={textColor}>
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
