import { Button, Icon, Text } from '@chakra-ui/react';
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
                leftIcon={
                    customIcon ? (
                        customIcon
                    ) : (
                        <Icon as={icon} w={'25px'} h={'25px'} />
                    )
                }
            >
                {text && <Text>{text}</Text>}
            </Button>
        );
    }

    return null;
};
