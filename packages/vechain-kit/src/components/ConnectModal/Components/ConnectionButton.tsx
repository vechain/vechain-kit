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

/**
 * Login provider button — uses the three-slot layout from the design spec:
 *   [ 24px icon ] [ label flex=1 ] [ optional trailing slot ]
 *
 * - Height ~52px, padding 14px 18px, gap 14px
 * - Icon-only mode (no `text`) keeps the legacy compact layout
 */
export const ConnectionButton = ({
    onClick,
    text,
    icon,
    customIcon,
    rightIcon,
    style,
    variant = 'loginIn',
    iconWidth = '24px',
}: ConnectionButtonProps) => {
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

    return (
        <Button
            {...style}
            variant={variant}
            w={'full'}
            h={'52px'}
            px={'18px'}
            py={'14px'}
            onClick={onClick}
            _active={{ transform: 'scale(0.99)' }}
        >
            <HStack
                w={'full'}
                spacing={'14px'}
                justify={'flex-start'}
                align={'center'}
            >
                {customIcon ? (
                    customIcon
                ) : (
                    <Icon as={icon} w={iconWidth} h={iconWidth} flexShrink={0} />
                )}
                <Text
                    flex={1}
                    textAlign={'left'}
                    fontSize={'15px'}
                    fontWeight={600}
                    letterSpacing={'-0.005em'}
                    noOfLines={1}
                >
                    {text}
                </Text>
                {rightIcon}
            </HStack>
        </Button>
    );
};
