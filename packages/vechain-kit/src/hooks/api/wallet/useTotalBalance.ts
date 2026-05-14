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
        formattedBalance,
        isLoading,
        hasAnyBalance,
    };
};
