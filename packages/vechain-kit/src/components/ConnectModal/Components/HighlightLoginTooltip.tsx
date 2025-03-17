import { HStack, Text, Tooltip, VStack } from '@chakra-ui/react';
import { t } from 'i18next';

import { WalletButtonTooltipProps } from '../../WalletButton/types';

type HighlightLoginTooltipProps = WalletButtonTooltipProps & {
    children: React.ReactNode;
    isOpen: boolean;
};

export const HighlightLoginTooltip = ({
    children,
    isOpen,
    title = t('NEW LOG IN IS OUT!'),
    description = t('Log in with your social media and start earning rewards!'),
    placement = 'right',
}: HighlightLoginTooltipProps) => {
    return (
        <Tooltip
            isOpen={isOpen}
            label={
                <HStack spacing={3}>
                    <VStack spacing={1} flex="1">
                        <Text alignSelf={'start'} fontSize="xs" color="#365217">
                            {title}
                        </Text>
                        <Text
                            fontSize="sm"
                            fontWeight="bold"
                            color="#365217"
                            lineHeight={1.2}
                        >
                            {description}
                        </Text>
                    </VStack>
                </HStack>
            }
            placement={placement}
            bg="#B1F16C"
            color="#365217"
            borderRadius={14}
            p={4}
            hasArrow
            arrowSize={10}
            offset={[30, 10]}
            zIndex={2}
        >
            {children}
        </Tooltip>
    );
};
