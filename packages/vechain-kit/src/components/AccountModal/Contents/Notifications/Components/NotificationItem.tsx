import {
    Alert,
    AlertIcon,
    Box,
    Text,
    AlertDescription,
    IconButton,
    Button,
    VStack,
} from '@chakra-ui/react';
import { IoCloseCircle } from 'react-icons/io5';
import { useTranslation } from 'react-i18next';
import { useModal } from '@/providers/ModalProvider';
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
    const { setAccountModalContent } = useModal();

    const handleAction = () => {
        console.log('notification.action', notification.action);
        if (notification.action) {
            setAccountModalContent(notification.action.content);
        }
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
        >
            <AlertIcon boxSize={'16px'} />
            <Box>
                <Text fontSize="sm" fontWeight="500">
                    {/* @ts-ignore */}
                    {t(notification.title)}
                </Text>
                <AlertDescription fontSize={'xs'} lineHeight={'1.2'}>
                    <VStack spacing={2} alignItems={'flex-start'}>
                        <Text>
                            {/* @ts-ignore */}
                            {t(notification.description)}
                        </Text>
                        {notification.action && (
                            <Button
                                size="sm"
                                variant="link"
                                onClick={handleAction}
                                mt={2}
                                color="blue.500"
                            >
                                {/* @ts-ignore */}
                                {t(notification.action.label)}
                            </Button>
                        )}
                    </VStack>
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
