import {
    Button,
    ButtonProps,
    Icon,
    Popover,
    PopoverBody,
    PopoverContent,
    PopoverTrigger,
} from '@chakra-ui/react';
import { ConnectionOptionsStack } from './Components/ConnectionOptionsStack';
import { useTranslation } from 'react-i18next';
import { FaChevronDown } from 'react-icons/fa';

type ConnectPopoverProps = {
    isLoading: boolean;
    buttonStyle?: ButtonProps;
};

export const ConnectPopover = ({
    isLoading,
    buttonStyle,
}: ConnectPopoverProps) => {
    const { t } = useTranslation();
    return (
        <Popover
            placement="bottom-start"
            size={'xl'}
            closeOnBlur={false}
            variant="vechainKitBase"
        >
            {({ isOpen }) => (
                <>
                    <PopoverTrigger>
                        <Button
                            isLoading={isLoading}
                            {...buttonStyle}
                            isActive={isOpen}
                        >
                            {t('Login')}
                            <Icon
                                ml={2}
                                as={FaChevronDown}
                                transform={
                                    isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                                }
                                transition="transform 0.2s"
                            />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                        <PopoverBody>
                            <ConnectionOptionsStack />
                        </PopoverBody>
                    </PopoverContent>
                </>
            )}
        </Popover>
    );
};
