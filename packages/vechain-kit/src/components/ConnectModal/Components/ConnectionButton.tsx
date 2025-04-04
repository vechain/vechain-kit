import { Button, ButtonProps, HStack, Icon, Text } from '@chakra-ui/react';
import { ReactElement } from 'react';
import { IconType } from 'react-icons';

interface ConnectionButtonProps {
    isDark: boolean;
    onClick: () => void;
    text?: string;
    icon?: IconType;
    customIcon?: ReactElement;
    rightIcon?: ReactElement;
    style?: ButtonProps;
    variant?: string;
    iconWidth?: string;
}

export const ConnectionButton = ({
    onClick,
    text,
    icon,
    customIcon,
    rightIcon,
    style,
    variant = 'loginIn',
    iconWidth = '25px',
}: ConnectionButtonProps) => {
    // If text not provided we just show a button with an icon
    if (!text) {
        return (
            <Button {...style} variant={variant} w={'full'} onClick={onClick}>
                {customIcon ? (
                    customIcon
                ) : (
                    <Icon as={icon} w={'20px'} h={'20px'} />
                )}
            </Button>
        );
    }

    if (text) {
        return (
            <Button {...style} variant={variant} w={'full'} onClick={onClick}>
                <HStack w={'full'} justify={'flex-start'} gap={2}>
                    {customIcon ? (
                        customIcon
                    ) : (
                        <Icon as={icon} w={iconWidth} h={iconWidth} />
                    )}
                    <Text opacity={0.9}>{text}</Text>
                </HStack>
                {rightIcon}
            </Button>
        );
    }

    return null;
};
