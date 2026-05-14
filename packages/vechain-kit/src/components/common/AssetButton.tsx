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
import { TOKEN_LOGOS, TOKEN_LOGO_COMPONENTS } from '@/utils/constants';
import React from 'react';
import { CURRENCY } from '@/types';
import { LocalStorageKey, useLocalStorage } from '@/hooks';
import {
    formatCompactCurrency,
    SupportedCurrency,
} from '@/utils/currencyUtils';
import { PriceChangeBadge } from './PriceChangeBadge';

type AssetButtonProps = ButtonProps & {
    symbol: string;
    amount: number;
    currencyValue: number;
    currentCurrency: CURRENCY;
    isDisabled?: boolean;
    onClick?: () => void;
    priceChange24hPct?: number;
};

export const AssetButton = ({
    symbol,
    amount,
    currencyValue,
    currentCurrency,
    isDisabled,
    onClick,
    priceChange24hPct,
    ...buttonProps
}: AssetButtonProps) => {
    const textPrimary = useToken('colors', 'vechain-kit-text-primary');
    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');
    const cardBg = useToken('colors', 'vechain-kit-card');
    const [showAssets] = useLocalStorage(LocalStorageKey.SHOW_ASSETS, true);

    const formattedAmount = showAssets
        ? amount.toLocaleString(undefined, { maximumFractionDigits: 2 })
        : '*'.repeat(4);
    const formattedCurrency = showAssets
        ? formatCompactCurrency(currencyValue, {
              currency: currentCurrency as SupportedCurrency,
          })
        : '*'.repeat(4);

    return (
        <Button
            height="64px"
            variant="ghost"
            bg={cardBg}
            borderRadius="xl"
            justifyContent="space-between"
            isDisabled={isDisabled}
            px={4}
            py={3}
            w="100%"
            _hover={{ bg: cardBg, opacity: 0.85 }}
            _active={{ bg: cardBg, opacity: 0.7 }}
            _disabled={{
                cursor: 'not-allowed',
                opacity: 0.5,
            }}
            onClick={onClick}
            data-testid={`asset-${symbol}`}
            {...buttonProps}
        >
            <HStack spacing={3} flex={1} minW={0}>
                {TOKEN_LOGO_COMPONENTS[symbol] ? (
                    React.cloneElement(TOKEN_LOGO_COMPONENTS[symbol], {
                        boxSize: '36px',
                        borderRadius: 'full',
                    })
                ) : (
                    <Image
                        src={TOKEN_LOGOS[symbol]}
                        alt={`${symbol} logo`}
                        boxSize="36px"
                        borderRadius="full"
                        fallback={
                            <Box
                                boxSize="36px"
                                borderRadius="full"
                                bg="whiteAlpha.300"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Text
                                    fontSize="11px"
                                    fontWeight="bold"
                                    color={textPrimary}
                                >
                                    {symbol.slice(0, 3)}
                                </Text>
                            </Box>
                        }
                    />
                )}
                <VStack align="flex-start" spacing={0} minW={0}>
                    <Text
                        fontWeight="700"
                        fontSize="md"
                        color={textPrimary}
                        lineHeight="short"
                    >
                        {symbol}
                    </Text>
                    <Text
                        fontSize="sm"
                        color={textSecondary}
                        lineHeight="short"
                        noOfLines={1}
                    >
                        {formattedAmount} {symbol}
                    </Text>
                </VStack>
            </HStack>
            <VStack align="flex-end" spacing={0}>
                <Text
                    fontWeight="700"
                    fontSize="md"
                    color={textPrimary}
                    lineHeight="short"
                    data-testid={`${symbol}-balance`}
                >
                    {formattedCurrency}
                </Text>
                {showAssets && (
                    <PriceChangeBadge
                        valuePct={priceChange24hPct}
                        lineHeight="short"
                    />
                )}
            </VStack>
        </Button>
    );
};
