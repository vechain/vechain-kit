import {
    ModalBody,
    ModalCloseButton,
    VStack,
    ModalFooter,
    ModalHeader,
    Text,
    Link,
    Icon,
    HStack,
    Image,
} from '@chakra-ui/react';
import {
    ModalBackButton,
    StickyHeaderContainer,
    FadeInViewFromBottom,
} from '@/components/common';
import { useTranslation } from 'react-i18next';
import { useCrossAppConnectionCache, useWallet } from '@/hooks';
import {
    CrossAppConnectionCard,
    DappKitConnectionCard,
    PrivyConnectionCard,
} from './Components';
import { IoOpenOutline } from 'react-icons/io5';
import { PrivyLogo, VechainLogoHorizontal } from '@/assets';
import { PiLineVertical } from 'react-icons/pi';
import { useVeChainKitConfig } from '@/providers';
import { useWallet as useDappKitWallet } from '@vechain/dapp-kit-react';

type Props = {
    onGoBack: () => void;
};

export const ConnectionDetailsContent = ({ onGoBack }: Props) => {
    const { t } = useTranslation();
    const { getConnectionCache } = useCrossAppConnectionCache();

    const { privy, darkMode: isDark } = useVeChainKitConfig();
    const { connection } = useWallet();
    const { source } = useDappKitWallet();

    const connectionCache = getConnectionCache();

    const modalTitle =
        connection.isConnectedWithCrossApp && connectionCache
            ? connectionCache.ecosystemApp.name + ' ' + t('Wallet')
            : connection.isConnectedWithSocialLogin
            ? t('Embedded Wallet')
            : t('Wallet');

    return (
        <FadeInViewFromBottom>
            <StickyHeaderContainer>
                <ModalHeader
                    fontSize={'md'}
                    fontWeight={'500'}
                    textAlign={'center'}
                    color={isDark ? '#dfdfdd' : '#4d4d4d'}
                >
                    {modalTitle}
                </ModalHeader>

                <ModalBackButton
                    onClick={() => {
                        onGoBack();
                    }}
                />
                <ModalCloseButton />
            </StickyHeaderContainer>

            <FadeInViewFromBottom>
                <ModalBody w={'full'}>
                    {connection.isConnectedWithCrossApp && connectionCache && (
                        <CrossAppConnectionCard
                            connectionCache={connectionCache}
                        />
                    )}

                    {connection.isConnectedWithSocialLogin && (
                        <PrivyConnectionCard />
                    )}

                    {connection.isConnectedWithDappKit && (
                        <VStack align="stretch" textAlign={'center'} mt={5}>
                            <DappKitConnectionCard />

                            <Text
                                fontSize={'sm'}
                                opacity={0.5}
                                textAlign={'center'}
                            >
                                {t(
                                    'This is your main wallet and identity. Please be sure to keep it safe and backed up. Go to {{element}} app or extension to manage your wallet and security settings.',
                                    {
                                        element: source,
                                    },
                                )}
                            </Text>
                        </VStack>
                    )}

                    <VStack align="stretch" textAlign={'center'} mt={5}>
                        {connection.isConnectedWithCrossApp && (
                            <Text
                                fontSize={'sm'}
                                opacity={0.5}
                                textAlign={'center'}
                            >
                                {t(
                                    'This is your main wallet and identity. Please be sure to keep it safe and backed up. Go to {{element}} website to manage your wallet and security settings.',
                                    {
                                        element:
                                            connectionCache?.ecosystemApp?.name,
                                    },
                                )}
                            </Text>
                        )}

                        {connection.isConnectedWithSocialLogin && (
                            <FadeInViewFromBottom>
                                {connection.isConnectedWithSocialLogin && (
                                    <>
                                        <Text fontSize={'sm'} opacity={0.5}>
                                            {t(
                                                'You are using an Embedded Wallet secured by your social login method, which acts as a master controller of your smart account, ensuring a seamless VeChain experience with full ownership and control.',
                                            )}
                                        </Text>

                                        <Text fontSize={'sm'} opacity={0.5}>
                                            {t(
                                                'We highly recommend exporting your private key to back up your wallet. This ensures you can restore it if needed or transfer it to self-custody using',
                                            )}
                                            <Link
                                                href="https://www.veworld.net/"
                                                isExternal
                                                color="gray.500"
                                                fontSize={'14px'}
                                                textDecoration={'underline'}
                                            >
                                                {' '}
                                                {t('VeWorld Wallet')}
                                                <Icon
                                                    ml={1}
                                                    as={IoOpenOutline}
                                                />
                                            </Link>
                                            .
                                        </Text>
                                    </>
                                )}
                            </FadeInViewFromBottom>
                        )}
                    </VStack>

                    {connection.isConnectedWithPrivy && (
                        <Text
                            fontSize={'sm'}
                            opacity={0.5}
                            mt={5}
                            textAlign={'center'}
                        >
                            {t(
                                'Your smart account is your gateway to blockchain interactions.',
                            )}
                        </Text>
                    )}

                    <VStack align="stretch" textAlign={'center'} mt={5}>
                        {connection.isConnectedWithPrivy && (
                            <VStack mt={2} opacity={0.6}>
                                <HStack
                                    textAlign={'center'}
                                    alignItems={'center'}
                                    justify={'center'}
                                    w={'full'}
                                >
                                    <Text fontSize={'xs'} fontWeight={'800'}>
                                        {t('Wallet secured by')}
                                    </Text>
                                </HStack>
                                <HStack justify={'center'}>
                                    <PrivyLogo isDark={isDark} w={'50px'} />
                                    <Icon as={PiLineVertical} ml={2} />

                                    {connection.isConnectedWithVeChain ? (
                                        <VechainLogoHorizontal
                                            isDark={isDark}
                                            w={'69px'}
                                        />
                                    ) : (
                                        connection.isConnectedWithCrossApp &&
                                        connectionCache && (
                                            <Image
                                                src={
                                                    connectionCache.ecosystemApp
                                                        .logoUrl
                                                }
                                                alt={
                                                    connectionCache.ecosystemApp
                                                        .name
                                                }
                                                maxW="40px"
                                                borderRadius="md"
                                            />
                                        )
                                    )}

                                    {connection.isConnectedWithSocialLogin && (
                                        <Image
                                            src={privy?.appearance.logo}
                                            alt={privy?.appearance.logo}
                                            maxW="40px"
                                            borderRadius="md"
                                        />
                                    )}
                                </HStack>
                            </VStack>
                        )}
                    </VStack>
                </ModalBody>
                <ModalFooter></ModalFooter>
            </FadeInViewFromBottom>
        </FadeInViewFromBottom>
    );
};
