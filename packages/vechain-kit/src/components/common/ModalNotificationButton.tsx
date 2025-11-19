import { IconButton, IconButtonProps, Box } from '@chakra-ui/react';
import { LuBell } from 'react-icons/lu';

type NotificationButtonProps = {
    onClick: () => void;
    hasUnreadNotifications?: boolean;
} & Partial<IconButtonProps>;

export const ModalNotificationButton = ({
    onClick,
    hasUnreadNotifications,
    ...props
}: NotificationButtonProps) => {
    return (
        <IconButton
            aria-label="Notifications"
            size="sm"
            variant="ghost"
            position="absolute"
            borderRadius={'50%'}
            left="10px"
            top="10px"
            onClick={onClick}
            icon={
                <Box position="relative">
                    <LuBell fontSize={'20px'} />
                    {hasUnreadNotifications && (
                        <Box
                            position="absolute"
                            top="-1px"
                            right="-1px"
                            minWidth="8px"
                            height="8px"
                            bg="red.500"
                            borderRadius="full"
                        />
                    )}
                </Box>
            }
            {...props}
        />
    );
};
