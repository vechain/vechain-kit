import {
    Image,
    ModalBody,
    ModalCloseButton,
    VStack,
    ModalFooter,
    ModalHeader,
    useColorMode,
    Text,
    Divider,
    Link,
    Icon,
    Button,
    HStack,
} from '@chakra-ui/react';
import { usePrivy, useWallet } from '@/hooks';
import { GiHouseKeys } from 'react-icons/gi';
import { MdOutlineNavigateNext } from 'react-icons/md';
import { IoIosFingerPrint } from 'react-icons/io';
import { ActionButton } from '@/components';
import {
    AddressDisplay,
    ModalBackButton,
    StickyHeaderContainer,
    FadeInViewFromBottom,
} from '@/components/common';
import { useVeChainKitConfig } from '@/providers/VeChainKit';
import { AccountModalContentTypes } from '../../Types';
import { FaRegAddressCard } from 'react-icons/fa';
import { RxExit } from 'react-icons/rx';
import { IoOpenOutline } from 'react-icons/io5';
import { useState } from 'react';
import { PrivyLogo, VechainLogoHorizontal } from '@/assets';
import { TbAmpersand } from 'react-icons/tb';
import { useTranslation } from 'react-i18next';

type Props = {
    setCurrentContent: (content: AccountModalContentTypes) => void;
    onLogoutSuccess: () => void;
};

export const WalletSettingsContent = ({
    setCurrentContent,
    onLogoutSuccess,
}: Props) => {
    const { t } = useTranslation();
    const { exportWallet, linkPasskey } = usePrivy();
    const { privy } = useVeChainKitConfig();

    const { connectedWallet, connection, disconnect } = useWallet();

    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';

    const [isExpanded, setIsExpanded] = useState(false);

    const hasExistingDomain = !!connectedWallet.domain;

    return (
        <FadeInViewFromBottom>
            <StickyHeaderContainer>
                <ModalHeader
                    fontSize={'md'}
                    fontWeight={'500'}
                    textAlign={'center'}
                    color={isDark ? '#dfdfdd' : '#4d4d4d'}
                >
                    {t('Wallet')}
                </ModalHeader>

                <ModalBackButton
                    onClick={() => {
                        if (
                            connection.isConnectedWithSocialLogin ||
                            connection.isConnectedWithCrossApp
                        ) {
                            setCurrentContent('accounts');
                        } else {
                            setCurrentContent('main');
                        }
                    }}
                />
                <ModalCloseButton />
            </StickyHeaderContainer>

            <FadeInViewFromBottom>
                <ModalBody w={'full'}>
                    <VStack justify={'center'}>
                        <Image
                            src={connectedWallet.image}
                            maxW={'70px'}
                            borderRadius="50%"
                        />
                        <AddressDisplay wallet={connectedWallet} />
                    </VStack>

                    <VStack align="stretch" textAlign={'center'} mt={5}>
                        {connection.isConnectedWithCrossApp && (
                            <Text
                                fontSize={'sm'}
                                opacity={0.5}
                                textAlign={'center'}
                            >
                                {t(
                                    'This is your main wallet and identity. Please be sure to keep it safe and backed up. Go to VeChain to manage your wallet and security settings.',
                                )}
                            </Text>
                        )}

                        {connection.isConnectedWithPrivy && (
                            <VStack mt={2} opacity={0.5}>
                                <Text fontSize={'sm'} textAlign={'center'}>
                                    {t('Secured by')}
                                </Text>
                                <HStack justify={'center'}>
                                    <PrivyLogo isDark={isDark} w={'50px'} />
                                    <Icon as={TbAmpersand} ml={2} />
                                    <VechainLogoHorizontal
                                        isDark={isDark}
                                        w={'69px'}
                                    />
                                </HStack>
                            </VStack>
                        )}

                        {connection.isConnectedWithSocialLogin && (
                            <>
                                {isExpanded && (
                                    <FadeInViewFromBottom>
                                        {connection.isConnectedWithSocialLogin && (
                                            <>
                                                <Text
                                                    fontSize={'sm'}
                                                    opacity={0.5}
                                                >
                                                    {t(
                                                        'You are using an Embedded Wallet secured by your social login method, which acts as a master controller of your smart account, ensuring a seamless VeChain experience with full ownership and control.',
                                                    )}
                                                </Text>

                                                <Text
                                                    fontSize={'sm'}
                                                    opacity={0.5}
                                                >
                                                    {t(
                                                        'We highly recommend exporting your private key to back up your wallet. This ensures you can restore it if needed or transfer it to self-custody using',
                                                    )}
                                                    <Link
                                                        href="https://www.veworld.net/"
                                                        isExternal
                                                        color="gray.500"
                                                        fontSize={'14px'}
                                                        textDecoration={
                                                            'underline'
                                                        }
                                                    >
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
                                <Link
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    color="gray.500"
                                    fontSize={'sm'}
                                    transition={'all 0.2s'}
                                    _hover={{ textDecoration: 'none' }}
                                >
                                    {isExpanded
                                        ? t('Read less')
                                        : t('Read more')}
                                </Link>
                            </>
                        )}
                    </VStack>

                    <VStack mt={5} w={'full'} spacing={5}>
                        {connection.isConnectedWithSocialLogin && (
                            <VStack spacing={5}>
                                <ActionButton
                                    title={t('Backup your wallet')}
                                    description={t(
                                        'Store your Recovery Phrase or Private Key in a secure location, avoid losing access to your assets.',
                                    )}
                                    onClick={() => {
                                        exportWallet();
                                    }}
                                    hide={connection.isConnectedWithCrossApp}
                                    leftIcon={GiHouseKeys}
                                    rightIcon={MdOutlineNavigateNext}
                                />

                                {privy?.allowPasskeyLinking && (
                                    <ActionButton
                                        title={t('Add passkey')}
                                        description={t(
                                            'Enable one click login by adding a passkey to your account.',
                                        )}
                                        onClick={() => {
                                            linkPasskey();
                                        }}
                                        hide={
                                            connection.isConnectedWithCrossApp
                                        }
                                        leftIcon={IoIosFingerPrint}
                                        rightIcon={MdOutlineNavigateNext}
                                    />
                                )}
                            </VStack>
                        )}
                        {connection.isConnectedWithDappKit && (
                            <ActionButton
                                title={
                                    hasExistingDomain
                                        ? t('Change account name')
                                        : t('Choose account name')
                                }
                                description={t(
                                    'Give a nickname to your wallet to easily identify it.',
                                )}
                                onClick={() => {
                                    if (hasExistingDomain) {
                                        setCurrentContent({
                                            type: 'choose-name-search',
                                            props: {
                                                name: '',
                                                setCurrentContent,
                                            },
                                        });
                                    } else {
                                        setCurrentContent('choose-name');
                                    }
                                }}
                                leftIcon={FaRegAddressCard}
                                rightIcon={MdOutlineNavigateNext}
                            />
                        )}

                        <Divider />

                        <Button
                            onClick={() => {
                                disconnect();
                                onLogoutSuccess();
                            }}
                            variant="secondary"
                            leftIcon={<RxExit color="#888888" />}
                        >
                            {t('Logout')}
                        </Button>
                    </VStack>
                </ModalBody>
                <ModalFooter></ModalFooter>
            </FadeInViewFromBottom>
        </FadeInViewFromBottom>
    );
};
