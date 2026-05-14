import {
    Heading,
    HStack,
    Icon,
    IconButton,
    Text,
    VStack,
} from '@chakra-ui/react';
import {
    LuArrowLeftRight,
    LuArrowUpFromLine,
    LuHistory,
} from 'react-icons/lu';
import { useTranslation } from 'react-i18next';
import {
    LocalStorageKey,
    useCurrency,
    useLocalStorage,
    usePortfolioPriceHistory24h,
    useTotalBalance,
    useWallet,
} from '@/hooks';
import { PriceChangeBadge, PriceChart } from '@/components/common';
import {
    formatCompactCurrency,
    SupportedCurrency,
} from '@/utils/currencyUtils';

type Props = {
    onSend: () => void;
    onSwap: () => void;
    onHistory: () => void;
    hideHistory?: boolean;
};

const ActionButton = ({
    icon,
    label,
    onClick,
    isDisabled,
}: {
    icon: React.ElementType;
    label: string;
    onClick: () => void;
    isDisabled?: boolean;
}) => {
    const { t } = useTranslation();
    const translatedLabel = t(label, label);
    return (
        <IconButton
            variant="vechainKitSecondary"
            h="44px"
            flex={1}
            borderRadius="lg"
            aria-label={translatedLabel}
            isDisabled={isDisabled}
            onClick={onClick}
            icon={
                <HStack spacing={1.5}>
                    <Icon as={icon} boxSize={3.5} opacity={0.85} />
                    <Text fontSize="sm" fontWeight="600">
                        {translatedLabel}
                    </Text>
                </HStack>
            }
        />
    );
};

export const AssetsHeader = ({
    onSend,
    onSwap,
    onHistory,
    hideHistory,
}: Props) => {
    const { account } = useWallet();
    const {
        formattedBalance,
        hasAnyBalance,
        isLoading,
        priceChange24hPct,
    } = useTotalBalance({
        address: account?.address ?? '',
    });
    const { points: chartPoints } = usePortfolioPriceHistory24h(
        account?.address,
    );
    const { currentCurrency } = useCurrency();
    const chartTone: 'up' | 'down' | 'neutral' =
        typeof priceChange24hPct === 'number'
            ? priceChange24hPct > 0
                ? 'up'
                : priceChange24hPct < 0
                ? 'down'
                : 'neutral'
            : 'neutral';
    const [showAssets] = useLocalStorage(LocalStorageKey.SHOW_ASSETS, true);

    return (
        <VStack w="full" spacing={4} align="stretch">
            <HStack spacing={3} align="baseline">
                <Heading size="2xl" fontWeight="700">
                    {isLoading
                        ? '...'
                        : showAssets
                        ? formattedBalance
                        : '$****'}
                </Heading>
                {showAssets && (
                    <PriceChangeBadge
                        valuePct={priceChange24hPct}
                        showSuffix
                        fontSize="sm"
                    />
                )}
            </HStack>

            {showAssets && chartPoints.length > 1 && (
                <PriceChart
                    points={chartPoints}
                    tone={chartTone}
                    chartHeight={72}
                    interactive
                    formatValue={(v) =>
                        formatCompactCurrency(v, {
                            currency: currentCurrency as SupportedCurrency,
                        })
                    }
                />
            )}

            <HStack spacing={2} w="full">
                <ActionButton
                    icon={LuArrowLeftRight}
                    label="Swap"
                    onClick={onSwap}
                    isDisabled={!hasAnyBalance}
                />
                <ActionButton
                    icon={LuArrowUpFromLine}
                    label="Send"
                    onClick={onSend}
                    isDisabled={!hasAnyBalance}
                />
                {!hideHistory && (
                    <ActionButton
                        icon={LuHistory}
                        label="History"
                        onClick={onHistory}
                    />
                )}
            </HStack>
        </VStack>
    );
};
