import React, { useState, useMemo, useCallback } from 'react';
import {
    Container,
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    VStack,
    HStack,
    Text,
    ModalFooter,
    Button,
    Icon,
    Box,
    Input,
    InputGroup,
    InputRightElement,
    Image,
    Spinner,
    Collapse,
    Center,
} from '@chakra-ui/react';
import { ModalBackButton, StickyHeaderContainer, TransactionButtonAndStatus } from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import { FiArrowDown } from 'react-icons/fi';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { Analytics } from '@/utils/mixpanelClientInstance';
import {
    useWallet,
    useTokensWithValues,
    TokenWithValue,
    useSwapQuotes,
    useSwapTransaction,
    useCurrency,
    useGasTokenSelection,
    useGasEstimation,
} from '@/hooks';
import { SelectQuoteContent } from './SelectQuoteContent';
import { SwapQuote } from '@/types/swap';
import { useVeChainKitConfig } from '@/providers';
import { TOKEN_LOGOS, TOKEN_LOGO_COMPONENTS } from '@/utils';
import { formatUnits, parseUnits } from 'viem';
import { getConfig } from '@/config';
import { compareAddresses } from '@/utils';
import { SelectTokenContent } from '../SendToken/SelectTokenContent';
import { formatCompactCurrency } from '@/utils/currencyUtils';
import { GasTokenType } from '@/types/gasToken';
import { TransactionClause } from '@vechain/sdk-core';
import { extractSwapAmounts } from '@/utils/swap/extractSwapAmounts';

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
};

type SwapStep = 'main' | 'select-from-token' | 'select-to-token' | 'select-quote';

