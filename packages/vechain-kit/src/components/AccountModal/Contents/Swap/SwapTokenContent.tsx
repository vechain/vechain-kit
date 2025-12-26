import {
    useState,
    useMemo,
    useCallback,
    cloneElement,
    Dispatch,
    SetStateAction,
    useEffect,
} from 'react';
import {
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
    Collapse,
    useToken,
} from '@chakra-ui/react';
import {
    GasFeeSummary,
    ModalBackButton,
    StickyHeaderContainer,
    TransactionButtonAndStatus,
} from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import { LuArrowDown, LuArrowUp, LuChevronDown } from 'react-icons/lu';
import { useTranslation } from 'react-i18next';
import {
    useWallet,
    useTokensWithValues,
    TokenWithValue,
    useSwapQuotes,
    useSwapTransaction,
    useCurrency,
    useGasTokenSelection,
    useGenericDelegatorFeeEstimation,
} from '@/hooks';
import { SelectQuoteContent } from './SelectQuoteContent';
import { SwapQuote } from '@/types/swap';
import { useVeChainKitConfig } from '@/providers';
import { formatUnits, parseUnits } from 'viem';
import { getConfig } from '@/config';
import { compareAddresses } from '@/utils';
import { SelectTokenContent } from '../SendToken/SelectTokenContent';
import { formatCompactCurrency } from '@/utils/currencyUtils';
import {
    convertToSelectedCurrency,
    SupportedCurrency,
} from '@/utils/currencyUtils';
import { useTokenPrices } from '@/hooks';
import { GasTokenType } from '@/types/gasToken';
import { TransactionClause } from '@vechain/sdk-core';
import { extractSwapAmounts } from '@/utils/swap/extractSwapAmounts';
import { useAccountModalOptions } from '@/hooks/modals/useAccountModalOptions';

type Props = {
    setCurrentContent: Dispatch<SetStateAction<AccountModalContentTypes>>;
    fromTokenAddress?: string;
    toTokenAddress?: string;
};

type SwapStep =
    | 'main'
    | 'select-from-token'
    | 'select-to-token'
    | 'select-quote';

