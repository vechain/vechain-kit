import { Text, HStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useWallet } from '@vechain/dapp-kit-react';
import { useVeChainKitConfig } from '@/providers';

export const DappKitConnectionCard = () => {
    const { t } = useTranslation();
    const { source } = useWallet();
    const { darkMode: isDark } = useVeChainKitConfig();

    return (
        <>
            {source && (
                <HStack
                    p={4}
                    bg={isDark ? '#1a1a1a' : '#f5f5f5'}
                    borderRadius={'xl'}
                    spacing={4}
                    w="full"
                    justifyContent="space-between"
                >
                    <Text fontSize="sm" color={isDark ? '#dfdfdd' : '#4d4d4d'}>
                        {t('Connected through')}:
                    </Text>

                    <Text fontSize="sm" color={isDark ? '#dfdfdd' : '#4d4d4d'}>
                        {source}
                    </Text>
                </HStack>
            )}
        </>
    );
};
