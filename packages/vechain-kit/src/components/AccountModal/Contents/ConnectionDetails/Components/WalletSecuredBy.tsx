import { PrivyLogo, VechainLogoHorizontal } from '@/assets';
import { useCrossAppConnectionCache, useWallet } from '@/hooks';
import { useVeChainKitConfig } from '@/providers';
import { HStack, Icon, Image, Text, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { PiLineVertical } from 'react-icons/pi';

export const WalletSecuredBy = () => {
    const { connection } = useWallet();
    const { t } = useTranslation();
    const { darkMode: isDark, privy } = useVeChainKitConfig();
    const { getConnectionCache } = useCrossAppConnectionCache();

    const connectionCache = getConnectionCache();

    return (
        <VStack
            w={'full'}
            align="stretch"
            textAlign={'center'}
            mt={5}
            p={3}
            borderRadius="lg"
            bg={isDark ? 'whiteAlpha.100' : 'blackAlpha.50'}
            shadow="sm"
        >
            <Text fontSize={'xs'} fontWeight={'800'}>
                {t('Wallet secured by')}
            </Text>
            <HStack justify={'center'}>
                <PrivyLogo isDark={isDark} w={'50px'} />
                <Icon as={PiLineVertical} ml={2} />

                {connection.isConnectedWithVeChain ? (
                    <VechainLogoHorizontal isDark={isDark} w={'69px'} />
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
