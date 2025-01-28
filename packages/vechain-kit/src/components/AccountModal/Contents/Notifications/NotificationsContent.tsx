import {
    Container,
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    VStack,
    Icon,
    ModalFooter,
    Button,
    HStack,
    Box,
} from '@chakra-ui/react';
import { BiBell, BiArchive } from 'react-icons/bi';
import { ModalBackButton, StickyHeaderContainer } from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import { useTranslation } from 'react-i18next';
import { useVeChainKitConfig } from '@/providers';
import { useNotifications } from '@/hooks/notifications';
import { useState } from 'react';
import { EmptyNotifications } from './Components/EmptyNotifications';
import { NotificationItem } from './Components/NotificationItem';

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
};

export const NotificationsContent = ({ setCurrentContent }: Props) => {
    const { t } = useTranslation();
    const { darkMode: isDark } = useVeChainKitConfig();
    const {
        getNotifications,
        getArchivedNotifications,
        clearAllNotifications,
        markAsRead,
    } = useNotifications();
    const [isArchiveView, setIsArchiveView] = useState(false);
    const [notifications, setNotifications] = useState(getNotifications());
    const [archivedNotifications, setArchivedNotifications] = useState(
        getArchivedNotifications(),
    );

    const handleClearAll = () => {
        clearAllNotifications();
        setArchivedNotifications([...archivedNotifications, ...notifications]);
        setNotifications([]);
    };

    const handleMarkAsRead = (id: string) => {
        markAsRead(id);
        const notificationToArchive = notifications.find((n) => n.id === id);
        setNotifications(notifications.filter((n) => n.id !== id));
        if (notificationToArchive) {
            setArchivedNotifications([
                { ...notificationToArchive, isRead: true },
                ...archivedNotifications,
            ]);
        }
    };

    const currentNotifications = isArchiveView
        ? archivedNotifications
        : notifications;

    // Sort notifications by date in descending order (newest first)
    const sortedNotifications = [...currentNotifications].sort((a, b) => {
        // Welcome notification always first
        if (a.id === 'welcome') return -1;
        if (b.id === 'welcome') return 1;

        // Smart account second
        if (a.id === 'smart-account') return -1;
        if (b.id === 'smart-account') return 1;

        // Multiclause third
        if (a.id === 'multiclause') return -1;
        if (b.id === 'multiclause') return 1;

        // All other notifications sorted by timestamp
        return b.timestamp - a.timestamp;
    });

    return (
        <Box>
            <StickyHeaderContainer>
                <ModalBackButton onClick={() => setCurrentContent('main')} />
                <ModalHeader
                    fontSize={'md'}
                    fontWeight={'500'}
                    textAlign={'center'}
                    color={isDark ? '#dfdfdd' : '#4d4d4d'}
                >
                    {isArchiveView
                        ? t('Archived Notifications')
                        : t('Notifications')}
                </ModalHeader>
                <ModalCloseButton />
            </StickyHeaderContainer>

            <Container maxW={'container.lg'} h="350px">
                <ModalBody w={'full'}>
                    <VStack spacing={4} align="stretch" w="full">
                        <HStack justify="space-between">
                            <Button
                                variant="ghost"
                                leftIcon={
                                    <Icon
                                        as={isArchiveView ? BiBell : BiArchive}
                                    />
                                }
                                size="sm"
                                onClick={() => setIsArchiveView(!isArchiveView)}
                            >
                                {isArchiveView ? t('Current') : t('Archived')}
                            </Button>
                            {!isArchiveView && notifications.length > 0 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleClearAll}
                                >
                                    {t('Clear all')}
                                </Button>
                            )}
                        </HStack>

                        {currentNotifications.length === 0 ? (
                            <EmptyNotifications showArchived={isArchiveView} />
                        ) : (
                            <VStack spacing={3}>
                                {sortedNotifications.map((notification) => (
                                    <NotificationItem
                                        key={notification.id}
                                        notification={notification}
                                        isArchiveView={isArchiveView}
                                        onMarkAsRead={handleMarkAsRead}
                                    />
                                ))}
                            </VStack>
                        )}
                    </VStack>
                </ModalBody>
                <ModalFooter></ModalFooter>
            </Container>
        </Box>
    );
};
