import {
    Alert,
    AlertIcon,
    Box,
    Text,
    AlertDescription,
    IconButton,
} from '@chakra-ui/react';
import { IoCloseCircle } from 'react-icons/io5';
import { Notification } from '../types';

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
                <Text fontSize="sm" fontWeight="500">
                    {notification.title}
                </Text>
                <AlertDescription fontSize={'xs'} lineHeight={'1.2'}>
                    {notification.description}
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
