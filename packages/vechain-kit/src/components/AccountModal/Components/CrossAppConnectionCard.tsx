import { VStack, Text, Image } from '@chakra-ui/react';
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
                    <Image
                        src={connectionCache.ecosystemApp.logoUrl}
                        alt={connectionCache.ecosystemApp.name}
                        maxW="40px"
                        borderRadius="md"
                    />
                    <Text>
                        {t('Connected through')}:{' '}
                        {connectionCache.ecosystemApp.name}
                    </Text>
                </VStack>
            )}
            <Text>
                {t('On')}:{' '}
                {new Date(connectionCache.timestamp).toLocaleString()}
            </Text>
        </VStack>
    );
};
