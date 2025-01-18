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
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import { RxExit } from 'react-icons/rx';
import { PrivyLogo, VechainLogoHorizontal } from '@/assets';
import { PiLineVertical } from 'react-icons/pi';
import { useTranslation } from 'react-i18next';
import { useCrossAppConnectionCache } from '@/hooks';

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

    const { getConnectionCache } = useCrossAppConnectionCache();
    const connectionCache = getConnectionCache();

    const { connectedWallet, connection, disconnect } = useWallet();
    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';

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
                        {connection.isConnectedWithPrivy && (
                            <VStack
                                mt={2}
                                opacity={0.5}
                                _hover={{
                                    cursor: 'pointer',
                                    opacity: 0.7,
                                    transition: 'all 0.5s',
                                }}
                                onClick={() => {
                                    setCurrentContent('connection-details');
                                }}
                            >
                                <HStack
                                    textAlign={'center'}
                                    alignItems={'center'}
                                    justify={'center'}
                                    w={'full'}
                                >
                                    <Icon
                                        as={AiOutlineQuestionCircle}
                                        size={'xs'}
                                    />
                                    <Text fontSize={'xs'} fontWeight={'800'}>
                                        {t('Secured by')}
                                    </Text>
                                </HStack>
                                <HStack justify={'center'}>
                                    <PrivyLogo isDark={isDark} w={'50px'} />
                                    <Icon as={PiLineVertical} ml={2} />
                                    <VechainLogoHorizontal
                                        isDark={isDark}
                                        w={'69px'}
                                    />
                                </HStack>
                            </VStack>
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