export const SwapTokenContent = ({
    setCurrentContent,
    fromTokenAddress,
    toTokenAddress,
}: Props) => {
    const { t } = useTranslation();
    const { account, connection } = useWallet();
    const { currentCurrency } = useCurrency();
    const { network, feeDelegation, darkMode: isDark } = useVeChainKitConfig();
    const { isolatedView, closeAccountModal } = useAccountModalOptions();

    const cardBg = useToken('colors', 'vechain-kit-card');
    const textPrimary = useToken('colors', 'vechain-kit-text-primary');
    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');
    const textTertiary = useToken('colors', 'vechain-kit-text-tertiary');
    const primaryButtonBg = useToken('colors', 'vechain-kit-button-primary-bg');
    const primaryButtonColor = useToken(
        'colors',
        'vechain-kit-button-primary-color',
    );

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
    const [customSlippageValue, setCustomSlippageValue] = useState('1');
    const [selectedQuote, setSelectedQuote] = useState<SwapQuote | null>(null);
    const [selectedGasToken, setSelectedGasToken] =
        useState<GasTokenType | null>(null);
    const [userSelectedGasToken, setUserSelectedGasToken] =
        useState<GasTokenType | null>(null);
    const [swapClauses, setSwapClauses] = useState<TransactionClause[]>([]);

    // Prices and FX to compute fiat values for entered and output amounts
    const { prices, exchangeRates } = useTokenPrices();

    // Determine if we're in auto mode (1% default) or custom mode
    const isAutoMode = slippageTolerance === 1;

    // Sync customSlippageValue with slippageTolerance
    useEffect(() => {
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

    // Set initial tokens from provided addresses if present, otherwise default VET -> B3TR
    useEffect(() => {
        if (sortedTokens.length === 0) return;

        // Prefer provided addresses
        if ((fromTokenAddress || toTokenAddress) && (!fromToken || !toToken)) {
            if (fromTokenAddress && !fromToken) {
                const match = sortedTokens.find((t) =>
                    compareAddresses(t.address, fromTokenAddress),
                );
                if (match) setFromToken(match);
            }
            if (toTokenAddress && !toToken) {
                const match = sortedTokens.find((t) =>
                    compareAddresses(t.address, toTokenAddress),
                );
                if (match) setToToken(match);
            }
            return;
        }

        if (!fromToken && !toToken) {
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
                            compareAddresses(t.address, b3trAddress),
                        );
                    }
                } catch (error) {
                    console.warn(
                        'Failed to get B3TR address from config:',
                        error,
                    );
                }
            }

            if (b3trToken) {
                setToToken(b3trToken);
            }
        }
    }, [
        sortedTokens,
        fromToken,
        toToken,
        fromTokenAddress,
        toTokenAddress,
        network.type,
    ]);

    // Clear selected quote when quote parameters change
    // This ensures that when amount/token changes, we use the new best quote
    // instead of a stale manually selected quote
    useEffect(() => {
        setSelectedQuote(null);
    }, [fromToken?.address, toToken?.address, amount]);

    // Unified quotes: get best and full list
    const {
        bestQuote,
        quotes: allQuotes,
        isLoading: isLoadingQuote,
        from,
        to,
    } = useSwapQuotes(
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

    // Fiat value for the entered input amount (from side)
    const fromAmountFiatValue = useMemo(() => {
        if (!fromToken || !amount) return 0;
        const priceUsd = prices[fromToken.address] || 0;
        const valueUsd = Number(amount) * priceUsd;
        return convertToSelectedCurrency(
            valueUsd,
            currentCurrency as SupportedCurrency,
            exchangeRates,
        );
    }, [fromToken?.address, amount, prices, currentCurrency, exchangeRates]);

    // Fiat value for the quoted output amount (to side)
    const toAmountFiatValue = useMemo(() => {
        if (!toToken || !outputAmount) return 0;
        const priceUsd = prices[toToken.address] || 0;
        const valueUsd = Number(outputAmount) * priceUsd;
        return convertToSelectedCurrency(
            valueUsd,
            currentCurrency as SupportedCurrency,
            exchangeRates,
        );
    }, [
        toToken?.address,
        outputAmount,
        prices,
        currentCurrency,
        exchangeRates,
    ]);

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
    useEffect(() => {
        const buildClauses = async () => {
            if (!quote || !swapParams || !quote.aggregator) {
                setSwapClauses([]);
                return;
            }

            try {
                const clauses = await quote.aggregator.buildSwapTransaction(
                    swapParams,
                    quote,
                );
                setSwapClauses(clauses);
            } catch (error) {
                console.error(
                    'Failed to build swap clauses for gas estimation:',
                    error,
                );
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
    } = useGenericDelegatorFeeEstimation({
        clauses: swapClauses,
        tokens: selectedGasToken
            ? [selectedGasToken]
            : preferences.availableGasTokens,
        sendingAmount: amount,
        sendingTokenSymbol: fromToken?.symbol ?? '',
        enabled:
            shouldEstimateGas &&
            !!feeDelegation?.genericDelegatorUrl &&
            swapClauses.length > 0,
    });

    const usedGasToken = gasEstimation?.usedToken;
    const disableConfirmButtonDuringEstimation =
        (gasEstimationLoading || !gasEstimation) &&
        connection.isConnectedWithPrivy &&
        !feeDelegation?.delegatorUrl;

    const handleGasTokenChange = useCallback(
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
    useEffect(() => {
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
        // Extract swap amounts from receipt transfer events
        const swapTitle = t('Swap successful', {
            defaultValue: 'Swap successful',
        });
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
                            return num.toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                            });
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
                            defaultValue: `You successfully swapped ${formatAmount(
                                fromAmountFormatted,
                            )} ${fromToken.symbol} for ${formatAmount(
                                toAmountFormatted,
                            )} ${toToken.symbol}`,
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
                    if (isolatedView) {
                        closeAccountModal();
                    } else {
                        setCurrentContent('main');
                    }
                },
                showSocialButtons: true,
            },
        });
    }, [
        fromToken,
        toToken,
        amount,
        quote,
        txReceipt,
        account?.address,
        setCurrentContent,
        t,
        isolatedView,
        closeAccountModal,
    ]);

    const handleSwapError = useCallback(
        (error: Error | string) => {
            const errorMessage =
                typeof error === 'string' ? error : error.message;
            console.error('Swap failed:', errorMessage);
        },
        [fromToken, toToken, amount],
    );

    // Track if we've already shown success/error to prevent duplicate dialogs
    const [hasShownResult, setHasShownResult] = useState(false);

    // Handle transaction status changes to show success dialogs
    // Errors are shown inline via TransactionButtonAndStatus component
    useEffect(() => {
        // Reset the flag when transaction status changes to ready (new transaction)
        if (status === 'ready') {
            setHasShownResult(false);
            return;
        }

        // Only show dialog once per transaction
        if (hasShownResult) {
            return;
        }

        // Only show success modal, errors are handled inline
        if (status === 'success' && txReceipt && !txReceipt.reverted) {
            setHasShownResult(true);
            handleSwapSuccess();
        } else if (status === 'error' && txError) {
            // Track error for analytics but don't show modal
            const errorMessage =
                (txError as any)?.reason ||
                (txError as any)?.message ||
                String(txError);
            handleSwapError(errorMessage);
        } else if (txReceipt?.reverted) {
            // Track reverted transaction for analytics but don't show modal
            handleSwapError('Transaction reverted');
        }
    }, [
        status,
        txReceipt,
        txError,
        handleSwapSuccess,
        handleSwapError,
        hasShownResult,
    ]);

    // Token selection handlers
    const handleSelectFromToken = useCallback(
        (token: TokenWithValue) => {
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
                                compareAddresses(t.address, b3trAddress),
                            );
                        }
                    } catch (error) {
                        console.warn(
                            'Failed to get B3TR address from config:',
                            error,
                        );
                    }
                }

                if (b3trToken) {
                    setToToken(b3trToken);
                }
            }

            setStep('main');
        },
        [toToken, sortedTokens, network.type],
    );

    const handleSelectToToken = useCallback((token: TokenWithValue) => {
        setToToken(token);
        setStep('main');
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
            setAmount(fromToken.balance.scaled);
        }
    }, [fromToken]);

    // Get token display info
    const getTokenDisplay = (token: TokenWithValue | null) => {
        if (!token) return null;
        const logoComponent = null; //TODO: CHECK IF COMPONENT IS NEEDED
        const logoUrl = ''; //TODO: ADD LOGO URL;
        return {
            symbol: token.symbol,
            logoComponent,
            logoUrl,
            balance: token.balance.scaled,
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
                {!isolatedView && (
                    <ModalBackButton
                        onClick={() => setCurrentContent('main')}
                        isDisabled={
                            isTransactionPending ||
                            isWaitingForWalletConfirmation
                        }
                    />
                )}
                <ModalCloseButton
                    isDisabled={
                        isTransactionPending || isWaitingForWalletConfirmation
                    }
                />
            </StickyHeaderContainer>

            <ModalBody>
                <VStack spacing={2} align="stretch" w="full">
                    {/* From Section */}
                    <HStack justify="space-between">
                        <Text
                            fontSize="md"
                            fontWeight="bold"
                            color={textPrimary}
                        >
                            {t('From')}
                        </Text>

                        {fromTokenDisplay && (
                            <Text
                                cursor="pointer"
                                _hover={{
                                    color: textSecondary,
                                    textDecoration: 'underline',
                                }}
                                onClick={handleSetMaxAmount}
                                noOfLines={1}
                                overflow="hidden"
                                textOverflow="ellipsis"
                                fontSize="sm"
                                fontWeight="medium"
                                color={textSecondary}
                            >
                                {t('Balance')}:{' '}
                                {Number(
                                    fromTokenDisplay.balance ?? 0,
                                ).toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}
                            </Text>
                        )}
                    </HStack>
                    <Box p={4} borderRadius="2xl" bg={cardBg}>
                        <VStack align="stretch" spacing={2}>
                            <HStack justify="space-between">
                                <Input
                                    placeholder="0"
                                    value={amount}
                                    onChange={(e) =>
                                        handleAmountChange(e.target.value)
                                    }
                                    fontSize="4xl"
                                    fontWeight="bold"
                                    variant="unstyled"
                                    data-testid="swap-amount-input"
                                    type="number"
                                    inputMode="decimal"
                                    color={
                                        fromTokenDisplay &&
                                        amount &&
                                        Number(amount) >
                                            Number(fromTokenDisplay.balance)
                                            ? 'red.500'
                                            : textPrimary
                                    }
                                />
                                {fromTokenDisplay ? (
                                    <Button
                                        onClick={() =>
                                            setStep('select-from-token')
                                        }
                                        variant="outline"
                                        size="sm"
                                        borderRadius="full"
                                        px={6}
                                        color={textSecondary}
                                        borderColor={textSecondary}
                                        _hover={{
                                            bg: isDark
                                                ? 'whiteAlpha.300'
                                                : 'blackAlpha.300',
                                        }}
                                        leftIcon={
                                            fromTokenDisplay.logoComponent ? (
                                                cloneElement(
                                                    fromTokenDisplay.logoComponent,
                                                    {
                                                        boxSize: '20px',
                                                        borderRadius: 'full',
                                                    },
                                                )
                                            ) : fromTokenDisplay.logoUrl ? (
                                                <Image
                                                    src={
                                                        fromTokenDisplay.logoUrl
                                                    }
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
                                                                color={
                                                                    textPrimary
                                                                }
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
                                            as={LuChevronDown}
                                            boxSize={5}
                                            color={textSecondary}
                                        />
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={() =>
                                            setStep('select-from-token')
                                        }
                                        variant="outline"
                                        size="sm"
                                        borderRadius="full"
                                        px={6}
                                        color={textSecondary}
                                        borderColor={textSecondary}
                                        _hover={{
                                            bg: isDark
                                                ? 'whiteAlpha.300'
                                                : 'blackAlpha.300',
                                            color: textTertiary,
                                        }}
                                    >
                                        {t('Select token')}
                                        <Icon
                                            as={LuChevronDown}
                                            boxSize={5}
                                            color={textSecondary}
                                        />
                                    </Button>
                                )}
                            </HStack>

                            <HStack
                                spacing={1}
                                fontSize="sm"
                                justifyContent={'space-between'}
                                color={textSecondary}
                            >
                                <HStack spacing={2} alignItems="center">
                                    <Text color={textSecondary}>
                                        ≈{' '}
                                        {formatCompactCurrency(
                                            fromAmountFiatValue ?? 0,
                                            {
                                                currency: currentCurrency,
                                            },
                                        )}
                                    </Text>
                                </HStack>
                            </HStack>
                        </VStack>
                    </Box>

                    {/* To Section */}
                    <HStack justify="space-between" mt={4}>
                        <Text
                            fontSize="md"
                            fontWeight="bold"
                            color={textPrimary}
                        >
                            {t('To')}
                        </Text>
                    </HStack>
                    <Box borderRadius="2xl" bg={cardBg} p={4}>
                        <VStack align="stretch" spacing={2} width="100%">
                            <HStack justify="space-between" alignItems="center">
                                <Input
                                    value={Number(outputAmount).toLocaleString(
                                        undefined,
                                        {
                                            maximumFractionDigits:
                                                Number(outputAmount) > 10000
                                                    ? 0
                                                    : 2,
                                        },
                                    )}
                                    readOnly
                                    variant="unstyled"
                                    fontSize="4xl"
                                    fontWeight="bold"
                                    data-testid="swap-output-amount"
                                    color={textPrimary}
                                />
                                {toTokenDisplay ? (
                                    <Button
                                        onClick={() =>
                                            setStep('select-to-token')
                                        }
                                        variant="outline"
                                        size="sm"
                                        borderRadius="full"
                                        px={6}
                                        color={textSecondary}
                                        borderColor={textSecondary}
                                        _hover={{
                                            bg: isDark
                                                ? 'whiteAlpha.300'
                                                : 'blackAlpha.300',
                                        }}
                                        leftIcon={
                                            toTokenDisplay.logoComponent ? (
                                                cloneElement(
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
                                                                color={
                                                                    textPrimary
                                                                }
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
                                            as={LuChevronDown}
                                            boxSize={5}
                                            color={textSecondary}
                                        />
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={() =>
                                            setStep('select-to-token')
                                        }
                                        variant="outline"
                                        size="sm"
                                        borderRadius="full"
                                        px={6}
                                        color={textSecondary}
                                        borderColor={textSecondary}
                                        _hover={{
                                            bg: isDark
                                                ? 'whiteAlpha.300'
                                                : 'blackAlpha.300',
                                            color: textTertiary,
                                        }}
                                    >
                                        {t('Select token')}
                                        <Icon
                                            as={LuChevronDown}
                                            boxSize={5}
                                            color={textSecondary}
                                        />
                                    </Button>
                                )}
                            </HStack>

                            <HStack
                                spacing={1}
                                fontSize="sm"
                                justifyContent={'space-between'}
                                color={textSecondary}
                            >
                                <HStack spacing={2} alignItems="center">
                                    <Text color={textSecondary}>
                                        ≈{' '}
                                        {formatCompactCurrency(
                                            toAmountFiatValue ?? 0,
                                            {
                                                currency: currentCurrency,
                                            },
                                        )}
                                    </Text>
                                </HStack>

                                {toTokenDisplay && (
                                    <Text
                                        noOfLines={1}
                                        overflow="hidden"
                                        textOverflow="ellipsis"
                                        fontSize="sm"
                                        fontWeight="medium"
                                        color={textSecondary}
                                    >
                                        {t('Balance')}:{' '}
                                        {Number(
                                            toTokenDisplay.balance ?? 0,
                                        ).toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                    </Text>
                                )}
                            </HStack>
                        </VStack>
                    </Box>

                    {/* Show More Section */}
                    <Collapse in={showMore && !!quote} animateOpacity>
                        <VStack
                            spacing={1}
                            align="stretch"
                            p={4}
                            borderRadius="2xl"
                            bg={cardBg}
                        >
                            {/* Source */}
                            {quote && (
                                <HStack justify="space-between">
                                    <Text fontSize="xs" color={textSecondary}>
                                        {t('Source')}:
                                    </Text>
                                    <Button
                                        variant="outline"
                                        size="xs"
                                        borderRadius="full"
                                        px={3}
                                        h="auto"
                                        py={1}
                                        cursor="pointer"
                                        onClick={() => setStep('select-quote')}
                                        color={textSecondary}
                                        borderColor={textSecondary}
                                        _hover={{
                                            bg: isDark
                                                ? 'whiteAlpha.300'
                                                : 'blackAlpha.300',
                                        }}
                                        leftIcon={quote.aggregator?.getIcon(
                                            '12px',
                                        )}
                                    >
                                        <Text fontSize="xs" color={textPrimary}>
                                            {quote.aggregatorName}
                                        </Text>
                                    </Button>
                                </HStack>
                            )}

                            {/* Slippage */}
                            <VStack align="stretch" spacing={2}>
                                <HStack justify="space-between">
                                    <Text fontSize="xs" color={textSecondary}>
                                        {t('Slippage tolerance')}:
                                    </Text>
                                    <Text
                                        fontSize="xs"
                                        fontWeight="medium"
                                        color={textPrimary}
                                    >
                                        {slippageTolerance}%
                                    </Text>
                                </HStack>

                                {/* Slippage Configuration */}
                                <VStack spacing={3} align="stretch" pt={2}>
                                    <HStack spacing={2}>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => {
                                                setSlippageTolerance(1);
                                            }}
                                            flex="0 0 auto"
                                            minW="60px"
                                            borderRadius="md"
                                            fontSize="xs"
                                            bg={
                                                isAutoMode
                                                    ? primaryButtonBg
                                                    : 'transparent'
                                            }
                                            color={
                                                isAutoMode
                                                    ? primaryButtonColor
                                                    : textSecondary
                                            }
                                            borderColor={
                                                isAutoMode
                                                    ? primaryButtonBg
                                                    : textSecondary
                                            }
                                            _hover={{
                                                bg: isAutoMode
                                                    ? primaryButtonBg
                                                    : isDark
                                                    ? 'whiteAlpha.300'
                                                    : 'blackAlpha.300',
                                                opacity: isAutoMode ? 0.8 : 1,
                                            }}
                                        >
                                            Auto
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => {
                                                setSlippageTolerance(0.5);
                                            }}
                                            flex="0 0 auto"
                                            minW="60px"
                                            borderRadius="md"
                                            fontSize="xs"
                                            bg={
                                                slippageTolerance === 0.5
                                                    ? primaryButtonBg
                                                    : 'transparent'
                                            }
                                            color={
                                                slippageTolerance === 0.5
                                                    ? primaryButtonColor
                                                    : textSecondary
                                            }
                                            borderColor={
                                                slippageTolerance === 0.5
                                                    ? primaryButtonBg
                                                    : textSecondary
                                            }
                                            _hover={{
                                                bg:
                                                    slippageTolerance === 0.5
                                                        ? primaryButtonBg
                                                        : isDark
                                                        ? 'whiteAlpha.300'
                                                        : 'blackAlpha.300',
                                                opacity:
                                                    slippageTolerance === 0.5
                                                        ? 0.8
                                                        : 1,
                                            }}
                                        >
                                            0.5%
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => {
                                                setSlippageTolerance(3);
                                            }}
                                            flex="0 0 auto"
                                            minW="60px"
                                            borderRadius="md"
                                            fontSize="xs"
                                            bg={
                                                slippageTolerance === 3
                                                    ? primaryButtonBg
                                                    : 'transparent'
                                            }
                                            color={
                                                slippageTolerance === 3
                                                    ? primaryButtonColor
                                                    : textSecondary
                                            }
                                            borderColor={
                                                slippageTolerance === 3
                                                    ? primaryButtonBg
                                                    : textSecondary
                                            }
                                            _hover={{
                                                bg:
                                                    slippageTolerance === 3
                                                        ? primaryButtonBg
                                                        : isDark
                                                        ? 'whiteAlpha.300'
                                                        : 'blackAlpha.300',
                                                opacity:
                                                    slippageTolerance === 3
                                                        ? 0.8
                                                        : 1,
                                            }}
                                        >
                                            3%
                                        </Button>
                                        <InputGroup size="sm" flex={1}>
                                            <Input
                                                value={customSlippageValue}
                                                onChange={(e) => {
                                                    const value =
                                                        e.target.value;
                                                    // Allow numbers and decimal point
                                                    if (
                                                        /^\d*\.?\d*$/.test(
                                                            value,
                                                        ) ||
                                                        value === ''
                                                    ) {
                                                        setCustomSlippageValue(
                                                            value,
                                                        );
                                                        if (value !== '') {
                                                            const numValue =
                                                                parseFloat(
                                                                    value,
                                                                );
                                                            if (
                                                                !isNaN(
                                                                    numValue,
                                                                ) &&
                                                                numValue >= 0 &&
                                                                numValue <= 100
                                                            ) {
                                                                setSlippageTolerance(
                                                                    numValue,
                                                                );
                                                            }
                                                        } else {
                                                            // Reset to default when cleared
                                                            setSlippageTolerance(
                                                                1,
                                                            );
                                                        }
                                                    }
                                                }}
                                                placeholder="1"
                                                borderRadius="md"
                                                textAlign="right"
                                                pr={8}
                                                fontSize="xs"
                                                color={textPrimary}
                                            />
                                            <InputRightElement
                                                width="2rem"
                                                pointerEvents="none"
                                            >
                                                <Text
                                                    fontSize="2xs"
                                                    color={textSecondary}
                                                >
                                                    %
                                                </Text>
                                            </InputRightElement>
                                        </InputGroup>
                                    </HStack>
                                </VStack>
                            </VStack>

                            {/* Gas Fee */}
                            <HStack justify="space-between">
                                <Text fontSize="xs" color={textSecondary}>
                                    {t('Fee')}:
                                </Text>
                                <Text
                                    fontSize="xs"
                                    fontWeight="medium"
                                    color={textPrimary}
                                >
                                    {gasCostVTHO > 0
                                        ? `${gasCostVTHO.toLocaleString(
                                              undefined,
                                              {
                                                  maximumFractionDigits: 2,
                                              },
                                          )} VTHO`
                                        : '-'}
                                </Text>
                            </HStack>
                        </VStack>
                    </Collapse>

                    {/* Show More Toggle - Always reserve space */}
                    {quote && (
                        <Box
                            minH="24px"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Button
                                variant="ghost"
                                size="xs"
                                onClick={() => setShowMore(!showMore)}
                                rightIcon={
                                    <Icon
                                        color={textTertiary}
                                        _hover={{
                                            color: textSecondary,
                                        }}
                                        as={showMore ? LuArrowUp : LuArrowDown}
                                    />
                                }
                                fontSize="xs"
                                fontWeight="light"
                                color={textTertiary}
                                _hover={{
                                    color: textSecondary,
                                }}
                            >
                                {showMore
                                    ? t('Hide')
                                    : t('Show Advanced Options')}
                            </Button>
                        </Box>
                    )}

                    {swapClauses.length > 0 &&
                        connection.isConnectedWithPrivy && (
                            <GasFeeSummary
                                estimation={gasEstimation}
                                isLoading={gasEstimationLoading}
                                isLoadingTransaction={isTransactionPending}
                                onTokenChange={handleGasTokenChange}
                                clauses={swapClauses}
                                userSelectedToken={userSelectedGasToken}
                            />
                        )}
                </VStack>
            </ModalBody>

            <ModalFooter>
                <TransactionButtonAndStatus
                    buttonText={
                        isLoadingQuote ? t('Loading quote...') : t('Swap')
                    }
                    onConfirm={executeSwap}
                    isSubmitting={isTransactionPending}
                    isTxWaitingConfirmation={isWaitingForWalletConfirmation}
                    transactionPendingText={t('Swapping...')}
                    txReceipt={txReceipt}
                    transactionError={txError}
                    onError={(errorMessage) => {
                        // Track error for analytics when displayed inline
                        handleSwapError(errorMessage);
                    }}
                    isDisabled={
                        !fromToken ||
                        !toToken ||
                        !amount ||
                        Number(amount) <= 0 ||
                        isLoadingQuote ||
                        !quote ||
                        quote?.reverted === true ||
                        Boolean(
                            fromTokenDisplay &&
                                amount &&
                                Number(amount) >
                                    Number(fromTokenDisplay.balance),
                        ) ||
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
