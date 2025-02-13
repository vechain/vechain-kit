import {
    ModalBody,
    ModalCloseButton,
    VStack,
    ModalFooter,
    ModalHeader,
    Box,
    Text,
} from '@chakra-ui/react';
import {
    useCrossAppConnectionCache,
    useFetchAppInfo,
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

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
};

export const SettingsContent = ({ setCurrentContent }: Props) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const { t } = useTranslation();

    const { privy, darkMode: isDark } = useVeChainKitConfig();

    const { connection } = useWallet();

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
                <VStack w={'full'} spacing={0}>
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
                                setCurrentContent('access-and-security');
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
            <ModalFooter />
        </Box>
    );
};
