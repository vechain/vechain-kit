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
import { ModalBackButton, StickyHeaderContainer } from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import { useTranslation } from 'react-i18next';
import { useVeChainKitConfig } from '@/providers';
import { useNotifications } from '@/hooks/alerts';
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
        setNotifications(
            notifications.map((notification) =>
                notification.id === id
                    ? { ...notification, isRead: true }
                    : notification,
            ),
        );
    };

    const currentNotifications = isArchiveView
        ? archivedNotifications
        : notifications;

    return (
        <>
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

            <Container maxW={'container.lg'}>
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
                                {currentNotifications.map((notification) => (
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
        </>
    );
};
