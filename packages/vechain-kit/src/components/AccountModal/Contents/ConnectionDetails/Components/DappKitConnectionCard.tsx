import { Text, HStack, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useWallet } from '@vechain/dapp-kit-react2';
import { useVeChainKitConfig } from '@/providers';
import { NetworkInfo } from './NetworkInfo';

export const DappKitConnectionCard = () => {
    const { t } = useTranslation();
    const { source } = useWallet();
    const { darkMode: isDark } = useVeChainKitConfig();

    return (
        <>
            {source && (
                <VStack
                    p={4}
                    bg={isDark ? '#00000038' : '#f5f5f5'}
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
                            {source}
                        </Text>
                    </HStack>
                    <NetworkInfo />
                </VStack>
            )}
        </>
    );
};
