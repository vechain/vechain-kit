import {
    Button,
    HStack,
    Image,
    Text,
    Box,
    VStack,
    ButtonProps,
} from '@chakra-ui/react';
import { TOKEN_LOGOS, TOKEN_LOGO_COMPONENTS } from '@/utils';
import React from 'react';
import { useVeChainKitConfig } from '@/providers';
import { CURRENCY } from '@/types';

type AssetButtonProps = ButtonProps & {
    symbol: string;
    amount: number;
    currencyValue: number;
    currentCurrency: CURRENCY;
    isDisabled?: boolean;
    onClick?: () => void;
};

const amountFormatter = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 2,
});

export const AssetButton = ({
    symbol,
    amount,
    currencyValue,
    currentCurrency,
    isDisabled,
    onClick,
    ...buttonProps
}: AssetButtonProps) => {
    const { darkMode: isDark } = useVeChainKitConfig();
    const compactFormatter = new Intl.NumberFormat('en-US', {
        notation: 'compact',
        compactDisplay: 'short',
        maximumFractionDigits: 2,
        style: 'currency',
        currency: currentCurrency,
    });
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
                                <Text fontSize="10px" fontWeight="bold">
                                    {symbol.slice(0, 3)}
                                </Text>
                            </Box>
                        }
                    />
                )}
                <Text>{symbol}</Text>
            </HStack>
            <VStack align="flex-end" spacing={0}>
                <Text>{compactFormatter.format(currencyValue)}</Text>
                <Text
                    fontSize="sm"
                    color={isDark ? 'whiteAlpha.600' : 'blackAlpha.600'}
                    data-testid={`${symbol}-balance`}
                >
                    {amountFormatter.format(amount)}
                </Text>
            </VStack>
        </Button>
    );
};
