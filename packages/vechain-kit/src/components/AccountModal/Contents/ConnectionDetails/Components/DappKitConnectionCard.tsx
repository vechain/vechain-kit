import { VStack, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useWallet } from '@vechain/dapp-kit-react';

export const DappKitConnectionCard = () => {
    const { t } = useTranslation();
    const { source } = useWallet();

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
            {source && (
                <VStack spacing={2}>
                    <Text>
                        {t('Connected through')}: {source}
                    </Text>
                </VStack>
            )}
        </VStack>
    );
};
