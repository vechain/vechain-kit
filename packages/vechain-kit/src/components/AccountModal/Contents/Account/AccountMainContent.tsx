import {
    HStack,
    Icon,
    IconButton,
    ModalBody,
    ModalCloseButton,
    ModalFooter,
    ModalHeader,
    VStack,
    Box,
} from '@chakra-ui/react';
import {
    StickyHeaderContainer,
    VersionFooter,
    ScrollToTopWrapper,
} from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import {
    AccountSelector,
    AssetsSection,
    BalanceSection,
    QuickActionsSection,
} from '@/components';
import { Wallet } from '@/types';
import { useTranslation } from 'react-i18next';
import { useVeChainKitConfig } from '@/providers';
import { useWallet } from '@/hooks';
import { BiBell } from 'react-icons/bi';
import { useNotifications } from '@/hooks/notifications';
import { FeatureAnnouncementCard } from '../../Components/Alerts';
import { RiLogoutBoxLine } from 'react-icons/ri';
import React from 'react';

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    onClose: () => void;
    wallet: Wallet;
};

export const AccountMainContent = ({
    setCurrentContent,
    wallet,
    onClose,
}: Props) => {
    const { t } = useTranslation();
    const { darkMode: isDark } = useVeChainKitConfig();
    const { disconnect, connection, account } = useWallet();
    const { getNotifications } = useNotifications();
    const notifications = getNotifications();
    const hasUnreadNotifications = notifications.some((n) => !n.isRead);

    const handleDisconnect = () => {
        disconnect();
        onClose();
    };

    return (
        <ScrollToTopWrapper>
            <StickyHeaderContainer>
                <ModalHeader
                    w={'full'}
                    color={isDark ? '#dfdfdd' : 'rgb(77, 77, 77)'}
                    fontSize={'md'}
                    fontWeight={'500'}
                    textAlign={'center'}
                >
                    {connection.isConnectedWithPrivy
                        ? t('Account')
                        : t('Wallet')}
                </ModalHeader>

                <ModalCloseButton />
            </StickyHeaderContainer>

            <ModalBody w={'full'}>
                <VStack w={'full'} overflow={'hidden'}>
                    {!account?.domain && (
                        <FeatureAnnouncementCard
                            setCurrentContent={setCurrentContent}
                        />
                    )}

                    <HStack justify={'space-between'}>
                        <IconButton
                            p={2}
                            h={9}
                            icon={<Icon boxSize={5} as={RiLogoutBoxLine} />}
                            aria-label="Disconnect"
                            variant="vechainKitSelector"
                            onClick={() =>
                                setCurrentContent({
                                    type: 'disconnect-confirm',
                                    props: {
                                        onDisconnect: handleDisconnect,
                                        onBack: () => setCurrentContent('main'),
                                    },
                                })
                            }
                        />
                        <AccountSelector
                            mt={0}
                            onClick={() => {
                                setCurrentContent('settings');
                            }}
                            wallet={wallet}
                        />
                        <Box position="relative">
                            <IconButton
                                p={2}
                                h={9}
                                variant="vechainKitSelector"
                                aria-label="notifications"
                                icon={<Icon boxSize={5} as={BiBell} />}
                                onClick={() =>
                                    setCurrentContent('notifications')
                                }
                            />
                            {hasUnreadNotifications && (
                                <Box
                                    position="absolute"
                                    top={1}
                                    right={1}
                                    width="8px"
                                    height="8px"
                                    bg="red.500"
                                    borderRadius="full"
                                />
                            )}
                        </Box>
                    </HStack>

                    <BalanceSection mt={14} />

                    <QuickActionsSection
                        mt={14}
                        setCurrentContent={setCurrentContent}
                    />
                    <AssetsSection
                        mt={2}
                        setCurrentContent={setCurrentContent}
                    />
                </VStack>
            </ModalBody>
            <ModalFooter>
                <VersionFooter />
            </ModalFooter>
        </ScrollToTopWrapper>
    );
};
