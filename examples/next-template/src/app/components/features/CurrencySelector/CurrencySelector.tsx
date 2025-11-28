'use client';

import { Box, Heading, VStack, Text, Select } from '@chakra-ui/react';
import { useCurrentCurrency, CURRENCY, CURRENCY_SYMBOLS } from '@vechain/vechain-kit';
import { useTranslation } from 'react-i18next';

const allCurrencies: CURRENCY[] = ['usd', 'eur', 'gbp'];

export function CurrencySelector() {
    const { t } = useTranslation();
    const { currentCurrency, setCurrency } = useCurrentCurrency();

    return (
        <Box>
            <Heading size={'md'}>
                <b>Currency Selection</b> (Bidirectional Sync)
            </Heading>
            <VStack mt={4} spacing={4} alignItems="flex-start">
                <Text>
                    Current currency: {CURRENCY_SYMBOLS[currentCurrency]} {currentCurrency.toUpperCase()}
                </Text>
                <Text fontSize="sm" color="gray.500">
                    Change currency here and it will sync to VeChainKit settings.
                    Changes in VeChainKit settings will also sync here.
                </Text>
                <Select
                    borderRadius={'md'}
                    size="sm"
                    width="auto"
                    value={currentCurrency}
                    onChange={(e) => setCurrency(e.target.value as CURRENCY)}
                    data-testid="select-currency"
                >
                    {allCurrencies.map((currency) => (
                        <option key={currency} value={currency}>
                            {CURRENCY_SYMBOLS[currency]} {currency.toUpperCase()}
                        </option>
                    ))}
                </Select>
            </VStack>
        </Box>
    );
}

