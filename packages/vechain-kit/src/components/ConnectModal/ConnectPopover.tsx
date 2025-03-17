import {
    Box,
    Button,
    ButtonProps,
    Icon,
    Popover,
    PopoverBody,
    PopoverContent,
    PopoverTrigger,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { FaChevronDown } from 'react-icons/fa';

import { WalletButtonTooltipProps } from '../WalletButton/types';
import { ConnectionOptionsStack } from './Components/ConnectionOptionsStack';
import { HighlightLoginTooltip } from './Components/HighlightLoginTooltip';

type ConnectPopoverProps = {
    isLoading: boolean;
    buttonStyle?: ButtonProps;
    highlightLoginTooltip?: WalletButtonTooltipProps;
};

export const ConnectPopover = ({
    isLoading,
    buttonStyle,
    highlightLoginTooltip,
}: ConnectPopoverProps) => {
    const { t } = useTranslation();
    return (
        <Popover
            placement="bottom-start"
            size="xl"
            closeOnBlur={false}
            variant="vechainKitBase"
        >
            {({ isOpen: isPopoverOpen }) => (
                <>
                    <Box position="relative">
                        <HighlightLoginTooltip
                            isOpen={!isPopoverOpen && !!highlightLoginTooltip}
                            {...highlightLoginTooltip}
                        >
                            <Box display="inline-block">
                                <PopoverTrigger>
                                    <Button
                                        isLoading={isLoading}
                                        {...buttonStyle}
                                        isActive={isPopoverOpen}
                                        position="relative"
                                        zIndex={1}
                                    >
                                        {t('Login')}
                                        <Icon
                                            ml={2}
                                            as={FaChevronDown}
                                            transform={
                                                isPopoverOpen
                                                    ? 'rotate(180deg)'
                                                    : 'rotate(0deg)'
                                            }
                                            transition="transform 0.2s"
                                        />
                                    </Button>
                                </PopoverTrigger>
                            </Box>
                        </HighlightLoginTooltip>
                    </Box>
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
