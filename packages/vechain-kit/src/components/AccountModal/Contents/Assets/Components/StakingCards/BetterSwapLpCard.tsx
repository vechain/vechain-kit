import { useTranslation } from 'react-i18next';
import { useBetterSwapLpPositions, useWallet } from '@/hooks';
import { BetterSwapLogo } from '@/assets/icons/BetterSwapLogo';
import { StakingCard, StakingRow } from './StakingCard';

const BETTERSWAP_URL = 'https://www.betterswap.io/';

export const BetterSwapLpCard = () => {
    const { t } = useTranslation();
    const { account } = useWallet();
    const { positions, totalValueInCurrency, isLoading } =
        useBetterSwapLpPositions(account?.address);

    if (isLoading || !positions.length) return null;

    return (
        <StakingCard
            name="BetterSwap"
            logoFallback={<BetterSwapLogo boxSize="24px" />}
            totalValueInCurrency={totalValueInCurrency}
            tag={t('Liquidity')}
            platformUrl={BETTERSWAP_URL}
        >
            {positions.map((p) => {
                const pairLabel = `${p.token0.symbol || '?'} / ${
                    p.token1.symbol || '?'
                }`;
                const amount = `${p.lpBalance.toLocaleString(undefined, {
                    maximumFractionDigits: 4,
                })} LP`;
                return (
                    <StakingRow
                        key={p.pairAddress}
                        label={pairLabel}
                        amount={amount}
                        valueInCurrency={p.valueInCurrency}
                    />
                );
            })}
        </StakingCard>
    );
};
