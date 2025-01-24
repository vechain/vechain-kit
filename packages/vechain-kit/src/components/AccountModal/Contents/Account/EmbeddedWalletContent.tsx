import {
    Image,
    ModalBody,
    ModalCloseButton,
    VStack,
    ModalFooter,
    ModalHeader,
    HStack,
    Text,
    Icon,
    Link,
    Button,
} from '@chakra-ui/react';
import { useCrossAppConnectionCache, usePrivy, useWallet } from '@/hooks';
import React, { useState } from 'react';
import {
    AddressDisplay,
    ModalBackButton,
    ScrollToTopWrapper,
    StickyHeaderContainer,
} from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import { getPicassoImage } from '@/utils';
import { useTranslation } from 'react-i18next';
import { useVeChainKitConfig } from '@/providers';
import { PrivyLogo, VechainLogoHorizontal } from '@/assets';
import { PiLineVertical } from 'react-icons/pi';
import { IoOpenOutline } from 'react-icons/io5';
import { ActionButton } from '../../Components';
import { GiHouseKeys } from 'react-icons/gi';
import { MdOutlineNavigateNext } from 'react-icons/md';
import { IoIosFingerPrint } from 'react-icons/io';

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
};

export const EmbeddedWalletContent = ({ setCurrentContent }: Props) => {
    const { t } = useTranslation();
    const [showFullText, setShowFullText] = useState(false);

    const { connectedWallet } = useWallet();

    const { exportWallet, linkPasskey } = usePrivy();

    const walletImage = getPicassoImage(connectedWallet?.address ?? '');

    const { getConnectionCache } = useCrossAppConnectionCache();

    const { privy, darkMode: isDark } = useVeChainKitConfig();
    const { connection } = useWallet();

    const connectionCache = getConnectionCache();

    return (
        <ScrollToTopWrapper>
            <StickyHeaderContainer>
                <ModalHeader
                    fontSize={'md'}
                    fontWeight={'500'}
                    textAlign={'center'}
                    color={isDark ? '#dfdfdd' : '#4d4d4d'}
                >
                    {t('Embedded Wallet')}
                </ModalHeader>

                <ModalBackButton
                    onClick={() => setCurrentContent('settings')}
                />
                <ModalCloseButton />
            </StickyHeaderContainer>

            <ModalBody w={'full'}>
                <VStack
                    justify={'center'}
                    spacing={5}
                    align="flex-start"
                    w={'full'}
                >
                    <VStack justify={'center'} align={'center'} w={'full'}>
                        <Image
                            src={walletImage}
                            maxW={'100px'}
                            borderRadius="50%"
                        />
                        <AddressDisplay wallet={connectedWallet} />
                    </VStack>

                    {connection.isConnectedWithCrossApp && (
                        <>
                            <Text fontSize={'sm'} opacity={0.5}>
                                {t(
                                    'This is your main wallet and identity. Please be sure to keep it safe and backed up. Go to {{element}} website to manage your login methods and security settings.',
                                    {
                                        element:
                                            connectionCache?.ecosystemApp?.name,
                                    },
                                )}
                            </Text>
                            <Text fontSize={'sm'} opacity={0.5} mt={5}>
                                {t(
                                    'A smart account is being used as a gateway for blockchain interactions.',
                                )}
                            </Text>
                        </>
                    )}

                    {connection.isConnectedWithSocialLogin && (
                        <>
                            <Text fontSize={'sm'} opacity={0.5}>
                                {t(
                                    'You are using an Embedded Wallet secured by your social login method, ensuring a seamless VeChain experience.',
                                )}
                            </Text>

                            {showFullText && (
                                <>
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
                                            <Icon ml={1} as={IoOpenOutline} />
                                        </Link>
                                        .
                                    </Text>
                                    <Text fontSize={'sm'} opacity={0.5} mt={5}>
                                        {t(
                                            'A smart account is being used as a gateway for blockchain interactions.',
                                        )}
                                    </Text>
                                </>
                            )}

                            <Button
                                mt={0}
                                variant="link"
                                size="sm"
                                onClick={() => setShowFullText(!showFullText)}
                                color="blue.500"
                                textAlign="left"
                            >
                                {t(showFullText ? 'Show Less' : 'Read More')}
                            </Button>
                        </>
                    )}

                    {connection.isConnectedWithSocialLogin && (
                        <ActionButton
                            title={t('Backup your wallet')}
                            description={t(
                                'Store your Recovery Phrase or Private Key in a secure location, avoid losing access to your assets.',
                            )}
                            onClick={() => {
                                exportWallet();
                            }}
                            leftIcon={GiHouseKeys}
                            rightIcon={MdOutlineNavigateNext}
                        />
                    )}

                    {connection.isConnectedWithSocialLogin &&
                        privy?.allowPasskeyLinking && (
                            <ActionButton
                                title={t('Add passkey')}
                                description={t(
                                    'Enable one click login by adding a passkey to your account.',
                                )}
                                onClick={() => {
                                    linkPasskey();
                                }}
                                leftIcon={IoIosFingerPrint}
                                rightIcon={MdOutlineNavigateNext}
                            />
                        )}
                </VStack>
            </ModalBody>
            <ModalFooter w={'full'}>
                <VStack w={'full'} align="stretch" textAlign={'center'} mt={5}>
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
                    )}
                </VStack>
            </ModalFooter>
        </ScrollToTopWrapper>
    );
};
