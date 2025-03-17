import { HStack, VStack, Text, Tooltip, TooltipProps } from '@chakra-ui/react';

import { useTranslation } from 'react-i18next';

type HighlightLoginTooltipProps = {
    children: React.ReactNode;
    isOpen: boolean;
    tooltipPlacement?: TooltipProps['placement'];
};

export const HighlightLoginTooltip = ({
    children,
    isOpen,
    tooltipPlacement = 'bottom-end',
}: HighlightLoginTooltipProps) => {
    const { t } = useTranslation();
    return (
        <Tooltip
            isOpen={isOpen}
            label={
                <HStack spacing={3}>
                    <VStack spacing={1} flex="1">
                        <Text alignSelf={'start'} fontSize="xs" color="#365217">
                            {t('NEW LOG IN IS OUT!')}
                        </Text>
                        <Text
                            fontSize="sm"
                            fontWeight="bold"
                            color="#365217"
                            lineHeight={1.2}
                        >
                            {t(
                                'Log in with your social media and start earning rewards!',
                            )}
                        </Text>
                    </VStack>
                </HStack>
            }
            placement={tooltipPlacement}
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
