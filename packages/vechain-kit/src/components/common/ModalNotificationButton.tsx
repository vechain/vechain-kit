import { IconButton, IconButtonProps, Box } from '@chakra-ui/react';
import { BiBell } from 'react-icons/bi';

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
            _hover={{ bg: 'blackAlpha.100' }}
            _dark={{ _hover: { bg: 'whiteAlpha.100' } }}
            position="absolute"
            borderRadius={'50%'}
            right="10px"
            top="10px"
            onClick={onClick}
            icon={
                <Box position="relative">
                    <BiBell fontSize={'20px'} />
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
