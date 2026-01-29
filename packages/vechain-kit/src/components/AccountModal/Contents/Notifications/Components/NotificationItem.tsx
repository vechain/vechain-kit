import {
    Alert,
    AlertIcon,
    Box,
    AlertDescription,
    IconButton,
    AlertTitle,
} from '@chakra-ui/react';
import { LuCircleX } from 'react-icons/lu';
import { useTranslation } from 'react-i18next';
import { Notification } from '../../../../../hooks/notifications/types';

type Props = {
    notification: Notification;
    isArchiveView: boolean;
    onMarkAsRead: (id: string) => void;
};

export const NotificationItem = ({
    notification,
    isArchiveView,
    onMarkAsRead,
}: Props) => {
    const { t } = useTranslation();

    const handleDismiss = () => {
        onMarkAsRead(notification.id);
    };

    if (notification.isRead && !isArchiveView) {
        return null;
    }

    return (
        <Alert
            key={notification.id}
            status={notification.status}
            variant="subtle"
            borderRadius={'lg'}
            pr={8}
            position="relative"
            opacity={notification.isRead ? 0.7 : 1}
            cursor="pointer"
            _hover={{ opacity: 0.8 }}
            data-testid="notification-item"
        >
            <AlertIcon boxSize={'16px'} />
            <Box>
                <AlertTitle fontSize={'sm'} data-testid="notification-title">
                    {/* @ts-ignore */}
                    {t(notification.title)}
                </AlertTitle>
                <AlertDescription fontSize={'xs'} lineHeight={'1.2'} data-testid="notification-text">
                    {/* @ts-ignore */}
                    {t(notification.description)}
                </AlertDescription>
            </Box>
            {!isArchiveView && !notification.isRead && (
                <IconButton
                    position="absolute"
                    right={1}
                    top={1}
                    size="sm"
                    variant="ghost"
                    icon={<LuCircleX />}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDismiss();
                    }}
                    aria-label="Mark as read and archive"
                    data-testid="remove-notification-button"
                />
            )}
        </Alert>
    );
};
