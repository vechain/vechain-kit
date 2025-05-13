import { useMemo } from 'react';
import { useTokensWithValues } from './useTokensWithValues';
import {
    SupportedCurrency,
    formatCompactCurrency,
} from '@/utils/currencyUtils';
import { useCurrency } from './useCurrency';

type UseTotalBalanceProps = {
    address?: string;
};

export const useTotalBalance = ({ address = '' }: UseTotalBalanceProps) => {
    const { tokensWithBalance, isLoading } = useTokensWithValues({ address });
    const { currentCurrency } = useCurrency();

    const totalBalanceInCurrency = useMemo(() => {
        return tokensWithBalance.reduce(
            (total, token) => total + token.valueInCurrency,
            0,
        );
    }, [tokensWithBalance]);

    const totalBalanceUsd = useMemo(() => {
        return tokensWithBalance.reduce(
            (total, token) => total + token.valueUsd,
            0,
        );
    }, [tokensWithBalance]);

    const formattedBalance = useMemo(() => {
        return formatCompactCurrency(
            totalBalanceInCurrency,
            currentCurrency as SupportedCurrency,
        );
    }, [totalBalanceInCurrency, currentCurrency]);

    return {
        totalBalanceInCurrency,
        totalBalanceUsd,
        formattedBalance,
        isLoading,
        hasAnyBalance: tokensWithBalance.length > 0,
    };
};
