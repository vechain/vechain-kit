import React from 'react';
import {
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    VStack,
    Input,
    Button,
    Text,
    Box,
    HStack,
    Icon,
    ModalFooter,
    Image,
    FormControl,
    useToken,
} from '@chakra-ui/react';
import { useState, useEffect, useMemo, useRef } from 'react';
import { ModalBackButton, StickyHeaderContainer } from '@/components';
import { AccountModalContentTypes } from '../../Types';
import { LuChevronDown } from 'react-icons/lu';
import { SelectTokenContent } from './SelectTokenContent';
import { parseEther } from 'ethers';
import { TOKEN_LOGOS, TOKEN_LOGO_COMPONENTS } from '@/utils';
import { useTranslation } from 'react-i18next';
import { useVeChainKitConfig } from '@/providers';
import { useForm } from 'react-hook-form';
import {
    useVechainDomain,
    TokenWithValue,
    useTokensWithValues,
    useWallet,
} from '@/hooks';
import { useCurrency, useTokenPrices } from '@/hooks';
import {
    formatCompactCurrency,
    SupportedCurrency,
    convertToSelectedCurrency,
} from '@/utils/currencyUtils';
import { ens_normalize } from '@adraffy/ens-normalize';
import { useAccountModalOptions } from '@/hooks/modals/useAccountModalOptions';

export type SendTokenContentProps = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    preselectedToken?: TokenWithValue;
    initialAmount?: string;
    initialToAddressOrDomain?: string;
    onBack?: () => void;
};

// Add form values type
type FormValues = {
    amount: string;
    toAddressOrDomain: string;
};

