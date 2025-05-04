import { useMemo } from 'react';
import { useTokenBalances, TokenBalance } from './useTokenBalances';
import { useTokenPrices } from './useTokenPrices';
import {
    SupportedCurrency,
    convertToSelectedCurrency,
} from '@/utils/currencyConverter';
import { useCurrency } from './useCurrency';

export type TokenWithValue = TokenBalance & {
    priceUsd: number;
    valueUsd: number;
    valueInCurrency: number;
};

type UseTokensWithValuesProps = {
    address?: string;
};

export const useTokensWithValues = ({
    address = '',
}: UseTokensWithValuesProps) => {
    const { balances, isLoading: balancesLoading } = useTokenBalances({
        address,
    });
    const {
        prices,
        exchangeRates,
        isLoading: pricesLoading,
    } = useTokenPrices();
    const { currentCurrency } = useCurrency();

    const tokensWithValues = useMemo(() => {
        return balances.map((token) => {
            const priceUsd = prices[token.address] || 0;
            const valueUsd = Number(token.balance) * priceUsd;
            const valueInCurrency = convertToSelectedCurrency(
                valueUsd,
                currentCurrency as SupportedCurrency,
                exchangeRates,
            );

            return {
                ...token,
                priceUsd,
                valueUsd,
                valueInCurrency,
            };
        });
    }, [balances, prices, currentCurrency, exchangeRates]);

    // Get sorted tokens (by value)
    const sortedTokens = useMemo(() => {
        return [...tokensWithValues].sort(
            (a, b) => b.valueInCurrency - a.valueInCurrency,
        );
    }, [tokensWithValues]);

    // Get tokens with positive balances
    const tokensWithBalance = useMemo(() => {
        return sortedTokens.filter((token) => Number(token.balance) > 0);
    }, [sortedTokens]);

    const isLoading = balancesLoading || pricesLoading;

    return {
        tokens: tokensWithValues,
        sortedTokens,
        tokensWithBalance,
        isLoading,
    };
};
