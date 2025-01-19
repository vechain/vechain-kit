import {
    Image,
    ModalBody,
    ModalCloseButton,
    VStack,
    ModalFooter,
    ModalHeader,
    useColorMode,
    Button,
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
import { useTranslation } from 'react-i18next';
import { useCrossAppConnectionCache } from '@/hooks';
import { VscDebugDisconnect } from 'react-icons/vsc';

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

                    <VStack mt={10} w={'full'} spacing={3}>
                        {connection.isConnectedWithSocialLogin && (
                            <VStack spacing={3}>
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

                        <ActionButton
                            title={t('Connection Details')}
                            description={t(
                                'View the details of your connection.',
                            )}
                            onClick={() => {
                                setCurrentContent('connection-details');
                            }}
                            leftIcon={VscDebugDisconnect}
                            rightIcon={MdOutlineNavigateNext}
                        />
                    </VStack>
                </ModalBody>
                <ModalFooter>
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
                </ModalFooter>
            </FadeInViewFromBottom>
        </FadeInViewFromBottom>
    );
};