export const SwapTokenContent = ({ setCurrentContent }: Props) => {
    const { t } = useTranslation();
    const { account, connection } = useWallet();
    const { currentCurrency } = useCurrency();
    const { darkMode: isDark, network, feeDelegation } = useVeChainKitConfig();
    const { preferences } = useGasTokenSelection();
    const { sortedTokens } = useTokensWithValues({
        address: account?.address ?? '',
    });

    const [step, setStep] = useState<SwapStep>('main');
    const [fromToken, setFromToken] = useState<TokenWithValue | null>(null);
    const [toToken, setToToken] = useState<TokenWithValue | null>(null);
    const [amount, setAmount] = useState('');
    const [showMore, setShowMore] = useState(false);
    const [slippageTolerance, setSlippageTolerance] = useState(1);
    const [showSlippageConfig, setShowSlippageConfig] = useState(false);
    const [customSlippageValue, setCustomSlippageValue] = useState('1');
    const [selectedQuote, setSelectedQuote] = useState<SwapQuote | null>(null);
    const [selectedGasToken, setSelectedGasToken] = React.useState<GasTokenType | null>(null);
    const [userSelectedGasToken, setUserSelectedGasToken] = React.useState<GasTokenType | null>(null);
    const [swapClauses, setSwapClauses] = React.useState<TransactionClause[]>([]);

    // Determine if we're in auto mode (1% default) or custom mode
    const isAutoMode = slippageTolerance === 1;

    // Sync customSlippageValue with slippageTolerance
    React.useEffect(() => {
        if (slippageTolerance === 1) {
            setCustomSlippageValue('1');
        } else if (slippageTolerance === 0.5) {
            setCustomSlippageValue('0.5');
        } else if (slippageTolerance === 3) {
            setCustomSlippageValue('3');
        } else {
            setCustomSlippageValue(slippageTolerance.toString());
        }
    }, [slippageTolerance]);

    // Set default tokens (VET to B3TR) on initial load
    React.useEffect(() => {
        if (!fromToken && !toToken && sortedTokens.length > 0) {
            // Find VET token
            const vetToken = sortedTokens.find((t) => t.symbol === 'VET');
            if (vetToken) {
                setFromToken(vetToken);
            }

            // Find B3TR token: first try by symbol, then by address from config
            let b3trToken = sortedTokens.find((t) => t.symbol === 'B3TR');

            // If not found by symbol, try finding by address from config
            if (!b3trToken) {
                try {
                    const config = getConfig(network.type);
                    const b3trAddress = config.b3trContractAddress;
                    if (b3trAddress) {
                        b3trToken = sortedTokens.find((t) =>
                            compareAddresses(t.address, b3trAddress)
                        );
                    }
                } catch (error) {
                    console.warn('Failed to get B3TR address from config:', error);
                }
            }

            if (b3trToken) {
                setToToken(b3trToken);
            }
        }
    }, [sortedTokens, fromToken, toToken, network.type]);

    // Toggle swap direction
    const handleToggleDirection = useCallback(() => {
        if (fromToken && toToken) {
            const temp = fromToken;
            setFromToken(toToken);
            setToToken(temp);
            // Reset amount when toggling
            setAmount('');
        }
    }, [fromToken, toToken]);

    // Clear selected quote when quote parameters change
    // This ensures that when amount/token changes, we use the new best quote
    // instead of a stale manually selected quote
    React.useEffect(() => {
        setSelectedQuote(null);
    }, [fromToken?.address, toToken?.address, amount]);

    // Unified quotes: get best and full list
    const { bestQuote, quotes: allQuotes, isLoading: isLoadingQuote, from, to } = useSwapQuotes(
        fromToken,
        toToken,
        amount,
        account?.address ?? '',
        slippageTolerance,
        !!fromToken && !!toToken && Number(amount) > 0,
    );

    // Convert amount to raw format for quote (now that we know decimals)
    const amountInRaw = useMemo(() => {
        if (!amount || Number(amount) <= 0 || !from) return 0n;
        try {
            return parseUnits(amount, from.decimals);
        } catch {
            return 0n;
        }
    }, [amount, from?.decimals]);

    // Use selected quote if available, otherwise use best quote
    const quote = selectedQuote || bestQuote;

    // Format output amount for display
    const outputAmount = useMemo(() => {
        if (!quote?.outputAmount || !to) return '0';
        try {
            // Convert from raw format to human-readable
            return formatUnits(quote.outputAmount, to.decimals);
        } catch {
            return '0';
        }
    }, [quote, to?.decimals]);

    // Simulate swap to get gas estimate
    const swapParams = useMemo(() => {
        if (!fromToken || !toToken || !account?.address || amountInRaw === 0n) {
            return null;
        }
        return {
            fromTokenAddress: fromToken.address,
            toTokenAddress: toToken.address,
            amountIn: amountInRaw.toString(),
            userAddress: account.address,
            slippageTolerance,
        };
    }, [fromToken, toToken, account?.address, amountInRaw, slippageTolerance]);

    // Use gas cost from quote if available, otherwise from simulation hook
    const gasCostVTHO = quote?.gasCostVTHO ?? 0;

    // Build swap clauses for gas estimation (async operation)
    React.useEffect(() => {
        const buildClauses = async () => {
            if (!quote || !swapParams || !quote.aggregator) {
                setSwapClauses([]);
                return;
            }

            try {
                const clauses = await quote.aggregator.buildSwapTransaction(swapParams, quote);
                setSwapClauses(clauses);
            } catch (error) {
                console.error('Failed to build swap clauses for gas estimation:', error);
                setSwapClauses([]);
            }
        };

        buildClauses();
    }, [quote, swapParams]);

    // Gas estimation for social login wallets with generic delegator
    const shouldEstimateGas =
        preferences.availableGasTokens.length > 0 &&
        (connection.isConnectedWithPrivy ||
            connection.isConnectedWithVeChain) &&
        !feeDelegation?.delegatorUrl;

    const {
        data: gasEstimation,
        isLoading: gasEstimationLoading,
        error: gasEstimationError,
        refetch: refetchGasEstimation,
    } = useGasEstimation({
        clauses: swapClauses,
        tokens: selectedGasToken
            ? [selectedGasToken]
            : preferences.availableGasTokens,
        sendingAmount: amount,
        sendingTokenSymbol: fromToken?.symbol ?? '',
        enabled: shouldEstimateGas && !!feeDelegation?.genericDelegatorUrl && swapClauses.length > 0,
    });

    const usedGasToken = gasEstimation?.usedToken;
    const disableConfirmButtonDuringEstimation =
        (gasEstimationLoading || !gasEstimation) &&
        connection.isConnectedWithPrivy &&
        !feeDelegation?.delegatorUrl;

    const handleGasTokenChange = React.useCallback(
        (token: GasTokenType) => {
            setSelectedGasToken(token);
            setUserSelectedGasToken(token);
            setTimeout(() => refetchGasEstimation(), 100);
        },
        [refetchGasEstimation],
    );

    // hasEnoughBalance is now determined by the hook itself
    const hasEnoughBalance = !!usedGasToken && !gasEstimationError;

    // Auto-fallback: if the selected token cannot cover fees (estimation error),
    // clear selection to re-estimate across all available tokens
    React.useEffect(() => {
        if (gasEstimationError && selectedGasToken) {
            setSelectedGasToken(null);
        }
    }, [gasEstimationError, selectedGasToken]);

    // Swap transaction execution
    const {
        executeSwap,
        isTransactionPending,
        isWaitingForWalletConfirmation,
        txReceipt,
        status,
        error: txError,
    } = useSwapTransaction(swapParams, quote);

    const handleSwapSuccess = useCallback(() => {
        const txId = txReceipt?.meta.txID ?? '';

        Analytics.swap.completed({
            fromToken: fromToken?.symbol ?? '',
            toToken: toToken?.symbol ?? '',
            amount,
            aggregator: quote?.aggregatorName ?? '',
        });

        // Extract swap amounts from receipt transfer events
        let swapTitle = t('Swap successful', { defaultValue: 'Swap successful' });
        let swapDescription: string | undefined;

        if (txReceipt && fromToken && toToken && account?.address) {
            const swapAmounts = extractSwapAmounts(
                txReceipt,
                account.address,
                fromToken.address,
                toToken.address,
            );

            if (swapAmounts && from && to) {
                try {
                    // Format amounts using token decimals from useSwapQuotes
                    const fromDecimals = from.decimals;
                    const toDecimals = to.decimals;
                    const fromAmountFormatted = formatUnits(
                        swapAmounts.fromAmount,
                        fromDecimals,
                    );
                    const toAmountFormatted = formatUnits(
                        swapAmounts.toAmount,
                        toDecimals,
                    );

                    // Format numbers for display (remove unnecessary trailing zeros)
                    const formatAmount = (value: string) => {
                        const num = Number(value);
                        if (num >= 1000) {
                            return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
                        }
                        return num.toLocaleString(undefined, {
                            maximumFractionDigits: 6,
                            minimumFractionDigits: 0,
                        });
                    };

                    swapDescription = t(
                        'You successfully swapped {fromAmount} {fromSymbol} for {toAmount} {toSymbol}',
                        {
                            fromAmount: formatAmount(fromAmountFormatted),
                            fromSymbol: fromToken.symbol,
                            toAmount: formatAmount(toAmountFormatted),
                            toSymbol: toToken.symbol,
                            defaultValue:
                                `You successfully swapped ${formatAmount(fromAmountFormatted)} ${fromToken.symbol} for ${formatAmount(toAmountFormatted)} ${toToken.symbol}`,
                        },
                    );
                } catch (error) {
                    console.warn('Failed to format swap amounts:', error);
                }
            }
        }

        // Fallback to basic description if extraction failed
        if (!swapDescription && fromToken && toToken) {
            swapDescription = t(
                'You successfully swapped {fromToken} for {toToken}',
                {
                    fromToken: fromToken.symbol,
                    toToken: toToken.symbol,
                    defaultValue: `You successfully swapped ${fromToken.symbol} for ${toToken.symbol}`,
                },
            );
        }

        setCurrentContent({
            type: 'successful-operation',
            props: {
                setCurrentContent,
                txId,
                title: swapTitle,
                description: swapDescription,
                onDone: () => {
                    setCurrentContent('main');
                },
                showSocialButtons: true,
            },
        });
    }, [fromToken, toToken, amount, quote, txReceipt, account?.address, setCurrentContent, t]);

    const handleSwapError = useCallback((error: Error | string) => {
        const errorMessage = typeof error === 'string' ? error : error.message;
        const txId = txReceipt?.meta.txID;

        Analytics.swap.failed({
            fromToken: fromToken?.symbol ?? '',
            toToken: toToken?.symbol ?? '',
            amount,
            error: errorMessage,
        });

        setCurrentContent({
            type: 'failed-operation',
            props: {
                setCurrentContent,
                txId,
                title: t('Transaction failed'),
                description: errorMessage || t('Something went wrong. Please try again.'),
                onDone: () => {
                    setCurrentContent('swap-token');
                },
            },
        });
    }, [fromToken, toToken, amount, txReceipt, setCurrentContent, t]);

    // Track if we've already shown success/error to prevent duplicate dialogs
    const [hasShownResult, setHasShownResult] = React.useState(false);

    // Handle transaction status changes to show success/error dialogs
    React.useEffect(() => {
        // Reset the flag when transaction status changes to ready (new transaction)
        if (status === 'ready') {
            setHasShownResult(false);
            return;
        }

        // Only show dialog once per transaction
        if (hasShownResult) {
            return;
        }

        if (status === 'success' && txReceipt && !txReceipt.reverted) {
            setHasShownResult(true);
            handleSwapSuccess();
        } else if (status === 'error' && txError) {
            setHasShownResult(true);
            const errorMessage = (txError as any)?.reason || (txError as any)?.message || String(txError);
            handleSwapError(errorMessage);
        } else if (txReceipt?.reverted) {
            setHasShownResult(true);
            handleSwapError('Transaction reverted');
        }
    }, [status, txReceipt, txError, handleSwapSuccess, handleSwapError, hasShownResult]);

    // Token selection handlers
    const handleSelectFromToken = useCallback((token: TokenWithValue) => {
        setFromToken(token);

        // Default to B3TR if VET is selected as from token
        if (token.symbol === 'VET' && !toToken) {
            // Try finding B3TR by symbol first
            let b3trToken = sortedTokens.find((t) => t.symbol === 'B3TR');

            // If not found by symbol, try finding by address from config
            if (!b3trToken) {
                try {
                    const config = getConfig(network.type);
                    const b3trAddress = config.b3trContractAddress;
                    if (b3trAddress) {
                        b3trToken = sortedTokens.find((t) =>
                            compareAddresses(t.address, b3trAddress)
                        );
                    }
                } catch (error) {
                    console.warn('Failed to get B3TR address from config:', error);
                }
            }

            if (b3trToken) {
                setToToken(b3trToken);
            }
        }

        setStep('main');
        Analytics.swap.tokenSelected('from', token.symbol);
    }, [toToken, sortedTokens, network.type]);

    const handleSelectToToken = useCallback((token: TokenWithValue) => {
        setToToken(token);
        setStep('main');
        Analytics.swap.tokenSelected('to', token.symbol);
    }, []);

    // Amount input handlers
    const handleAmountChange = useCallback((value: string) => {
        // Allow only numbers and decimal point
        const regex = /^\d*\.?\d*$/;
        if (regex.test(value) || value === '') {
            setAmount(value);
        }
    }, []);

    const handleSetMaxAmount = useCallback(() => {
        if (fromToken) {
            setAmount(fromToken.balance);
            Analytics.swap.amountSet('max', fromToken.balance);
        }
    }, [fromToken]);



    // Get token display info
    const getTokenDisplay = (token: TokenWithValue | null) => {
        if (!token) return null;
        const logoComponent = TOKEN_LOGO_COMPONENTS[token.symbol];
        const logoUrl = TOKEN_LOGOS[token.symbol];
        return {
            symbol: token.symbol,
            logoComponent,
            logoUrl,
            balance: token.balance,
            value: token.valueInCurrency,
        };
    };

    const fromTokenDisplay = getTokenDisplay(fromToken);
    const toTokenDisplay = getTokenDisplay(toToken);

    // Render token selection screen
    if (step === 'select-from-token') {
        return (
            <SelectTokenContent
                setCurrentContent={setCurrentContent}
                onSelectToken={handleSelectFromToken}
                onBack={() => setStep('main')}
                showAllTokens={false}
            />
        );
    }

    if (step === 'select-quote') {
        return (
            <SelectQuoteContent
                quotes={allQuotes}
                selectedQuote={quote}
                toTokenAddress={toToken?.address ?? null}
                onSelectQuote={(selected) => {
                    setSelectedQuote(selected);
                    setStep('main');
                }}
                onBack={() => setStep('main')}
            />
        );
    }

    if (step === 'select-to-token') {
        return (
            <SelectTokenContent
                setCurrentContent={setCurrentContent}
                onSelectToken={handleSelectToToken}
                onBack={() => setStep('main')}
                showAllTokens={true}
            />
        );
    }

    // Render main swap interface
    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader>{t('Swap')}</ModalHeader>
                <ModalBackButton onClick={() => setCurrentContent('main')} />
                <ModalCloseButton />
            </StickyHeaderContainer>

            <Container maxW={'container.lg'} p={0}>
                <ModalBody>
                    <VStack spacing={2} align="stretch" w="full">
                        {/* From Section */}
                        <Box
                            p={6}
                            borderRadius="xl"
                            bg={isDark ? '#00000038' : 'gray.50'}
                        >
                            <Text
                                fontSize="sm"
                                fontWeight="medium"
                                color={isDark ? 'whiteAlpha.700' : 'blackAlpha.700'}
                                mb={2}
                            >
                                {t('From')}
                            </Text>
                            <VStack align="stretch" spacing={2}>
                                <HStack justify="space-between">
                                    <Input
                                        placeholder="0"
                                        value={amount}
                                        onChange={(e) => handleAmountChange(e.target.value)}
                                        fontSize="4xl"
                                        fontWeight="bold"
                                        variant="unstyled"
                                        data-testid="swap-amount-input"
                                        type="number"
                                        inputMode="decimal"
                                        color={
                                            fromTokenDisplay && amount && Number(amount) > Number(fromTokenDisplay.balance)
                                                ? 'red.500'
                                                : undefined
                                        }
                                    />
                                    {fromTokenDisplay ? (
                                        <Button
                                            onClick={() => setStep('select-from-token')}
                                            variant="outline"
                                            size="sm"
                                            borderRadius="full"
                                            px={6}
                                            color={
                                                isDark
                                                    ? 'whiteAlpha.700'
                                                    : 'blackAlpha.700'
                                            }
                                            borderColor={
                                                isDark
                                                    ? 'whiteAlpha.700'
                                                    : 'blackAlpha.700'
                                            }
                                            _hover={{
                                                bg: isDark
                                                    ? 'whiteAlpha.300'
                                                    : 'blackAlpha.300',
                                            }}
                                            leftIcon={
                                                fromTokenDisplay.logoComponent ? (
                                                    React.cloneElement(
                                                        fromTokenDisplay.logoComponent,
                                                        {
                                                            boxSize: '20px',
                                                            borderRadius: 'full',
                                                        },
                                                    )
                                                ) : fromTokenDisplay.logoUrl ? (
                                                    <Image
                                                        src={fromTokenDisplay.logoUrl}
                                                        alt={`${fromTokenDisplay.symbol} logo`}
                                                        boxSize="20px"
                                                        borderRadius="full"
                                                        fallback={
                                                            <Box
                                                                boxSize="20px"
                                                                borderRadius="full"
                                                                bg="whiteAlpha.200"
                                                                display="flex"
                                                                alignItems="center"
                                                                justifyContent="center"
                                                            >
                                                                <Text
                                                                    fontSize="8px"
                                                                    fontWeight="bold"
                                                                >
                                                                    {fromTokenDisplay.symbol.slice(
                                                                        0,
                                                                        3,
                                                                    )}
                                                                </Text>
                                                            </Box>
                                                        }
                                                    />
                                                ) : undefined
                                            }
                                        >
                                            {fromTokenDisplay.symbol}
                                            <Icon
                                                as={MdKeyboardArrowDown}
                                                boxSize={5}
                                                color={
                                                    isDark
                                                        ? 'whiteAlpha.600'
                                                        : 'blackAlpha.600'
                                                }
                                            />
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={() => setStep('select-from-token')}
                                            variant="outline"
                                            size="sm"
                                            borderRadius="full"
                                            px={6}
                                            color={
                                                isDark
                                                    ? 'whiteAlpha.700'
                                                    : 'blackAlpha.700'
                                            }
                                            borderColor={
                                                isDark
                                                    ? 'whiteAlpha.700'
                                                    : 'blackAlpha.700'
                                            }
                                            _hover={{
                                                bg: isDark
                                                    ? 'whiteAlpha.300'
                                                    : 'blackAlpha.300',
                                                color: isDark
                                                    ? 'whiteAlpha.700'
                                                    : 'blackAlpha.700',
                                            }}
                                        >
                                            {t('Select token')}
                                            <Icon
                                                as={MdKeyboardArrowDown}
                                                boxSize={5}
                                                color={
                                                    isDark
                                                        ? 'whiteAlpha.600'
                                                        : 'blackAlpha.600'
                                                }
                                            />
                                        </Button>
                                    )}
                                </HStack>
                                {fromTokenDisplay && (
                                    <HStack
                                        spacing={1}
                                        fontSize="sm"
                                        justifyContent={'space-between'}
                                        color={
                                            isDark
                                                ? 'whiteAlpha.700'
                                                : 'blackAlpha.700'
                                        }
                                    >
                                        <HStack spacing={2} alignItems="center">
                                            {Number(fromTokenDisplay.balance) > 0 && (
                                                <Text
                                                    noOfLines={1}
                                                    overflow="hidden"
                                                    textOverflow="ellipsis"
                                                >
                                                    {Number(fromTokenDisplay.balance).toLocaleString(undefined, {
                                                        maximumFractionDigits: 2,
                                                    })} {fromTokenDisplay.symbol}
                                                </Text>
                                            )}
                                            {fromTokenDisplay.value > 0 && (
                                                <Text opacity={0.5}>
                                                    ≈ {formatCompactCurrency(
                                                        fromTokenDisplay.value,
                                                        { currency: currentCurrency },
                                                    )}
                                                </Text>
                                            )}
                                        </HStack>
                                        <Text
                                            cursor="pointer"
                                            _hover={{
                                                color: isDark
                                                    ? 'blue.300'
                                                    : 'blue.500',
                                                textDecoration: 'underline',
                                            }}
                                            onClick={handleSetMaxAmount}
                                            noOfLines={1}
                                            overflow="hidden"
                                            textOverflow="ellipsis"
                                        >
                                            {t('Swap all')}
                                        </Text>
                                    </HStack>
                                )}
                            </VStack>
                        </Box>

                        {/* Arrow Icon */}
                        <Center
                            position="relative"
                            marginTop="-20px"
                            marginBottom="-20px"
                            marginX="auto"
                            bg={isDark ? '#151515' : 'gray.100'}
                            borderRadius="xl"
                            w="40px"
                            h="40px"
                            zIndex={2}
                            cursor={!fromToken || !toToken || isLoadingQuote ? 'not-allowed' : 'pointer'}
                            onClick={(!fromToken || !toToken || isLoadingQuote) ? undefined : handleToggleDirection}
                            opacity={!fromToken || !toToken || isLoadingQuote ? 0.5 : 1}
                        >
                            {isLoadingQuote ? (
                                <Spinner size="sm" />
                            ) : (
                                <Icon
                                    as={FiArrowDown}
                                    boxSize={5}
                                    opacity={0.5}
                                    color={isDark ? 'whiteAlpha.700' : 'gray.600'}
                                />
                            )}
                        </Center>

                        {/* To Section */}
                        <Box
                            p={6}
                            borderRadius="xl"
                            bg={isDark ? '#00000038' : 'gray.50'}
                        >
                            <Text
                                fontSize="sm"
                                fontWeight="medium"
                                color={isDark ? 'whiteAlpha.700' : 'blackAlpha.700'}
                                mb={2}
                            >
                                {t('To')}
                            </Text>
                            <VStack align="stretch" spacing={2}>
                                <HStack justify="space-between" alignItems="center">
                                    <Input
                                        value={Number(outputAmount).toLocaleString(undefined, {
                                            maximumFractionDigits: Number(outputAmount) > 10000 ? 0 : 2,
                                        })}
                                        readOnly
                                        variant="unstyled"
                                        fontSize="4xl"
                                        fontWeight="bold"
                                        data-testid="swap-output-amount"
                                    />
                                    {toTokenDisplay ? (
                                        <Button
                                            onClick={() => setStep('select-to-token')}
                                            variant="outline"
                                            size="sm"
                                            borderRadius="full"
                                            px={6}
                                            color={
                                                isDark
                                                    ? 'whiteAlpha.700'
                                                    : 'blackAlpha.700'
                                            }
                                            borderColor={
                                                isDark
                                                    ? 'whiteAlpha.700'
                                                    : 'blackAlpha.700'
                                            }
                                            _hover={{
                                                bg: isDark
                                                    ? 'whiteAlpha.300'
                                                    : 'blackAlpha.300',
                                            }}
                                            leftIcon={
                                                toTokenDisplay.logoComponent ? (
                                                    React.cloneElement(
                                                        toTokenDisplay.logoComponent,
                                                        {
                                                            boxSize: '20px',
                                                            borderRadius: 'full',
                                                        },
                                                    )
                                                ) : toTokenDisplay.logoUrl ? (
                                                    <Image
                                                        src={toTokenDisplay.logoUrl}
                                                        alt={`${toTokenDisplay.symbol} logo`}
                                                        boxSize="20px"
                                                        borderRadius="full"
                                                        fallback={
                                                            <Box
                                                                boxSize="20px"
                                                                borderRadius="full"
                                                                bg="whiteAlpha.200"
                                                                display="flex"
                                                                alignItems="center"
                                                                justifyContent="center"
                                                            >
                                                                <Text
                                                                    fontSize="8px"
                                                                    fontWeight="bold"
                                                                >
                                                                    {toTokenDisplay.symbol.slice(
                                                                        0,
                                                                        3,
                                                                    )}
                                                                </Text>
                                                            </Box>
                                                        }
                                                    />
                                                ) : undefined
                                            }
                                        >
                                            {toTokenDisplay.symbol}
                                            <Icon
                                                as={MdKeyboardArrowDown}
                                                boxSize={5}
                                                color={
                                                    isDark
                                                        ? 'whiteAlpha.600'
                                                        : 'blackAlpha.600'
                                                }
                                            />
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={() => setStep('select-to-token')}
                                            variant="outline"
                                            size="sm"
                                            borderRadius="full"
                                            px={6}
                                            color={
                                                isDark
                                                    ? 'whiteAlpha.700'
                                                    : 'blackAlpha.700'
                                            }
                                            borderColor={
                                                isDark
                                                    ? 'whiteAlpha.700'
                                                    : 'blackAlpha.700'
                                            }
                                            _hover={{
                                                bg: isDark
                                                    ? 'whiteAlpha.300'
                                                    : 'blackAlpha.300',
                                                color: isDark
                                                    ? 'whiteAlpha.700'
                                                    : 'blackAlpha.700',
                                            }}
                                        >
                                            {t('Select token')}
                                            <Icon
                                                as={MdKeyboardArrowDown}
                                                boxSize={5}
                                                color={
                                                    isDark
                                                        ? 'whiteAlpha.600'
                                                        : 'blackAlpha.600'
                                                }
                                            />
                                        </Button>
                                    )}
                                </HStack>
                                {toTokenDisplay && (
                                    <HStack
                                        spacing={1}
                                        fontSize="sm"
                                        justifyContent={'space-between'}
                                        color={
                                            isDark
                                                ? 'whiteAlpha.700'
                                                : 'blackAlpha.700'
                                        }
                                    >
                                        <HStack spacing={2} alignItems="center">
                                            {Number(toTokenDisplay.balance) > 0 && (
                                                <Text
                                                    noOfLines={1}
                                                    overflow="hidden"
                                                    textOverflow="ellipsis"
                                                >
                                                    {Number(toTokenDisplay.balance).toLocaleString(undefined, {
                                                        maximumFractionDigits: 2,
                                                    })} {toTokenDisplay.symbol}
                                                </Text>
                                            )}
                                            {toTokenDisplay.value > 0 && (
                                                <Text opacity={0.5}>
                                                    ≈ {formatCompactCurrency(
                                                        toTokenDisplay.value,
                                                        { currency: currentCurrency },
                                                    )}
                                                </Text>
                                            )}
                                        </HStack>
                                        <Box />
                                    </HStack>
                                )}
                            </VStack>
                        </Box>

                        {/* Show More Section */}
                        <Collapse in={showMore && !!quote} animateOpacity>
                            <VStack spacing={1} align="stretch" p={4} borderRadius="xl" bg={isDark ? '#00000038' : 'gray.50'}>
                                {/* Source */}
                                {quote && (
                                    <HStack justify="space-between">
                                        <Text fontSize="xs" color={isDark ? 'whiteAlpha.700' : 'blackAlpha.700'}>
                                            {t('Source')}:
                                        </Text>
                                        <HStack
                                            spacing={1.5}
                                            cursor="pointer"
                                            onClick={() => setStep('select-quote')}
                                            _hover={{ opacity: 0.8 }}
                                            alignItems="center"
                                        >
                                            {quote.aggregator?.getIcon('12px')}
                                            <Text fontSize="xs">{quote.aggregatorName}</Text>
                                        </HStack>
                                    </HStack>
                                )}

                                {/* Slippage */}
                                <VStack align="stretch" spacing={2}>
                                    <HStack justify="space-between" cursor="pointer" onClick={() => setShowSlippageConfig(!showSlippageConfig)}>
                                        <Text fontSize="xs" color={isDark ? 'whiteAlpha.700' : 'blackAlpha.700'}>
                                            {t('Slippage tolerance')}:
                                        </Text>
                                        <Text fontSize="xs" fontWeight="medium">
                                            {slippageTolerance}%
                                        </Text>
                                    </HStack>

                                    {/* Slippage Configuration */}
                                    <Collapse in={showSlippageConfig} animateOpacity>
                                        <VStack spacing={3} align="stretch" pt={2}>
                                            <HStack spacing={2}>
                                                <Button
                                                    size="sm"
                                                    variant={isAutoMode ? 'solid' : 'outline'}
                                                    colorScheme={isAutoMode ? 'blue' : 'gray'}
                                                    onClick={() => {
                                                        setSlippageTolerance(1);
                                                    }}
                                                    flex="0 0 auto"
                                                    minW="60px"
                                                    borderRadius="md"
                                                    fontSize="xs"
                                                >
                                                    Auto
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant={slippageTolerance === 0.5 ? 'solid' : 'outline'}
                                                    colorScheme={slippageTolerance === 0.5 ? 'blue' : 'gray'}
                                                    onClick={() => {
                                                        setSlippageTolerance(0.5);
                                                    }}
                                                    flex="0 0 auto"
                                                    minW="60px"
                                                    borderRadius="md"
                                                    fontSize="xs"
                                                >
                                                    0.5%
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant={slippageTolerance === 3 ? 'solid' : 'outline'}
                                                    colorScheme={slippageTolerance === 3 ? 'blue' : 'gray'}
                                                    onClick={() => {
                                                        setSlippageTolerance(3);
                                                    }}
                                                    flex="0 0 auto"
                                                    minW="60px"
                                                    borderRadius="md"
                                                    fontSize="xs"
                                                >
                                                    3%
                                                </Button>
                                                <InputGroup size="sm" flex={1}>
                                                    <Input
                                                        value={customSlippageValue}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            // Allow numbers and decimal point
                                                            if (/^\d*\.?\d*$/.test(value) || value === '') {
                                                                setCustomSlippageValue(value);
                                                                if (value !== '') {
                                                                    const numValue = parseFloat(value);
                                                                    if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
                                                                        setSlippageTolerance(numValue);
                                                                    }
                                                                }
                                                            }
                                                        }}
                                                        placeholder="1"
                                                        borderRadius="md"
                                                        textAlign="right"
                                                        pr={8}
                                                        fontSize="xs"
                                                    />
                                                    <InputRightElement width="2rem" pointerEvents="none">
                                                        <Text fontSize="2xs" color={isDark ? 'whiteAlpha.600' : 'blackAlpha.600'}>
                                                            %
                                                        </Text>
                                                    </InputRightElement>
                                                </InputGroup>
                                            </HStack>
                                        </VStack>
                                    </Collapse>
                                </VStack>

                                {/* Gas Fee */}
                                <HStack justify="space-between">
                                    <Text fontSize="xs" color={isDark ? 'whiteAlpha.700' : 'blackAlpha.700'}>
                                        {t('Gas fee')}:
                                    </Text>
                                    <Text fontSize="xs" fontWeight="medium">
                                        {gasCostVTHO > 0 ? `${gasCostVTHO.toLocaleString(undefined, {
                                            maximumFractionDigits: 2,
                                        })} VTHO` : '-'}
                                    </Text>
                                </HStack>
                            </VStack>
                        </Collapse>

                        {/* Show More Toggle - Always reserve space */}
                        <Box minH="24px" display="flex" alignItems="center" justifyContent="center">
                            {quote && (
                                <Button
                                    variant="ghost"
                                    size="xs"
                                    onClick={() => setShowMore(!showMore)}
                                    rightIcon={
                                        <Icon
                                            color={isDark ? 'whiteAlpha.600' : 'blackAlpha.600'}
                                            _hover={{ color: isDark ? 'whiteAlpha.800' : 'blackAlpha.800' }}
                                            as={showMore ? FaArrowUp : FaArrowDown}
                                        />
                                    }
                                    fontSize="xs"
                                    fontWeight="light"
                                    color={isDark ? 'whiteAlpha.600' : 'blackAlpha.600'}
                                    _hover={{
                                        color: isDark ? 'whiteAlpha.800' : 'blackAlpha.800',
                                    }}
                                >
                                    {showMore ? t('Show Less') : t('Show More')}
                                </Button>
                            )}
                        </Box>
                    </VStack>
                </ModalBody>
            </Container>

            <ModalFooter>
                <TransactionButtonAndStatus
                    buttonText={t('Swap')}
                    onConfirm={executeSwap}
                    isSubmitting={isTransactionPending}
                    isTxWaitingConfirmation={isWaitingForWalletConfirmation}
                    transactionPendingText={t('Swapping...')}
                    txReceipt={txReceipt}
                    transactionError={txError}
                    isDisabled={
                        !fromToken ||
                        !toToken ||
                        !amount ||
                        Number(amount) <= 0 ||
                        isLoadingQuote ||
                        quote?.reverted === true ||
                        Boolean(fromTokenDisplay && amount && Number(amount) > Number(fromTokenDisplay.balance)) ||
                        disableConfirmButtonDuringEstimation
                    }
                    gasEstimationError={gasEstimationError}
                    hasEnoughGasBalance={hasEnoughBalance}
                    isLoadingGasEstimation={gasEstimationLoading}
                    showGasEstimationError={
                        !feeDelegation?.delegatorUrl &&
                        connection.isConnectedWithPrivy
                    }
                    context="transaction"
                />
            </ModalFooter>
        </>
    );
};
