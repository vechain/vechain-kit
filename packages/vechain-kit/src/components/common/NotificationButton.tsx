import { IconButtonProps, Box, Button } from '@chakra-ui/react';
import { BiBell } from 'react-icons/bi';

type NotificationButtonProps = {
    onClick: () => void;
    hasUnreadNotifications?: boolean;
} & Partial<IconButtonProps>;

export const NotificationButton = ({
    onClick,
    hasUnreadNotifications,
    ...props
}: NotificationButtonProps) => {
    return (
        <Button
            aria-label="Notifications"
            variant="mainContentButton"
            _dark={{ _hover: { bg: 'whiteAlpha.100' } }}
            // position="absolute"
            // left="10px"
            // top="10px"
            h={12}
            w={14}
            onClick={onClick}
            {...props}
        >
            <Box position="relative">
                <BiBell fontSize={'22px'} />
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
        </Button>
    );
};
