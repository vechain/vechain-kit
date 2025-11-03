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
    Divider,
    Badge,
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

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
};

type SwapStep = 'main' | 'select-from-token' | 'select-to-token' | 'select-quote';

export const SwapTokenContent = ({ setCurrentContent }: Props) => {
    const { t } = useTranslation();
    const { account } = useWallet();
    const { currentCurrency } = useCurrency();
    const { darkMode: isDark, network } = useVeChainKitConfig();
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

        setCurrentContent({
            type: 'successful-operation',
            props: {
                setCurrentContent,
                txId,
                title: t('Transaction successful'),
                onDone: () => {
                    setCurrentContent('main');
                },
                showSocialButtons: true,
            },
        });
    }, [fromToken, toToken, amount, quote, txReceipt, setCurrentContent, t]);

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
                            <HStack spacing={2} align="flex-start">
                                <Box display="flex" alignItems="center" height="fit-content">
                                    <Button
                                        onClick={() => setStep('select-from-token')}
                                        variant="outline"
                                        size="sm"
                                        borderRadius="full"
                                        flexShrink={0}
                                        flexGrow={0}
                                        whiteSpace="nowrap"
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
                                            fromTokenDisplay ? (
                                                fromTokenDisplay.logoComponent ? (
                                                    React.cloneElement(
                                                        fromTokenDisplay.logoComponent,
                                                        { boxSize: '20px', borderRadius: 'full' },
                                                    )
                                                ) : fromTokenDisplay.logoUrl ? (
                                                    <Image
                                                        src={fromTokenDisplay.logoUrl}
                                                        alt={`${fromTokenDisplay.symbol} logo`}
                                                        boxSize="20px"
                                                        borderRadius="full"
                                                    />
                                                ) : undefined
                                            ) : undefined
                                        }
                                        rightIcon={
                                            <Icon
                                                as={MdKeyboardArrowDown}
                                                boxSize={5}
                                                color={
                                                    isDark
                                                        ? 'whiteAlpha.600'
                                                        : 'blackAlpha.600'
                                                }
                                            />
                                        }
                                    >
                                        {fromTokenDisplay?.symbol ?? t('Select Token')}
                                    </Button>
                                </Box>
                                <VStack align="flex-start" spacing={1} flex={1} position="relative" top={-2}>
                                    <Box display="flex" alignItems="center" height="fit-content" width="100%" justifyContent="flex-end">
                                        <InputGroup size="lg">
                                            <Input
                                                placeholder="0"
                                                value={amount}
                                                onChange={(e) => handleAmountChange(e.target.value)}
                                                fontSize="4xl"
                                                fontWeight="bold"
                                                textAlign="right"
                                                variant="unstyled"
                                                _focus={{ border: 'none' }}
                                                color={
                                                    fromTokenDisplay && amount && Number(amount) > Number(fromTokenDisplay.balance)
                                                        ? 'red.500'
                                                        : undefined
                                                }
                                            />
                                        </InputGroup>
                                    </Box>
                                    {fromTokenDisplay && (
                                        <HStack spacing={2} justify="flex-end" width="100%">
                                            <Text
                                                fontSize="xs"
                                                color={isDark ? 'whiteAlpha.600' : 'blackAlpha.600'}
                                                textAlign="right"
                                                whiteSpace="nowrap"
                                                cursor="pointer"
                                                onClick={handleSetMaxAmount}
                                                _hover={{
                                                    color: isDark ? 'whiteAlpha.800' : 'blackAlpha.800',
                                                    textDecoration: 'underline',
                                                }}
                                            >
                                                {Number(fromTokenDisplay.balance).toLocaleString(undefined, {
                                                    maximumFractionDigits: 2,
                                                })} {fromTokenDisplay.symbol}
                                            </Text>
                                            {fromTokenDisplay.value > 0 && (
                                                <Text fontSize="xs" color={isDark ? 'whiteAlpha.600' : 'blackAlpha.600'} textAlign="right" whiteSpace="nowrap">
                                                    ≈ {formatCompactCurrency(
                                                        fromTokenDisplay.value,
                                                        { currency: currentCurrency },
                                                    )}
                                                </Text>
                                            )}
                                        </HStack>
                                    )}
                                </VStack>
                            </HStack>
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
                            p={4}
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
                            <HStack spacing={2} align="flex-start">
                                <Box display="flex" alignItems="center" height="fit-content">
                                    <Button
                                        onClick={() => setStep('select-to-token')}
                                        variant="outline"
                                        size="sm"
                                        borderRadius="full"
                                        flexShrink={0}
                                        flexGrow={0}
                                        whiteSpace="nowrap"
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
                                            toTokenDisplay ? (
                                                toTokenDisplay.logoComponent ? (
                                                    React.cloneElement(
                                                        toTokenDisplay.logoComponent,
                                                        { boxSize: '20px', borderRadius: 'full' },
                                                    )
                                                ) : toTokenDisplay.logoUrl ? (
                                                    <Image
                                                        src={toTokenDisplay.logoUrl}
                                                        alt={`${toTokenDisplay.symbol} logo`}
                                                        boxSize="20px"
                                                        borderRadius="full"
                                                    />
                                                ) : undefined
                                            ) : undefined
                                        }
                                        rightIcon={
                                            <Icon
                                                as={MdKeyboardArrowDown}
                                                boxSize={5}
                                                color={
                                                    isDark
                                                        ? 'whiteAlpha.600'
                                                        : 'blackAlpha.600'
                                                }
                                            />
                                        }
                                    >
                                        {toTokenDisplay?.symbol ?? t('Select Token')}
                                    </Button>
                                </Box>
                                <VStack align="flex-start" spacing={1} flex={1} paddingEnd={2} position="relative" top={-2}>
                                    <Box display="flex" alignItems="center" height="fit-content" width="100%" justifyContent="flex-end">
                                        <Text
                                            fontSize="4xl"
                                            fontWeight="bold"
                                            textAlign="right"
                                            whiteSpace="nowrap"
                                        >
                                            {isLoadingQuote ? (
                                                <Spinner size="sm" />
                                            ) : (
                                                Number(outputAmount).toLocaleString(undefined, {
                                                    maximumFractionDigits: Number(outputAmount) > 10000 ? 0 : 2,
                                                })
                                            )}
                                        </Text>
                                    </Box>
                                    {toTokenDisplay && (
                                        <HStack spacing={2} justify="flex-end" width="100%">
                                            <Text fontSize="xs" color={isDark ? 'whiteAlpha.600' : 'blackAlpha.600'} textAlign="right" whiteSpace="nowrap">
                                                {Number(toTokenDisplay.balance).toLocaleString(undefined, {
                                                    maximumFractionDigits: 2,
                                                })} {toTokenDisplay.symbol}
                                            </Text>
                                        </HStack>
                                    )}
                                </VStack>
                            </HStack>
                        </Box>

                        {/* Show More Section */}
                        <Collapse in={showMore} animateOpacity>
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
                        Boolean(fromTokenDisplay && amount && Number(amount) > Number(fromTokenDisplay.balance))
                    }
                    context="transaction"
                />
            </ModalFooter>
        </>
    );
};
