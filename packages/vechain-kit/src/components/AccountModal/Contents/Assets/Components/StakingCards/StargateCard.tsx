import { Tag, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useStargatePositions, useWallet } from '@/hooks';
import { TOKEN_LOGOS } from '@/utils/constants';
import { StakingCard, StakingRow } from './StakingCard';

const STARGATE_LOGO = 'https://app.stargate.vechain.org/favicon.ico';
const STARGATE_URL = 'https://app.stargate.vechain.org/';

export const StargateCard = () => {
    const { t } = useTranslation();
    const { account } = useWallet();
    const { positions, totalValueInCurrency, isLoading } = useStargatePositions(
        account?.address,
    );

    if (isLoading || !positions.length) return null;

    const anyDelegated = positions.some((p) => p.isDelegated);

    return (
        <StakingCard
            name="StarGate"
            logoSrc={STARGATE_LOGO}
            totalValueInCurrency={totalValueInCurrency}
            tag={anyDelegated ? t('Delegating') : t('Staked')}
            platformUrl={STARGATE_URL}
        >
            {positions.map((p) => (
                <StakingRow
                    key={p.tokenId}
                    label={t('Supplied')}
                    amount={`${p.vetAmountFormatted.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                    })} VET`}
                    valueInCurrency={p.valueInCurrency}
                    iconSrc={TOKEN_LOGOS['VET']}
                    rightLabel={
                        p.isDelegated ? (
                            <Tag size="sm" colorScheme="green" borderRadius="md">
                                {t('Delegated')}
                            </Tag>
                        ) : (
                            <Text fontSize="xs" opacity={0.6}>
                                {t('Not delegated')}
                            </Text>
                        )
                    }
                />
            ))}
        </StakingCard>
    );
};
