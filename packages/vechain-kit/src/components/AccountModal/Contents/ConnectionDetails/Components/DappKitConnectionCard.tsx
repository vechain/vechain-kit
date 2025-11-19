import { Text, HStack, VStack, useToken } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useWallet } from '@vechain/dapp-kit-react';
import { NetworkInfo } from './NetworkInfo';

export const DappKitConnectionCard = () => {
    const { t } = useTranslation();
    const { source } = useWallet();
    
    const cardBg = useToken('colors', 'vechain-kit-card');
    const textColor = useToken('colors', 'vechain-kit-text-secondary');

    return (
        <>
            {source && (
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
                            {source}
                        </Text>
                    </HStack>
                    <NetworkInfo />
                </VStack>
            )}
        </>
    );
};
