import {
    ModalBody,
    ModalCloseButton,
    VStack,
    ModalFooter,
    ModalHeader,
    Button,
    Box,
    Tag,
    Text,
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
import { useEffect, useRef } from 'react';
import { RiLogoutBoxLine } from 'react-icons/ri';
import { BsQuestionCircle } from 'react-icons/bs';
import { CgProfile } from 'react-icons/cg';
import { BiBell } from 'react-icons/bi';
import { useNotifications } from '@/hooks/notifications';
import { IoShieldOutline } from 'react-icons/io5';

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

    const { getNotifications } = useNotifications();
    const notifications = getNotifications();
    const hasUnreadNotifications = notifications.some((n) => !n.isRead);

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

                <VStack mt={10} w={'full'} spacing={0}>
                    <ActionButton
                        title={t('Customize profile')}
                        description={t(
                            'Customize your account with a nickname and a picture to easily identify it.',
                        )}
                        onClick={() => {
                            setCurrentContent('account-customization');
                        }}
                        leftIcon={CgProfile}
                        rightIcon={MdOutlineNavigateNext}
                    />

                    <ActionButton
                        style={{
                            marginTop: '10px',
                            borderBottomRadius: connection.isConnectedWithPrivy
                                ? '0px'
                                : '12px',
                        }}
                        title={t('Connection details')}
                        description={t(
                            'View the details of your connection to this app.',
                        )}
                        onClick={() => {
                            setCurrentContent('connection-details');
                        }}
                        leftIcon={VscDebugDisconnect}
                        rightIcon={MdOutlineNavigateNext}
                    />

                    {connection.isConnectedWithPrivy && (
                        <ActionButton
                            style={{
                                borderTopRadius: '0px',
                            }}
                            title={t('Access and security')}
                            description={t(
                                'Manage your embedded wallet security settings or back it up to a new device.',
                            )}
                            onClick={() => {
                                setCurrentContent('embedded-wallet');
                            }}
                            leftIcon={IoShieldOutline}
                            rightIcon={MdOutlineNavigateNext}
                        />
                    )}

                    <ActionButton
                        style={{
                            marginTop: '10px',
                            borderBottomRadius: '0px',
                        }}
                        title={t('Notifications')}
                        description={t('View your notifications and updates.')}
                        onClick={() => {
                            setCurrentContent('notifications');
                        }}
                        leftIcon={BiBell}
                        rightIcon={MdOutlineNavigateNext}
                        extraContent={
                            hasUnreadNotifications && (
                                <Box
                                    minWidth="16px"
                                    height="16px"
                                    bg="red.500"
                                    borderRadius="full"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    ml={2}
                                >
                                    <Text fontSize="xs" color="white">
                                        {
                                            notifications.filter(
                                                (n) => !n.isRead,
                                            ).length
                                        }
                                    </Text>
                                </Box>
                            )
                        }
                    />
                    <ActionButton
                        title={t('Help')}
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
                        style={{
                            borderTopRadius: '0px',
                        }}
                    />
                </VStack>
            </ModalBody>
            <ModalFooter w={'full'}>
                <Button
                    onClick={() =>
                        setCurrentContent({
                            type: 'disconnect-confirm',
                            props: {
                                onDisconnect: () => {
                                    disconnect();
                                    onLogoutSuccess();
                                },
                                onBack: () => setCurrentContent('settings'),
                            },
                        })
                    }
                    variant="vechainKitSecondary"
                    leftIcon={<RiLogoutBoxLine color="#888888" />}
                >
                    {t('Logout')}
                </Button>
            </ModalFooter>
        </Box>
    );
};