export const SendTokenContent = ({
    setCurrentContent,
    preselectedToken,
    initialAmount = '',
    initialToAddressOrDomain = '',
    onBack: parentOnBack = () => setCurrentContent('main'),
}: SendTokenContentProps) => {
    const { t } = useTranslation();
    const { darkMode: isDark, feeDelegation } = useVeChainKitConfig();
    const { currentCurrency } = useCurrency();

    const textPrimary = useToken('colors', 'vechain-kit-text-primary');
    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');
    const textTertiary = useToken('colors', 'vechain-kit-text-tertiary');
    const errorColor = useToken('colors', 'vechain-kit-error');
    const cardBg = useToken('colors', 'vechain-kit-card');

    const { exchangeRates } = useTokenPrices();
    const { account } = useWallet();
    const { isolatedView } = useAccountModalOptions();
    const { tokensWithBalance } = useTokensWithValues({
        address: account?.address ?? '',
    });

    const [selectedToken, setSelectedToken] = useState<TokenWithValue | null>(
        preselectedToken ?? tokensWithBalance[0] ?? null,
    );
    const [isSelectingToken, setIsSelectingToken] = useState(false);

    // Set first token with balance as default when tokens load
    useEffect(() => {
        if (
            !preselectedToken &&
            !selectedToken &&
            tokensWithBalance.length > 0
        ) {
            setSelectedToken(tokensWithBalance[0]);
        }
    }, [tokensWithBalance, preselectedToken, selectedToken]);

    // Form setup with validation rules
    const {
        register,
        watch,
        setValue,
        setError,
        formState: { errors, isValid },
        handleSubmit,
    } = useForm<FormValues>({
        defaultValues: {
            amount: initialAmount,
            toAddressOrDomain: initialToAddressOrDomain,
        },
        mode: 'onChange',
    });

    // Watch form values
    const { toAddressOrDomain, amount } = watch();

    // Track previous token to detect changes
    const prevTokenRef = useRef<TokenWithValue | null>(selectedToken);

    // Reset amount when token changes
    useEffect(() => {
        if (
            prevTokenRef.current &&
            selectedToken &&
            prevTokenRef.current.address !== selectedToken.address
        ) {
            setValue('amount', '');
        }
        prevTokenRef.current = selectedToken;
    }, [selectedToken, setValue]);

    const formattedValue = useMemo(() => {
        if (selectedToken) {
            return formatCompactCurrency(
                convertToSelectedCurrency(
                    Number(amount) * selectedToken.priceUsd,
                    currentCurrency as SupportedCurrency,
                    exchangeRates,
                ),
                { currency: currentCurrency as SupportedCurrency },
            );
        }
        return '';
    }, [amount, selectedToken, currentCurrency, exchangeRates]);

    const { data: resolvedDomainData, isLoading } =
        useVechainDomain(toAddressOrDomain);

    const handleSetMaxAmount = () => {
        if (selectedToken) {
            setValue('amount', selectedToken.balance);
        }
    };

    const handleBack = () => {
        parentOnBack();
    };

    const onSubmit = async (data: FormValues) => {
        if (!selectedToken) return;

        // Validation:
        // - Address is valid
        // - There is no domain attached to the address or (if it is attached) the returned domain is the primary domain
        const isValidReceiver =
            resolvedDomainData?.isValidAddressOrDomain &&
            (!resolvedDomainData?.domain ||
                (resolvedDomainData?.domain &&
                    resolvedDomainData?.isPrimaryDomain));

        if (!isValidReceiver) {
            setError('toAddressOrDomain', {
                type: 'manual',
                message: t('Invalid address or domain'),
            });
            return;
        }

        // Validate amount
        if (selectedToken) {
            const numericAmount = parseEther(data.amount);

            // Enforce minimum for B3TR (precise wei comparison)
            const minB3tr = feeDelegation?.b3trTransfers?.minAmountInEther;
            if (
                selectedToken.symbol === 'B3TR' &&
                typeof minB3tr === 'number' &&
                minB3tr > 0
            ) {
                try {
                    const minWei = parseEther(String(minB3tr));
                    if (numericAmount < minWei) {
                        setError('amount', {
                            type: 'manual',
                            message: t(
                                'Minimum {{symbol}} transfer is {{min}}',
                                {
                                    symbol: selectedToken.symbol,
                                    min: minB3tr,
                                },
                            ),
                        });
                        return;
                    }
                } catch {
                    // ignore parse error and continue
                }
            }

            if (numericAmount > parseEther(selectedToken.balance)) {
                setError('amount', {
                    type: 'manual',
                    message: t(`Insufficient {{symbol}} balance`, {
                        symbol: selectedToken.symbol,
                    }),
                });
                return;
            }
        }
        setCurrentContent({
            type: 'send-token-summary',
            props: {
                toAddressOrDomain: data.toAddressOrDomain,
                resolvedDomain: resolvedDomainData?.domain,
                resolvedAddress: resolvedDomainData?.address,
                amount: data.amount,
                selectedToken,
                formattedTotalAmount: formattedValue,
                setCurrentContent,
            },
        });
    };

    if (isSelectingToken) {
        return (
            <SelectTokenContent
                setCurrentContent={setCurrentContent}
                onSelectToken={(token) => {
                    setSelectedToken(token);
                    setIsSelectingToken(false);
                }}
                onBack={() => {
                    setIsSelectingToken(false);
                }}
            />
        );
    }

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader>{t('Send')}</ModalHeader>
                {!isolatedView && <ModalBackButton onClick={handleBack} />}
                <ModalCloseButton />
            </StickyHeaderContainer>

            <ModalBody>
                <VStack spacing={2} align="stretch" position="relative">
                    <HStack justify="space-between">
                        <Text
                            fontSize="md"
                            fontWeight="bold"
                            color={textPrimary}
                        >
                            {t('Amount')}
                        </Text>

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
                            {Number(selectedToken?.balance ?? 0).toLocaleString(
                                undefined,
                                {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                },
                            )}
                        </Text>
                    </HStack>

                    <Box p={4} borderRadius="2xl" bg={cardBg}>
                        <VStack align="stretch" spacing={2}>
                            <FormControl isInvalid={!!errors.amount}>
                                <HStack justify="space-between">
                                    <Input
                                        {...register('amount', {
                                            required: t('Amount is required'),
                                            pattern: {
                                                value: /^\d*\.?\d*$/,
                                                message: t(
                                                    'Please enter a valid number',
                                                ),
                                            },
                                            validate: (value) => {
                                                if (!value) return true;
                                                const numericValue =
                                                    parseFloat(value);
                                                if (isNaN(numericValue)) {
                                                    return t(
                                                        'Please enter a valid number',
                                                    );
                                                }

                                                // Enforce minimum amount for B3TR (in ether units)
                                                const minB3tr =
                                                    feeDelegation?.b3trTransfers
                                                        ?.minAmountInEther;
                                                if (
                                                    selectedToken?.symbol ===
                                                        'B3TR' &&
                                                    typeof minB3tr ===
                                                        'number' &&
                                                    minB3tr > 0 &&
                                                    numericValue < minB3tr
                                                ) {
                                                    return t(
                                                        'Minimum {{symbol}} transfer is {{min}}',
                                                        {
                                                            symbol: selectedToken.symbol,
                                                            min: minB3tr,
                                                        },
                                                    );
                                                }

                                                return true;
                                            },
                                        })}
                                        onChange={(e) => {
                                            const trimmed =
                                                e.target.value.trim();
                                            e.target.value = trimmed;
                                            setValue('amount', trimmed, {
                                                shouldValidate: true,
                                            });
                                        }}
                                        placeholder="0"
                                        variant="unstyled"
                                        fontSize="4xl"
                                        fontWeight="bold"
                                        data-testid="tx-amount-input"
                                        type="number"
                                        inputMode="decimal"
                                        color={textPrimary}
                                    />

                                    {selectedToken ? (
                                        <Button
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
                                            onClick={() =>
                                                setIsSelectingToken(true)
                                            }
                                            leftIcon={
                                                TOKEN_LOGO_COMPONENTS[
                                                    selectedToken.symbol
                                                ] ? (
                                                    React.cloneElement(
                                                        TOKEN_LOGO_COMPONENTS[
                                                            selectedToken.symbol
                                                        ],
                                                        {
                                                            boxSize: '20px',
                                                            borderRadius:
                                                                'full',
                                                        },
                                                    )
                                                ) : (
                                                    <Image
                                                        src={
                                                            TOKEN_LOGOS[
                                                                selectedToken
                                                                    .symbol
                                                            ]
                                                        }
                                                        alt={`${selectedToken.symbol} logo`}
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
                                                                    {selectedToken.symbol.slice(
                                                                        0,
                                                                        3,
                                                                    )}
                                                                </Text>
                                                            </Box>
                                                        }
                                                    />
                                                )
                                            }
                                        >
                                            {selectedToken.symbol}

                                            <Icon
                                                as={LuChevronDown}
                                                boxSize={5}
                                                color={textSecondary}
                                            />
                                        </Button>
                                    ) : (
                                        <Button
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
                                            onClick={() =>
                                                setIsSelectingToken(true)
                                            }
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
                                {selectedToken && (
                                    <HStack
                                        spacing={1}
                                        fontSize="sm"
                                        justifyContent={'space-between'}
                                        color={textSecondary}
                                    >
                                        <Text color={textSecondary}>
                                            ≈ {formattedValue}
                                        </Text>
                                    </HStack>
                                )}
                                {errors.amount && (
                                    <Text
                                        color="#ef4444"
                                        fontSize="sm"
                                        mt={1}
                                        data-testid="amount-error-msg"
                                    >
                                        {errors.amount.message}
                                    </Text>
                                )}
                            </FormControl>
                        </VStack>
                    </Box>

                    <HStack justify="space-between" mt={2}>
                        <Text
                            fontSize="md"
                            fontWeight="bold"
                            color={textPrimary}
                        >
                            {t('To')}
                        </Text>
                    </HStack>
                    <Box borderRadius="2xl" bg={cardBg}>
                        <VStack align="stretch" spacing={2} p={4} width="100%">
                            <FormControl isInvalid={!!errors.toAddressOrDomain}>
                                <Input
                                    {...register('toAddressOrDomain', {
                                        required: t('Address is required'),
                                    })}
                                    onChange={(e) => {
                                        const trimmed = e.target.value.trim();
                                        // If the input contains a dot, treat it as a domain name and normalize it
                                        const normalizedValue =
                                            trimmed.includes('.')
                                                ? ens_normalize(trimmed)
                                                : trimmed;
                                        e.target.value = normalizedValue;
                                        setValue(
                                            'toAddressOrDomain',
                                            normalizedValue,
                                            {
                                                shouldValidate: true,
                                            },
                                        );
                                    }}
                                    placeholder={t(
                                        'Type the receiver address or domain',
                                    )}
                                    _placeholder={{
                                        fontSize: 'md',
                                        fontWeight: 'normal',
                                    }}
                                    fontSize="lg"
                                    fontWeight="bold"
                                    color={textPrimary}
                                    variant="unstyled"
                                    data-testid="tx-address-input"
                                />
                                {errors.toAddressOrDomain && (
                                    <Text
                                        color={errorColor}
                                        fontSize="sm"
                                        data-testid="address-error-msg"
                                    >
                                        {errors.toAddressOrDomain.message}
                                    </Text>
                                )}
                            </FormControl>
                        </VStack>
                    </Box>
                </VStack>
            </ModalBody>

            <ModalFooter>
                <Button
                    variant="vechainKitPrimary"
                    isDisabled={!selectedToken || !isValid}
                    isLoading={isLoading}
                    onClick={handleSubmit(onSubmit)}
                    data-testid="send-button"
                >
                    {selectedToken ? t('Send') : t('Select Token')}
                </Button>
            </ModalFooter>
        </>
    );
};
