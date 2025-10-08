import { Button, HStack, Text, VStack, ButtonProps } from '@chakra-ui/react';
import { useVeChainKitConfig } from '@/providers';
import { CURRENCY } from '@/types';
import {
    formatCompactCurrency,
    SupportedCurrency,
} from '@/utils/currencyUtils';
import { TokenIcon } from './TokenIcon';

type AssetButtonProps = ButtonProps & {
    symbol: string;
    address?: string;
    amount: number;
    currencyValue: number;
    currentCurrency: CURRENCY;
    isDisabled?: boolean;
    onClick?: () => void;
};

export const AssetButton = ({
    symbol,
    address,
    amount,
    currencyValue,
    currentCurrency,
    isDisabled,
    onClick,
    ...buttonProps
}: AssetButtonProps) => {
    const { darkMode: isDark } = useVeChainKitConfig();

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
                <TokenIcon address={address} symbol={symbol} size={24} />
                <Text>{symbol}</Text>
            </HStack>
            <VStack align="flex-end" spacing={0}>
                <Text>
                    {amount.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                    })}{' '}
                </Text>
                <Text
                    fontSize="sm"
                    color={isDark ? 'whiteAlpha.600' : 'blackAlpha.600'}
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
