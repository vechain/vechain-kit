import { Box, HStack, Tag, Text, useToken } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import {
    useCurrency,
    useJuicyPosition,
    useWallet,
} from '@/hooks';
import { TOKEN_LOGOS } from '@/utils/constants';
import {
    formatCompactCurrency,
    SupportedCurrency,
} from '@/utils/currencyUtils';
import { StakingCard, StakingRow } from './StakingCard';

const JUICY_URL = 'https://www.juicyfinance.io/';
const JUICY_LOGO = 'https://www.juicyfinance.io/logo192.png';

const formatHealth = (hf: number | null) => {
    if (hf == null) return null;
    if (!Number.isFinite(hf)) return null;
    if (hf >= 1000) return `${Math.round(hf)}`;
    return hf.toFixed(2);
};

const healthTone = (hf: number | null) => {
    if (hf == null) return undefined;
    if (hf < 1.1) return 'red';
    if (hf < 1.5) return 'orange';
    return 'green';
};

export const JuicyFinanceCard = () => {
    const { t } = useTranslation();
    const { account } = useWallet();
    const { currentCurrency } = useCurrency();
    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');
    const {
        supplied,
        borrowed,
        totalSuppliedInCurrency,
        totalBorrowedInCurrency,
        healthFactor,
        netValueInCurrency,
        hasPosition,
        isLoading,
    } = useJuicyPosition(account?.address);

    if (isLoading || !hasPosition) return null;

    const tagLabel = borrowed.length ? t('Borrowing') : t('Lending');
    const healthLabel = formatHealth(healthFactor);
    const healthScheme = healthTone(healthFactor);

    return (
        <StakingCard
            name="Juicy Finance"
            logoSrc={JUICY_LOGO}
            totalValueInCurrency={netValueInCurrency}
            tag={tagLabel}
            platformUrl={JUICY_URL}
        >
            {healthLabel && (
                <HStack
                    w="full"
                    justify="space-between"
                    align="center"
                    px={1}
                >
                    <Text fontSize="xs" color={textSecondary}>
                        {t('Health rate')}
                    </Text>
                    <Tag
                        size="sm"
                        colorScheme={healthScheme}
                        borderRadius="md"
                    >
                        {healthLabel}
                    </Tag>
                </HStack>
            )}

            {supplied.length > 0 && (
                <Box w="full">
                    <HStack
                        w="full"
                        justify="space-between"
                        align="center"
                        px={1}
                        mb={1}
                    >
                        <Text fontSize="xs" color={textSecondary}>
                            {t('Supplied')}
                        </Text>
                        <Text fontSize="xs" color={textSecondary}>
                            {formatCompactCurrency(totalSuppliedInCurrency, {
                                currency:
                                    currentCurrency as SupportedCurrency,
                            })}
                        </Text>
                    </HStack>
                    {supplied.map((p) => (
                        <StakingRow
                            key={`s-${p.asset}`}
                            label={p.symbol}
                            amount={`${p.amount.toLocaleString(undefined, {
                                maximumFractionDigits: 4,
                            })} ${p.symbol}`}
                            valueInCurrency={p.valueInCurrency}
                            iconSrc={TOKEN_LOGOS[p.symbol]}
                        />
                    ))}
                </Box>
            )}

            {borrowed.length > 0 && (
                <Box w="full">
                    <HStack
                        w="full"
                        justify="space-between"
                        align="center"
                        px={1}
                        mb={1}
                        mt={2}
                    >
                        <Text fontSize="xs" color={textSecondary}>
                            {t('Borrowed')}
                        </Text>
                        <Text fontSize="xs" color={textSecondary}>
                            {formatCompactCurrency(
                                totalBorrowedInCurrency,
                                {
                                    currency:
                                        currentCurrency as SupportedCurrency,
                                },
                            )}
                        </Text>
                    </HStack>
                    {borrowed.map((p) => (
                        <StakingRow
                            key={`b-${p.asset}`}
                            label={p.symbol}
                            amount={`${p.amount.toLocaleString(undefined, {
                                maximumFractionDigits: 4,
                            })} ${p.symbol}`}
                            valueInCurrency={p.valueInCurrency}
                            iconSrc={TOKEN_LOGOS[p.symbol]}
                        />
                    ))}
                </Box>
            )}
        </StakingCard>
    );
};
