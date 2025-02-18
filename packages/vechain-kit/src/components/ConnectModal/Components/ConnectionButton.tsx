import { Button, HStack, Icon, Text } from '@chakra-ui/react';
import { ReactElement } from 'react';
import { IconType } from 'react-icons';

interface ConnectionButtonProps {
    isDark: boolean;
    onClick: () => void;
    text?: string;
    icon?: IconType;
    customIcon?: ReactElement;
}

export const ConnectionButton = ({
    isDark,
    onClick,
    text,
    icon,
    customIcon,
}: ConnectionButtonProps) => {
    // If text not provided we just show a button with an icon
    if (!text) {
        return (
            <Button
                variant={'loginIn'}
                fontSize={'14px'}
                fontWeight={'400'}
                backgroundColor={isDark ? 'transparent' : '#ffffff'}
                border={`1px solid ${isDark ? '#ffffff1a' : '#ebebeb'}`}
                p={6}
                borderRadius={16}
                w={'full'}
                onClick={onClick}
            >
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
            <Button
                variant={'loginIn'}
                fontSize={'14px'}
                fontWeight={'400'}
                backgroundColor={isDark ? 'transparent' : '#ffffff'}
                border={`1px solid ${isDark ? '#ffffff0a' : '#ebebeb'}`}
                p={6}
                borderRadius={16}
                w={'full'}
                onClick={onClick}
            >
                <HStack w={'full'} justify={'flex-start'} gap={4}>
                    {customIcon ? (
                        customIcon
                    ) : (
                        <Icon as={icon} w={'25px'} h={'25px'} />
                    )}
                    <Text ml={customIcon ? 1 : 0}>{text}</Text>
                </HStack>
            </Button>
        );
    }

    return null;
};
