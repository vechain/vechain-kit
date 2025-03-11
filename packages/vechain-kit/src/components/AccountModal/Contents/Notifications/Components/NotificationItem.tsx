import {
    Alert,
    AlertIcon,
    Box,
    AlertDescription,
    IconButton,
    AlertTitle,
} from '@chakra-ui/react';
import { IoCloseCircle } from 'react-icons/io5';
import { useTranslation } from 'react-i18next';
import { Notification } from '@/hooks/notifications/types';

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
        >
            <AlertIcon boxSize={'16px'} />
            <Box>
                <AlertTitle fontSize={'sm'}>
                    {/* @ts-ignore */}
                    {t(notification.title)}
                </AlertTitle>
                <AlertDescription fontSize={'xs'} lineHeight={'1.2'}>
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
                    icon={<IoCloseCircle />}
                    onClick={() => onMarkAsRead(notification.id)}
                    aria-label="Mark as read and archive"
                />
            )}
        </Alert>
    );
};
