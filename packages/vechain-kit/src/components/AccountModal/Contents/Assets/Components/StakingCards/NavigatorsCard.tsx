import { useTranslation } from 'react-i18next';
import { useNavigatorPosition, useWallet } from '@/hooks';
import { TOKEN_LOGOS } from '@/utils/constants';
import { humanAddress } from '@/utils/formattingUtils';
import { StakingCard, StakingRow } from './StakingCard';

const VEBETTERDAO_URL = 'https://governance.vebetterdao.org';

export const NavigatorsCard = () => {
    const { t } = useTranslation();
    const { account } = useWallet();
    const {
        isNavigator,
        isDelegated,
        stakedB3TR,
        delegatedAmount,
        navigatorAddress,
        totalValueInCurrency,
        isLoading,
    } = useNavigatorPosition(account?.address);

    if (isLoading) return null;
    if (!isNavigator && !isDelegated) return null;

    return (
        <StakingCard
            name="Navigators"
            logoSrc={TOKEN_LOGOS['B3TR']}
            totalValueInCurrency={totalValueInCurrency}
            tag={isNavigator ? t('Navigator') : t('Delegating')}
            platformUrl={VEBETTERDAO_URL}
        >
            {isNavigator && (
                <StakingRow
                    label={t('Staked B3TR')}
                    amount={`${stakedB3TR.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                    })} B3TR`}
                    valueInCurrency={totalValueInCurrency * (
                        (stakedB3TR + delegatedAmount) > 0
                            ? stakedB3TR / (stakedB3TR + delegatedAmount)
                            : 1
                    )}
                    iconSrc={TOKEN_LOGOS['B3TR']}
                />
            )}
            {isDelegated && (
                <StakingRow
                    label={t('Delegated to {{name}}', {
                        name: navigatorAddress
                            ? humanAddress(navigatorAddress, 4, 4)
                            : t('navigator'),
                    })}
                    amount={`${delegatedAmount.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                    })} B3TR`}
                    valueInCurrency={totalValueInCurrency * (
                        (stakedB3TR + delegatedAmount) > 0
                            ? delegatedAmount / (stakedB3TR + delegatedAmount)
                            : 1
                    )}
                    iconSrc={TOKEN_LOGOS['B3TR']}
                />
            )}
        </StakingCard>
    );
};
