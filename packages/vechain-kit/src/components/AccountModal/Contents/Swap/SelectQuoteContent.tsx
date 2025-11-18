import {
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    VStack,
    HStack,
    Text,
    Container,
    Box,
    Badge,
    Collapse,
    Icon,
    Image,
    Tooltip,
    ModalFooter,
} from '@chakra-ui/react';
import { ModalBackButton, StickyHeaderContainer } from '@/components/common';
import { SwapQuote } from '@/types/swap';
import { useTranslation } from 'react-i18next';
import { useVeChainKitConfig } from '@/providers';
import { formatEther } from 'viem';
import { LuChevronDown, LuChevronUp } from 'react-icons/lu';
import { formatCompactCurrency, SupportedCurrency, convertToSelectedCurrency } from '@/utils/currencyUtils';
import { useCurrency, useTokensWithValues, useWallet } from '@/hooks';
import { useTokenPrices } from '@/hooks';
import { useState, useMemo } from 'react';
import { TOKEN_LOGO_COMPONENTS, TOKEN_LOGOS, compareAddresses } from '@/utils';
import React from 'react';

type Props = {
    quotes: SwapQuote[];
    selectedQuote: SwapQuote | null;
    toTokenAddress: string | null;
    onSelectQuote: (quote: SwapQuote) => void;
    onBack: () => void;
};

