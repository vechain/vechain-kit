import {
    Button,
    HStack,
    Image,
    Text,
    Box,
    VStack,
    ButtonProps,
    useToken,
} from '@chakra-ui/react';
import { TOKEN_LOGOS, TOKEN_LOGO_COMPONENTS } from '@/utils';
import React from 'react';
import { CURRENCY } from '@/types';
import {
    formatCompactCurrency,
    SupportedCurrency,
} from '@/utils/currencyUtils';

type AssetButtonProps = ButtonProps & {
    symbol: string;
    amount: number;
    currencyValue: number;
    currentCurrency: CURRENCY;
    isDisabled?: boolean;
    onClick?: () => void;
};

export const AssetButton = ({
    symbol,
    amount,
    currencyValue,
    currentCurrency,
    isDisabled,
    onClick,
    ...buttonProps
}: AssetButtonProps) => {
    const textPrimary = useToken('colors', 'vechain-kit-text-primary');
    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');

    return (
        <Button
            height="72px"
            variant="ghost"
            justifyContent="space-between"
            isDisabled={isDisabled}
            p={4}
            w="100%"
            _disabled={{
                cursor: 'not-allowed',
                opacity: 0.5,
            }}
            onClick={onClick}
            data-testid={`asset-${symbol}`}
            {...buttonProps}
        >
            <HStack>
                {TOKEN_LOGO_COMPONENTS[symbol] ? (
                    React.cloneElement(TOKEN_LOGO_COMPONENTS[symbol], {
                        boxSize: '24px',
                        borderRadius: 'full',
                    })
                ) : (
                    <Image
                        src={TOKEN_LOGOS[symbol]}
                        alt={`${symbol} logo`}
                        boxSize="24px"
                        borderRadius="full"
                        fallback={
                            <Box
                                boxSize="24px"
                                borderRadius="full"
                                bg="whiteAlpha.200"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Text
                                    fontSize="10px"
                                    fontWeight="bold"
                                    color={textPrimary}
                                >
                                    {symbol.slice(0, 3)}
                                </Text>
                            </Box>
                        }
                    />
                )}
                <Text color={textPrimary}>{symbol}</Text>
            </HStack>
            <VStack align="flex-end" spacing={0}>
                <Text color={textPrimary}>
                    {amount.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                    })}{' '}
                </Text>
                <Text
                    fontSize="sm"
                    color={textSecondary}
                    data-testid={`${symbol}-balance`}
                >
                    {formatCompactCurrency(currencyValue, {
                        currency: currentCurrency as SupportedCurrency,
                    })}
                </Text>
            </VStack>
        </Button>
    );
};
