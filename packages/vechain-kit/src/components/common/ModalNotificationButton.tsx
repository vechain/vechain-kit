import { useVeChainKitConfig } from '@/providers';
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
    const { darkMode: isDark } = useVeChainKitConfig();
    return (
        <IconButton
            aria-label="Notifications"
            size="sm"
            variant="ghost"
            _hover={{ bg: isDark ? 'whiteAlpha.100' : 'blackAlpha.100' }}
            position="absolute"
            borderRadius={'50%'}
            left="10px"
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
