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
} from '@chakra-ui/react';
import { BiBell, BiArchive } from 'react-icons/bi';
import {
    ModalBackButton,
    ScrollToTopWrapper,
    StickyHeaderContainer,
} from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '@/hooks/notifications';
import { useState } from 'react';
import { EmptyNotifications } from './Components/EmptyNotifications';
import { NotificationItem } from './Components/NotificationItem';
import { Analytics } from '@/utils/mixpanelClientInstance';

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
};

export const NotificationsContent = ({ setCurrentContent }: Props) => {
    const { t } = useTranslation();
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
        Analytics.notifications.cleared(undefined, notifications.length);
        clearAllNotifications();
        setArchivedNotifications([...archivedNotifications, ...notifications]);
        setNotifications([]);
    };

    const handleMarkAsRead = (id: string) => {
        const notification = notifications.find((n) => n.id === id);
        if (notification) {
            Analytics.notifications.archived(notification.status);
        }
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

    const handleToggleView = () => {
        Analytics.notifications.toggleView(
            isArchiveView ? 'current' : 'archived',
        );
        setIsArchiveView(!isArchiveView);
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
        <ScrollToTopWrapper>
            <StickyHeaderContainer>
                <ModalBackButton
                    onClick={() => setCurrentContent('settings')}
                />
                <ModalHeader data-testid="modal-title">
                    {isArchiveView
                        ? t('Archived Notifications')
                        : t('Notifications')}
                </ModalHeader>
                <ModalCloseButton />
            </StickyHeaderContainer>

            <Container h={['540px', 'auto']} p={0}>
                <ModalBody>
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
                                onClick={handleToggleView}
                                data-testid='toggle-view-button'
                            >
                                {isArchiveView ? t('Current') : t('Archived')}
                            </Button>
                            {!isArchiveView && notifications.length > 0 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleClearAll}
                                    data-testid="clear-all-button"
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
                <ModalFooter pt={0} />
            </Container>
        </ScrollToTopWrapper>
    );
};
