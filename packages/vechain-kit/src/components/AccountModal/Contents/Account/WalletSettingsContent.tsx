import {
    Image,
    ModalBody,
    ModalCloseButton,
    VStack,
    ModalFooter,
    ModalHeader,
    Button,
} from '@chakra-ui/react';
import {
    useCrossAppConnectionCache,
    useFetchAppInfo,
    useWallet,
} from '@/hooks';
import { MdManageAccounts, MdOutlineNavigateNext } from 'react-icons/md';
import { ActionButton } from '@/components';
import {
    AddressDisplay,
    ModalBackButton,
    StickyHeaderContainer,
    ScrollToTopWrapper,
} from '@/components/common';
import { useVeChainKitConfig } from '@/providers/VeChainKitProvider';
import { AccountModalContentTypes } from '../../Types';
import { FaRegAddressCard } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { VscDebugDisconnect } from 'react-icons/vsc';
import { HiOutlineWallet } from 'react-icons/hi2';
import { useEffect, useRef } from 'react';
import { CiLogout } from 'react-icons/ci';

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    onLogoutSuccess: () => void;
};

export const WalletSettingsContent = ({
    setCurrentContent,
    onLogoutSuccess,
}: Props) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const { t } = useTranslation();

    const { privy, darkMode: isDark } = useVeChainKitConfig();

    const { connection, disconnect, account } = useWallet();

    const hasExistingDomain = !!account?.domain;

    const { getConnectionCache } = useCrossAppConnectionCache();
    const connectionCache = getConnectionCache();

    const { data: appInfo } = useFetchAppInfo(privy?.appId ?? '');

    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.scrollTop = 0;
        }
    }, []);

    return (
        <ScrollToTopWrapper>
            <StickyHeaderContainer>
                <ModalHeader
                    fontSize={'md'}
                    fontWeight={'500'}
                    textAlign={'center'}
                    color={isDark ? '#dfdfdd' : '#4d4d4d'}
                >
                    {t('Settings')}
                </ModalHeader>

                <ModalBackButton onClick={() => setCurrentContent('main')} />
                <ModalCloseButton />
            </StickyHeaderContainer>

            <ModalBody w={'full'}>
                <VStack justify={'center'}>
                    <Image
                        src={account?.image}
                        maxW={'100px'}
                        borderRadius="50%"
                    />
                    <AddressDisplay wallet={account} />
                </VStack>

                <VStack mt={10} w={'full'} spacing={3}>
                    {/* <ActionButton
                                title={t('Manage MFA')}
                                description={t(
                                    'Manage multi-factor authentication settings for your wallet.',
                                )}
                                onClick={() => {
                                    // linkPasskey();
                                }}
                                showComingSoon={true}
                                isDisabled={!privyUser?.mfaMethods?.length}
                                hide={connection.isConnectedWithCrossApp}
                                leftIcon={FaShieldAlt}
                                rightIcon={MdOutlineNavigateNext}
                            /> */}

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

                    <ActionButton
                        title={t('Connection Details')}
                        description={t(
                            'View the details of your connection to this app.',
                        )}
                        onClick={() => {
                            setCurrentContent('connection-details');
                        }}
                        leftIcon={VscDebugDisconnect}
                        rightIcon={MdOutlineNavigateNext}
                    />

                    {connection.isConnectedWithSocialLogin && (
                        <ActionButton
                            title={t('Login methods')}
                            description={t(
                                'View and manage the login methods linked to your wallet.',
                            )}
                            onClick={() => {
                                setCurrentContent('privy-linked-accounts');
                            }}
                            leftIcon={MdManageAccounts}
                            rightIcon={MdOutlineNavigateNext}
                        />
                    )}

                    {connection.isConnectedWithPrivy && (
                        <ActionButton
                            title={t('Embedded Wallet')}
                            description={t(
                                'View details of your embedded wallet created and secured by {{appName}}.',
                                {
                                    appName: connection.isConnectedWithCrossApp
                                        ? connectionCache?.ecosystemApp?.name
                                        : Object.values(appInfo ?? {})[0]
                                              ?.name ?? '',
                                },
                            )}
                            onClick={() => {
                                setCurrentContent('embedded-wallet');
                            }}
                            leftIcon={HiOutlineWallet}
                            rightIcon={MdOutlineNavigateNext}
                        />
                    )}
                </VStack>
            </ModalBody>
            <ModalFooter w={'full'}>
                <Button
                    onClick={() => {
                        disconnect();
                        onLogoutSuccess();
                    }}
                    variant="vechainKitSecondary"
                    leftIcon={<CiLogout color="#888888" />}
                >
                    {t('Logout')}
                </Button>
            </ModalFooter>
        </ScrollToTopWrapper>
    );
};
