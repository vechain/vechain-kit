import { useMemo } from 'react';
import { useTokensWithValues } from './useTokensWithValues';
import {
    SupportedCurrency,
    formatCompactCurrency,
} from '@/utils/currencyUtils';
import { useCurrency } from '../../utils/useCurrency';
import { useStargatePositions } from '../staking/useStargatePositions';
import { useNavigatorPosition } from '../staking/useNavigatorPosition';
import { useBetterSwapLpPositions } from '../staking/useBetterSwapLpPositions';

type UseTotalBalanceProps = {
    address?: string;
};

export const useTotalBalance = ({ address = '' }: UseTotalBalanceProps) => {
    const { tokensWithBalance, isLoading: tokensLoading } = useTokensWithValues(
        { address },
    );
    const { currentCurrency } = useCurrency();

    const stargate = useStargatePositions(address);
    const navigator = useNavigatorPosition(address);
    const lp = useBetterSwapLpPositions(address);

    const liquidBalanceInCurrency = useMemo(
        () =>
            tokensWithBalance.reduce(
                (total, token) => total + token.valueInCurrency,
                0,
            ),
        [tokensWithBalance],
    );

    const liquidBalanceUsd = useMemo(
        () =>
            tokensWithBalance.reduce(
                (total, token) => total + token.valueUsd,
                0,
            ),
        [tokensWithBalance],
    );

    // Weighted 24h change across liquid holdings with a known change.
    // Staking positions inherit the same per-token change (Stargate ~ VET,
    // Navigators ~ B3TR, BetterSwap LP averaged via its underlying pair).
    const priceChange24hPct = useMemo(() => {
        let valueWeighted = 0;
        let valueCovered = 0;
        for (const token of tokensWithBalance) {
            if (typeof token.priceChange24hPct !== 'number') continue;
            valueWeighted += token.valueUsd * token.priceChange24hPct;
            valueCovered += token.valueUsd;
        }
        if (valueCovered === 0) return undefined;
        return valueWeighted / valueCovered;
    }, [tokensWithBalance]);

    const stakingInCurrency =
        stargate.totalValueInCurrency +
        navigator.totalValueInCurrency +
        lp.totalValueInCurrency;
    const stakingUsd =
        stargate.totalValueUsd + navigator.totalValueUsd + lp.totalValueUsd;

    const totalBalanceInCurrency = liquidBalanceInCurrency + stakingInCurrency;
    const totalBalanceUsd = liquidBalanceUsd + stakingUsd;

    const formattedBalance = useMemo(
        () =>
            formatCompactCurrency(totalBalanceInCurrency, {
                currency: currentCurrency as SupportedCurrency,
            }),
        [totalBalanceInCurrency, currentCurrency],
    );

    const isLoading =
        tokensLoading ||
        stargate.isLoading ||
        navigator.isLoading ||
        lp.isLoading;

    const hasAnyBalance = tokensWithBalance.length > 0 || stakingUsd > 0;

    return {
        totalBalanceInCurrency,
        totalBalanceUsd,
        liquidBalanceInCurrency,
        liquidBalanceUsd,
        stakingInCurrency,
        stakingUsd,
        priceChange24hPct,
        formattedBalance,
        isLoading,
        hasAnyBalance,
    };
};