export const SelectQuoteContent = ({
    quotes,
    selectedQuote,
    toTokenAddress,
    onSelectQuote,
    onBack,
}: Props) => {
    const { t } = useTranslation();
    const { darkMode: isDark } = useVeChainKitConfig();
    const { currentCurrency } = useCurrency();
    const { account } = useWallet();
    const { exchangeRates, prices } = useTokenPrices();
    const { tokens } = useTokensWithValues({ address: account?.address ?? '' });
    const [showUnavailable, setShowUnavailable] = useState(false);

    // Get toToken symbol from address
    const toToken = useMemo(() => {
        if (!toTokenAddress) return null;
        // Use compareAddresses for proper address comparison
        return tokens.find(t => compareAddresses(t.address, toTokenAddress)) || null;
    }, [toTokenAddress, tokens]);


    // Separate available and unavailable quotes
    const availableQuotes = quotes.filter(q => !q.reverted);
    const unavailableQuotes = quotes.filter(q => q.reverted);

    // Find the best quote (highest output amount among available)
    const bestQuote = useMemo(() => {
        if (availableQuotes.length === 0) return null;
        return availableQuotes.reduce((best, current) => {
            const bestOutput = BigInt(best.outputAmount || '0');
            const currentOutput = BigInt(current.outputAmount || '0');
            return currentOutput > bestOutput ? current : best;
        });
    }, [availableQuotes]);

    // Calculate USD value for each quote
    const quotesWithValues = useMemo(() => {
        const toTokenPriceUsd = toTokenAddress ? (prices[toTokenAddress] || 0) : 0;

        return availableQuotes.map((quote) => {
            const outputAmountFormatted = formatEther(BigInt(quote.outputAmount || '0'));
            const valueUsd = Number(outputAmountFormatted) * toTokenPriceUsd;
            const valueInCurrency = convertToSelectedCurrency(
                valueUsd,
                currentCurrency as SupportedCurrency,
                exchangeRates,
            );
            const isBest = bestQuote && quote.aggregatorName === bestQuote.aggregatorName;

            // Calculate percentage difference from best
            let percentageDiff = 0;
            if (bestQuote && !isBest) {
                const bestOutput = BigInt(bestQuote.outputAmount || '0');
                const currentOutput = BigInt(quote.outputAmount || '0');
                const diff = Number(currentOutput - bestOutput);
                percentageDiff = (diff / Number(bestOutput)) * 100;
            }

            return {
                ...quote,
                outputAmountFormatted,
                valueUsd,
                valueInCurrency,
                isBest,
                percentageDiff,
            };
        }).sort((a, b) => {
            // Sort by output amount (descending)
            const aOutput = BigInt(a.outputAmount || '0');
            const bOutput = BigInt(b.outputAmount || '0');
            return Number(bOutput - aOutput);
        });
    }, [availableQuotes, toTokenAddress, prices, currentCurrency, exchangeRates, bestQuote]);

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader>{t('Found following rates')}</ModalHeader>
                <ModalBackButton onClick={onBack} />
                <ModalCloseButton />
            </StickyHeaderContainer>

            <Container h={['540px', 'auto']} p={0}>
                <ModalBody>
                    <VStack spacing={6} align="stretch">
                        {/* Available Quotes */}
                        {quotesWithValues.length > 0 && (
                            <VStack spacing={2} align="stretch">
                                {quotesWithValues.map((quoteWithValue) => {
                                    const isSelected = selectedQuote?.aggregatorName === quoteWithValue.aggregatorName;

                                    return (
                                        <Box
                                            key={quoteWithValue.aggregatorName}
                                            p={2.5}
                                            borderRadius="xl"
                                            bg={isDark ? '#00000038' : 'gray.50'}
                                            borderWidth={1}
                                            borderColor={
                                                isSelected
                                                    ? 'blue.500'
                                                    : isDark
                                                        ? 'whiteAlpha.200'
                                                        : 'gray.200'
                                            }
                                            cursor="pointer"
                                            onClick={() => onSelectQuote(quoteWithValue)}
                                            _hover={{
                                                borderColor: isSelected ? 'blue.500' : (isDark ? 'whiteAlpha.400' : 'gray.300'),
                                            }}
                                            position="relative"
                                        >
                                            {/* Badge tag on top left */}
                                            {(quoteWithValue.isBest || (!quoteWithValue.isBest && quoteWithValue.percentageDiff < 0)) && (
                                                <Box position="absolute" top={-1} left={0} zIndex={1}>
                                                    {quoteWithValue.isBest ? (
                                                        <Badge
                                                            colorScheme="purple"
                                                            borderRadius="sm"
                                                            fontSize="2xs"
                                                            px={1.5}
                                                            py={0.5}
                                                            borderTopLeftRadius="xl"
                                                            borderBottomRightRadius="md"
                                                        >
                                                            {t('Best')}
                                                        </Badge>
                                                    ) : (
                                                        <Badge
                                                            colorScheme="red"
                                                            borderRadius="xs"
                                                            fontSize="2xs"
                                                            px={1.5}
                                                            py={0.5}
                                                            borderTopLeftRadius="xl"
                                                            borderBottomRightRadius="md"
                                                        >
                                                            {quoteWithValue.percentageDiff.toFixed(2)}%
                                                        </Badge>
                                                    )}
                                                </Box>
                                            )}

                                            <VStack align="stretch" spacing={1.5} marginTop={4}>
                                                {/* Aggregator name/icon and token amount in same line */}
                                                <HStack justify="space-between" align="center">
                                                    <HStack spacing={1.5} align="center">
                                                        {quoteWithValue.aggregator.getIcon('20px')}
                                                        <Text
                                                            fontSize="md"
                                                            fontWeight="bold"
                                                        >
                                                            {quoteWithValue.aggregatorName}
                                                        </Text>
                                                    </HStack>
                                                    <HStack align="center" spacing={1.5}>
                                                        {toToken && (
                                                            <>
                                                                {TOKEN_LOGO_COMPONENTS[toToken.symbol] ? (
                                                                    React.cloneElement(
                                                                        TOKEN_LOGO_COMPONENTS[toToken.symbol],
                                                                        {
                                                                            boxSize: '24px',
                                                                            borderRadius: 'full',
                                                                        }
                                                                    )
                                                                ) : TOKEN_LOGOS[toToken.symbol] ? (
                                                                    <Image
                                                                        src={TOKEN_LOGOS[toToken.symbol]}
                                                                        alt={`${toToken.symbol} logo`}
                                                                        boxSize="24px"
                                                                        borderRadius="full"
                                                                    />
                                                                ) : null}
                                                                <Tooltip
                                                                    label={Number(quoteWithValue.outputAmountFormatted).toLocaleString(undefined, { maximumFractionDigits: 18 })}
                                                                    hasArrow
                                                                    placement="top"
                                                                >
                                                                    <Text
                                                                        fontSize="md"
                                                                        fontWeight="bold"
                                                                        textAlign="right"
                                                                        whiteSpace="nowrap"
                                                                    >
                                                                        {Number(quoteWithValue.outputAmountFormatted).toLocaleString(undefined, {
                                                                            minimumFractionDigits: 4,
                                                                        })}
                                                                        {' '}{toToken.symbol}
                                                                    </Text>
                                                                </Tooltip>
                                                            </>
                                                        )}
                                                    </HStack>
                                                </HStack>

                                                {/* Gas and fiat value in same line underneath */}
                                                <HStack justify="space-between" align="center">
                                                    <Text
                                                        fontSize="xs"
                                                        color={isDark ? 'whiteAlpha.500' : 'blackAlpha.500'}
                                                    >
                                                        {quoteWithValue.gasCostVTHO && quoteWithValue.gasCostVTHO > 0
                                                            ? `Gas: ${quoteWithValue.gasCostVTHO.toLocaleString(undefined, {
                                                                maximumFractionDigits: 2,
                                                            })} VTHO`
                                                            : ''}
                                                    </Text>
                                                    {quoteWithValue.valueUsd > 0 && (
                                                        <Text
                                                            fontSize="xs"
                                                            color={isDark ? 'whiteAlpha.600' : 'blackAlpha.600'}
                                                            textAlign="right"
                                                            whiteSpace="nowrap"
                                                        >
                                                            ≈ {formatCompactCurrency(
                                                                quoteWithValue.valueInCurrency,
                                                                { currency: currentCurrency as SupportedCurrency },
                                                            )}
                                                        </Text>
                                                    )}
                                                </HStack>
                                            </VStack>
                                        </Box>
                                    );
                                })}
                            </VStack>
                        )}

                        {/* Unavailable Quotes */}
                        {unavailableQuotes.length > 0 && (
                            <Box>
                                <HStack
                                    justify="space-between"
                                    cursor="pointer"
                                    onClick={() => setShowUnavailable(!showUnavailable)}
                                    py={2}
                                >
                                    <Text
                                        fontSize="sm"
                                        color={isDark ? 'whiteAlpha.600' : 'blackAlpha.600'}
                                    >
                                        {unavailableQuotes.length} {t('rate')}{unavailableQuotes.length !== 1 ? 's' : ''} {t('unavailable')}
                                    </Text>
                                    <Icon
                                        as={showUnavailable ? LuChevronUp : LuChevronDown}
                                        boxSize={4}
                                        color={isDark ? 'whiteAlpha.600' : 'blackAlpha.600'}
                                    />
                                </HStack>
                                <Collapse in={showUnavailable} animateOpacity>
                                    <VStack spacing={2} align="stretch" pt={2}>
                                        {unavailableQuotes.map((quote) => (
                                            <Box
                                                key={quote.aggregatorName}
                                                p={2}
                                                borderRadius="xl"
                                                bg={isDark ? '#00000038' : 'gray.50'}
                                                opacity={0.6}
                                            >
                                                <HStack justify="space-between">
                                                    <HStack spacing={2} align="center">
                                                        {quote.aggregator.getIcon('20px')}
                                                        <Text
                                                            fontSize="md"
                                                            fontWeight="medium"
                                                        >
                                                            {quote.aggregatorName}
                                                        </Text>
                                                    </HStack>
                                                    <Text
                                                        fontSize="xs"
                                                        color={isDark ? 'whiteAlpha.500' : 'blackAlpha.500'}
                                                    >
                                                        {t('Unable to fetch the price')}
                                                    </Text>
                                                </HStack>
                                            </Box>
                                        ))}
                                    </VStack>
                                </Collapse>
                            </Box>
                        )}

                        {quotesWithValues.length === 0 && unavailableQuotes.length === 0 && (
                            <VStack
                                spacing={2}
                                py={8}
                                color={isDark ? 'whiteAlpha.600' : 'blackAlpha.600'}
                            >
                                <Text fontSize="lg">
                                    {t('No quotes available')}
                                </Text>
                            </VStack>
                        )}
                    </VStack>
                </ModalBody>
            </Container>
            <ModalFooter />
        </>
    );
};

