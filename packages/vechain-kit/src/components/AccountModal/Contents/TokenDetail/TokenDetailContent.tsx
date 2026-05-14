import {
    Container,
    HStack,
    Heading,
    Icon,
    IconButton,
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    Text,
    VStack,
    useToken,
} from '@chakra-ui/react';
import {
    LuArrowDownToLine,
    LuArrowLeftRight,
    LuArrowUpFromLine,
} from 'react-icons/lu';
import { useTranslation } from 'react-i18next';
import {
    ModalBackButton,
    PriceChangeBadge,
    PriceChart,
    StickyHeaderContainer,
} from '@/components/common';
import { useAccountModalOptions } from '@/hooks/modals/useAccountModalOptions';
import {
    TokenWithValue,
    useCurrency,
    useTokenPriceHistory24h,
} from '@/hooks';
import { SupportedToken } from '@/hooks/api/wallet/useGetTokenUsdPrice';
import {
    formatCompactCurrency,
    SupportedCurrency,
} from '@/utils/currencyUtils';
import { NON_TRANSFERABLE_TOKEN_SYMBOLS } from '@/utils';
import { AccountModalContentTypes } from '../../Types';
import { TokenHistoryPreview } from './Components/TokenHistoryPreview';

export type TokenDetailContentProps = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    token: TokenWithValue;
};

const VET_SENTINEL = '0x';

const ActionIconButton = ({
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

export const TokenDetailContent = ({
    setCurrentContent,
    token,
}: TokenDetailContentProps) => {
    const { isolatedView } = useAccountModalOptions();
    const { currentCurrency } = useCurrency();
    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');

    const isNonTransferable = NON_TRANSFERABLE_TOKEN_SYMBOLS.includes(
        token.symbol,
    );

    const amountNumber = Number(token.balance);
    const balanceText = amountNumber.toLocaleString(undefined, {
        maximumFractionDigits: 4,
    });

    // Sparkline: VVET / VOT3 / veDelegate piggy-back on VET / B3TR / B3TR.
    const sparklineToken: SupportedToken | undefined = (() => {
        switch (token.symbol) {
            case 'VET':
            case 'VVET':
                return 'VET';
            case 'VTHO':
                return 'VTHO';
            case 'B3TR':
            case 'VOT3':
            case 'veDelegate':
                return 'B3TR';
            default:
                return undefined;
        }
    })();
    const { points: sparklinePoints } = useTokenPriceHistory24h(sparklineToken);
    const sparkTone: 'up' | 'down' | 'neutral' =
        typeof token.priceChange24hPct === 'number'
            ? token.priceChange24hPct > 0
                ? 'up'
                : token.priceChange24hPct < 0
                ? 'down'
                : 'neutral'
            : 'neutral';

    const backToDetail = () =>
        setCurrentContent({
            type: 'token-detail',
            props: { setCurrentContent, token },
        });

    const handleSwap = () => {
        setCurrentContent({
            type: 'swap-token',
            props: {
                setCurrentContent,
                fromTokenAddress:
                    token.address && token.address !== VET_SENTINEL
                        ? token.address
                        : undefined,
                onBack: backToDetail,
            },
        });
    };

    const handleReceive = () => {
        setCurrentContent({
            type: 'receive-token',
            props: { setCurrentContent, onBack: backToDetail },
        });
    };

    const handleSend = () => {
        setCurrentContent({
            type: 'send-token',
            props: {
                setCurrentContent,
                preselectedToken: token,
                onBack: backToDetail,
            },
        });
    };

    const handleHistoryItem = (item: import('@/hooks').TransferHistoryItem) => {
        setCurrentContent({
            type: 'transaction-detail',
            props: {
                setCurrentContent,
                item,
                onBack: backToDetail,
            },
        });
    };

    const handleSeeAll = () => {
        setCurrentContent({
            type: 'transaction-history',
            props: {
                setCurrentContent,
                tokenFilter: {
                    address: token.address || VET_SENTINEL,
                    symbol: token.symbol,
                },
                onBack: backToDetail,
            },
        });
    };

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader>{token.symbol}</ModalHeader>
                {!isolatedView && (
                    <ModalBackButton
                        onClick={() => setCurrentContent('assets')}
                    />
                )}
                <ModalCloseButton />
            </StickyHeaderContainer>

            <Container h={['540px', 'auto']} p={0}>
                <ModalBody>
                    <VStack spacing={6} align="stretch" w="full">
                        <VStack spacing={1} align="flex-start">
                            <Heading size="2xl" fontWeight="700">
                                {balanceText}
                            </Heading>
                            <HStack spacing={2} align="center">
                                <Text color={textSecondary}>
                                    ={' '}
                                    {formatCompactCurrency(
                                        token.valueInCurrency,
                                        {
                                            currency:
                                                currentCurrency as SupportedCurrency,
                                        },
                                    )}
                                </Text>
                                <PriceChangeBadge
                                    valuePct={token.priceChange24hPct}
                                />
                            </HStack>
                        </VStack>

                        {sparklinePoints.length > 1 && (
                            <PriceChart
                                points={sparklinePoints}
                                tone={sparkTone}
                                chartHeight={72}
                            />
                        )}

                        <HStack spacing={2} w="full">
                            <ActionIconButton
                                icon={LuArrowLeftRight}
                                label="Swap"
                                onClick={handleSwap}
                                isDisabled={isNonTransferable}
                            />
                            <ActionIconButton
                                icon={LuArrowUpFromLine}
                                label="Send"
                                onClick={handleSend}
                                isDisabled={
                                    isNonTransferable || amountNumber <= 0
                                }
                            />
                            <ActionIconButton
                                icon={LuArrowDownToLine}
                                label="Receive"
                                onClick={handleReceive}
                            />
                        </HStack>

                        <TokenHistoryPreview
                            tokenAddress={token.address || VET_SENTINEL}
                            onItemClick={handleHistoryItem}
                            onSeeAll={handleSeeAll}
                        />
                    </VStack>
                </ModalBody>
            </Container>
        </>
    );
};
