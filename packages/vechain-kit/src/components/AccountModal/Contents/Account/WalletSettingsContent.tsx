import {
    ModalBody,
    ModalCloseButton,
    VStack,
    ModalFooter,
    ModalHeader,
    Button,
    Box,
    Tag,
} from '@chakra-ui/react';
import {
    useCrossAppConnectionCache,
    useFetchAppInfo,
    useWallet,
} from '@/hooks';
import { MdOutlineNavigateNext } from 'react-icons/md';
import { ActionButton } from '@/components';
import {
    AccountAvatar,
    AddressDisplay,
    ModalBackButton,
    StickyHeaderContainer,
} from '@/components/common';
import { useVeChainKitConfig } from '@/providers/VeChainKitProvider';
import { AccountModalContentTypes } from '../../Types';
import { useTranslation } from 'react-i18next';
import { VscDebugDisconnect } from 'react-icons/vsc';
import { HiOutlineWallet } from 'react-icons/hi2';
import { useEffect, useRef } from 'react';
import { RiLogoutBoxLine } from 'react-icons/ri';
import { BsQuestionCircle } from 'react-icons/bs';
import { GiPaintBrush } from 'react-icons/gi';

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

    const { privy, darkMode: isDark, network } = useVeChainKitConfig();

    const { connection, disconnect, account } = useWallet();

    const { getConnectionCache } = useCrossAppConnectionCache();
    const connectionCache = getConnectionCache();

    const { data: appInfo } = useFetchAppInfo(privy?.appId ?? '');

    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.scrollTop = 0;
        }
    }, []);

    return (
        <Box>
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
                    <AccountAvatar wallet={account} props={{ maxW: '100px' }} />
                    <AddressDisplay wallet={account} />
                    {network.type !== 'main' && (
                        <Tag
                            size={'sm'}
                            colorScheme={'blue'}
                            width={'fit-content'}
                            justifyContent={'center'}
                            padding={'10px'}
                        >
                            {network.type === 'test'
                                ? t('Testnet')
                                : t('Unknown')}
                        </Tag>
                    )}
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

                    <ActionButton
                        title={t('Customize account')}
                        description={t(
                            'Customize your account with a nickname and a picture to easily identify it.',
                        )}
                        onClick={() => {
                            setCurrentContent('account-customization');
                        }}
                        leftIcon={GiPaintBrush}
                        rightIcon={MdOutlineNavigateNext}
                    />

                    {connection.isConnectedWithPrivy && (
                        <ActionButton
                            title={t('Embedded Wallet')}
                            description={t(
                                'Manage your embedded wallet security settings or back it up to a new device.',
                            )}
                            onClick={() => {
                                setCurrentContent('embedded-wallet');
                            }}
                            leftIcon={HiOutlineWallet}
                            rightIcon={MdOutlineNavigateNext}
                        />
                    )}

                    <ActionButton
                        title={t('FAQs')}
                        description={t(
                            'Still have some doubts? Check out our FAQs and learn more.',
                            {
                                appName: connection.isConnectedWithCrossApp
                                    ? connectionCache?.ecosystemApp?.name
                                    : Object.values(appInfo ?? {})[0]?.name ??
                                      '',
                            },
                        )}
                        onClick={() => setCurrentContent('faq')}
                        leftIcon={BsQuestionCircle}
                        rightIcon={MdOutlineNavigateNext}
                    />
                </VStack>
            </ModalBody>
            <ModalFooter w={'full'}>
                <Button
                    onClick={() => {
                        disconnect();
                        onLogoutSuccess();
                    }}
                    variant="vechainKitSecondary"
                    leftIcon={<RiLogoutBoxLine color="#888888" />}
                >
                    {t('Logout')}
                </Button>
            </ModalFooter>
        </Box>
    );
};
