import { PrivyLogo, VechainLogo } from '@/assets';
import { useCrossAppConnectionCache, useWallet } from '../../../../../hooks';
import { useVeChainKitConfig } from '@/providers';
import { HStack, Icon, Image, Text, VStack, useToken } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { LuMinus } from 'react-icons/lu';

export const WalletSecuredBy = () => {
    const { connection } = useWallet();
    const { t } = useTranslation();
    const { privy, darkMode: isDark } = useVeChainKitConfig();
    const { getConnectionCache } = useCrossAppConnectionCache();

    const connectionCache = getConnectionCache();
    const cardBg = useToken('colors', 'vechain-kit-card');

    if (!connection.isConnectedWithPrivy) {
        return null;
    }

    return (
        <VStack
            w={'full'}
            align="stretch"
            textAlign={'center'}
            mt={5}
            p={3}
            borderRadius="lg"
            bg={cardBg}
            shadow="sm"
        >
            <Text fontSize={'xs'} fontWeight={'800'}>
                {t('Wallet secured by')}
            </Text>
            <HStack justify={'center'}>
                <PrivyLogo isDark={isDark} w={'50px'} />
                <Icon as={LuMinus} ml={3} />

                {connection.isConnectedWithVeChain ? (
                    <VechainLogo
                        isDark={isDark}
                        w={'80px'}
                        h={'auto'}
                        mb={'3px'}
                    />
                ) : (
                    connection.isConnectedWithCrossApp &&
                    connectionCache && (
                        <Image
                            src={connectionCache.ecosystemApp.logoUrl}
                            alt={connectionCache.ecosystemApp.name}
                            maxW="40px"
                            borderRadius="md"
                        />
                    )
                )}

                {connection.isConnectedWithSocialLogin &&
                    !connection.isConnectedWithVeChain && (
                        <Image
                            src={privy?.appearance.logo}
                            alt={privy?.appearance.logo}
                            maxW="40px"
                            borderRadius="md"
                        />
                    )}
            </HStack>
        </VStack>
    );
};
