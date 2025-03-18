import {
    ModalBody,
    ModalCloseButton,
    VStack,
    ModalFooter,
    ModalHeader,
    Box,
    Button,
} from '@chakra-ui/react';
import {
    useCrossAppConnectionCache,
    useFetchAppInfo,
    useUpgradeRequired,
    useWallet,
} from '@/hooks';
import { MdOutlineNavigateNext } from 'react-icons/md';
import { ActionButton } from '@/components';
import { ModalBackButton, StickyHeaderContainer } from '@/components/common';
import { useVeChainKitConfig } from '@/providers/VeChainKitProvider';
import { AccountModalContentTypes } from '../../Types';
import { useTranslation } from 'react-i18next';
import { VscDebugDisconnect } from 'react-icons/vsc';
import { useEffect, useRef } from 'react';
import { BsQuestionCircle } from 'react-icons/bs';
import { BiBell } from 'react-icons/bi';
import { useNotifications } from '@/hooks/notifications';
import { IoShieldOutline } from 'react-icons/io5';
import { RiLogoutBoxLine } from 'react-icons/ri';
import { FaRegAddressCard } from 'react-icons/fa';
import { Analytics } from '@/utils/mixpanelClientInstance';

export type SettingsContentProps = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    onLogoutSuccess: () => void;
};

export const SettingsContent = ({
    setCurrentContent,
    onLogoutSuccess,
}: SettingsContentProps) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const { t } = useTranslation();

    const { privy } = useVeChainKitConfig();

    const { connection, disconnect, account, smartAccount, connectedWallet } =
        useWallet();

    const { getConnectionCache } = useCrossAppConnectionCache();
    const connectionCache = getConnectionCache();

    const { data: appInfo } = useFetchAppInfo(privy?.appId ?? '');

    const { getNotifications } = useNotifications();
    const notifications = getNotifications();
    const hasUnreadNotifications = notifications.some((n) => !n.isRead);

    const { data: upgradeRequired } = useUpgradeRequired(
        smartAccount?.address ?? '',
        connectedWallet?.address ?? '',
        3,
    );

    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.scrollTop = 0;
        }
    }, []);

    const handleNameChange = () => {
        Analytics.settings.nameSelection.started();
        if (account?.domain) {
            setCurrentContent({
                type: 'choose-name-search',
                props: {
                    name: '',
                    setCurrentContent,
                    initialContentSource: 'settings',
                },
            });
        } else {
            setCurrentContent({
                type: 'choose-name',
                props: {
                    setCurrentContent,
                    initialContentSource: 'settings',
                    onBack: () => setCurrentContent('settings'),
                },
            });
        }
    };

    const handleAccessAndSecurity = () => {
        setCurrentContent('access-and-security');
        Analytics.settings.accessAndSecurityViewed();
    };

    const handleConnectionDetails = () => {
        setCurrentContent('connection-details');
        Analytics.settings.connectionDetailsViewed();
    };

    const handleLogout = () => {
        Analytics.auth.trackAuth('disconnect_initiated');
        disconnect();
        onLogoutSuccess();
    };

    return (
        <Box>
            <StickyHeaderContainer>
                <ModalHeader>{t('Settings')}</ModalHeader>

                <ModalBackButton onClick={() => setCurrentContent('main')} />
                <ModalCloseButton />
            </StickyHeaderContainer>

            <ModalBody w={'full'}>
                <VStack w={'full'} spacing={0}>
                    <ActionButton
                        style={{
                            marginTop: '10px',
                            borderBottomRadius: connection.isConnectedWithPrivy
                                ? '0px'
                                : '12px',
                        }}
                        title={t('Choose account name')}
                        description={t('Choose a name for your account.')}
                        onClick={handleNameChange}
                        leftIcon={FaRegAddressCard}
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
                            onClick={handleAccessAndSecurity}
                            leftIcon={IoShieldOutline}
                            rightIcon={MdOutlineNavigateNext}
                            extraContent={
                                upgradeRequired && (
                                    <Box
                                        minWidth="8px"
                                        height="8px"
                                        bg="red.500"
                                        borderRadius="full"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                    />
                                )
                            }
                        />
                    )}

                    <ActionButton
                        style={{
                            marginTop: '10px',
                            borderBottomRadius: '0px',
                        }}
                        title={t('Connection details')}
                        description={t(
                            'View the details of your connection to this app.',
                        )}
                        onClick={handleConnectionDetails}
                        leftIcon={VscDebugDisconnect}
                        rightIcon={MdOutlineNavigateNext}
                    />
                    <ActionButton
                        style={{
                            borderTopRadius: '0px',
                            borderBottomRadius: '0px',
                        }}
                        title={t('Notifications')}
                        description={t('View your notifications and updates.')}
                        onClick={() => {
                            Analytics.notifications.viewed();
                            setCurrentContent('notifications');
                        }}
                        leftIcon={BiBell}
                        rightIcon={MdOutlineNavigateNext}
                        extraContent={
                            hasUnreadNotifications && (
                                <Box
                                    minWidth="8px"
                                    height="8px"
                                    bg="red.500"
                                    borderRadius="full"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                />
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
                        onClick={() =>
                            setCurrentContent({
                                type: 'faq',
                                props: {
                                    onGoBack: () =>
                                        setCurrentContent('settings'),
                                },
                            })
                        }
                        leftIcon={BsQuestionCircle}
                        rightIcon={MdOutlineNavigateNext}
                        style={{
                            borderTopRadius: '0px',
                        }}
                    />
                </VStack>
            </ModalBody>
            <ModalFooter>
                <VStack w={'full'} spacing={4}>
                    <Button
                        onClick={() =>
                            setCurrentContent({
                                type: 'disconnect-confirm',
                                props: {
                                    onDisconnect: handleLogout,
                                    onBack: () => setCurrentContent('settings'),
                                },
                            })
                        }
                        variant="vechainKitSecondary"
                        leftIcon={
                            <RiLogoutBoxLine
                                color="#888888"
                                fontSize={'16px'}
                            />
                        }
                    >
                        {t('Logout')}
                    </Button>
                </VStack>
            </ModalFooter>
        </Box>
    );
};
