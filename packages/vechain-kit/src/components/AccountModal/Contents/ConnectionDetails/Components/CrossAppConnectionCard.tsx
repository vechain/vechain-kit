import { VStack, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { CrossAppConnectionCache } from '@/types';

type Props = {
    connectionCache: CrossAppConnectionCache;
};

export const CrossAppConnectionCard = ({ connectionCache }: Props) => {
    const { t } = useTranslation();

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
            {connectionCache.ecosystemApp && (
                <VStack spacing={2}>
                    <Text>
                        {t('Connected through')}:{' '}
                        {connectionCache.ecosystemApp.name}
                    </Text>
                </VStack>
            )}
            <Text>
                {t('on')}:{' '}
                {new Date(connectionCache.timestamp).toLocaleString()}
            </Text>
        </VStack>
    );
};
