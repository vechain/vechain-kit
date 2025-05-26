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
    Center,
    Icon,
    ModalFooter,
    Image,
    FormControl,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { ModalBackButton, StickyHeaderContainer } from '@/components';
import { AccountModalContentTypes } from '../../Types';
import { FiArrowDown } from 'react-icons/fi';
import { SelectTokenContent } from './SelectTokenContent';
import { parseEther } from 'ethers';
import { TOKEN_LOGOS, TOKEN_LOGO_COMPONENTS } from '@/utils';
import { useTranslation } from 'react-i18next';
import { useVeChainKitConfig } from '@/providers';
import { useForm } from 'react-hook-form';
import { Analytics } from '@/utils/mixpanelClientInstance';
import { useVechainDomain, TokenWithValue } from '@/hooks';
import { useCurrency } from '@/hooks';
import { formatCompactCurrency } from '@/utils/currencyUtils';
import { ens_normalize } from '@adraffy/ens-normalize';

export type SendTokenContentProps = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    isNavigatingFromMain?: boolean;
    preselectedToken?: TokenWithValue;
    onBack?: () => void;
};

// Add form values type
type FormValues = {
    amount: string;
    toAddressOrDomain: string;
};

export const SendTokenContent = ({
    setCurrentContent,
    isNavigatingFromMain = true,
    preselectedToken,
    onBack: parentOnBack = () => setCurrentContent('main'),
}: SendTokenContentProps) => {
    const { t } = useTranslation();
    const { darkMode: isDark } = useVeChainKitConfig();
    const { currentCurrency } = useCurrency();
    const [selectedToken, setSelectedToken] = useState<TokenWithValue | null>(
        preselectedToken ?? null,
    );
    const [isSelectingToken, setIsSelectingToken] = useState(
        isNavigatingFromMain && !preselectedToken,
    );
    const [isInitialTokenSelection, setIsInitialTokenSelection] =
        useState(isNavigatingFromMain);

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
            amount: '',
            toAddressOrDomain: '',
        },
        mode: 'onChange',
    });

    // Watch form values
    const { toAddressOrDomain, amount } = watch();

    useEffect(() => {
        if (selectedToken && amount) {
            Analytics.send.flow('amount', {
                tokenSymbol: selectedToken.symbol,
                amount,
            });
        }
    }, [amount, selectedToken]);

    useEffect(() => {
        if (selectedToken && toAddressOrDomain) {
            Analytics.send.flow('recipient', {
                tokenSymbol: selectedToken.symbol,
                recipientAddress: toAddressOrDomain,
                recipientType: toAddressOrDomain.includes('.')
                    ? 'domain'
                    : 'address',
            });
        }
    }, [toAddressOrDomain, selectedToken]);

    const { data: resolvedDomainData, isLoading } =
        useVechainDomain(toAddressOrDomain);

    const handleSetMaxAmount = () => {
        if (selectedToken) {
            setValue('amount', selectedToken.balance);
            Analytics.send.flow('amount', {
                tokenSymbol: selectedToken.symbol,
                amount: selectedToken.balance,
            });
        }
    };

    const handleBack = () => {
        if (selectedToken) {
            Analytics.send.flow('review', {
                tokenSymbol: selectedToken.symbol,
                amount: amount || undefined,
                recipientAddress: toAddressOrDomain || undefined,
                error: 'back_button',
                isError: false,
            });
        }
        parentOnBack();
    };

    const handleClose = () => {
        if (selectedToken) {
            Analytics.send.flow('review', {
                tokenSymbol: selectedToken.symbol,
                amount: amount || undefined,
                recipientAddress: toAddressOrDomain || undefined,
                error: 'modal_closed',
                isError: false,
            });
        }
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
            Analytics.send.flow('review', {
                tokenSymbol: selectedToken.symbol,
                error: 'Invalid address or domain',
            });
            return;
        }

        // Validate amount
        if (selectedToken) {
            const numericAmount = parseEther(data.amount);
            if (numericAmount > parseEther(selectedToken.balance)) {
                setError('amount', {
                    type: 'manual',
                    message: t(`Insufficient {{symbol}} balance`, {
                        symbol: selectedToken.symbol,
                    }),
                });
                Analytics.send.flow('review', {
                    tokenSymbol: selectedToken.symbol,
                    error: 'Insufficient balance',
                });
                return;
            }
        }

        Analytics.send.flow('review', {
            tokenSymbol: selectedToken.symbol,
            amount: data.amount,
            recipientAddress:
                resolvedDomainData?.address || data.toAddressOrDomain,
            recipientType: resolvedDomainData?.domain ? 'domain' : 'address',
        });

        setCurrentContent({
            type: 'send-token-summary',
            props: {
                toAddressOrDomain: data.toAddressOrDomain,
                resolvedDomain: resolvedDomainData?.domain,
                resolvedAddress: resolvedDomainData?.address,
                amount: data.amount,
                selectedToken,
                setCurrentContent,
            },
        });
    };

    if (isSelectingToken) {
        return (
            <SelectTokenContent
                setCurrentContent={setCurrentContent}
                onSelectToken={(token) => {
                    Analytics.send.tokenPageViewed(token.symbol);
                    setSelectedToken(token);
                    setIsSelectingToken(false);
                    setIsInitialTokenSelection(false);
                }}
                onBack={() => {
                    if (isInitialTokenSelection) {
                        if (selectedToken) {
                            Analytics.send.flow('token_select', {
                                tokenSymbol: selectedToken.symbol,
                                error: 'User cancelled - back to main',
                            });
                        }
                        setCurrentContent('main');
                    } else {
                        if (selectedToken) {
                            Analytics.send.flow('token_select', {
                                tokenSymbol: selectedToken.symbol,
                                error: 'User cancelled - back to form',
                            });
                        }
                        setIsSelectingToken(false);
                    }
                }}
            />
        );
    }

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader>{t('Send')}</ModalHeader>
                <ModalBackButton onClick={handleBack} />
                <ModalCloseButton onClick={handleClose} />
            </StickyHeaderContainer>

            <ModalBody>
                <VStack spacing={1} align="stretch" position="relative">
                    <Box
                        p={6}
                        borderRadius="xl"
                        bg={isDark ? '#00000038' : 'gray.50'}
                    >
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
                                                return (
                                                    !isNaN(numericValue) ||
                                                    t(
                                                        'Please enter a valid number',
                                                    )
                                                );
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
                                    />

                                    {selectedToken ? (
                                        <Button
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
                                        </Button>
                                    ) : (
                                        <Button
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
                                            onClick={() =>
                                                setIsSelectingToken(true)
                                            }
                                        >
                                            {t('Select token')}
                                        </Button>
                                    )}
                                </HStack>
                                {selectedToken && (
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
                                        <Text opacity={0.5}>
                                            ≈{' '}
                                            {formatCompactCurrency(
                                                Number(amount) *
                                                    selectedToken.priceUsd,
                                                currentCurrency,
                                            )}
                                        </Text>
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
                                            {t('Send all')}
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
                    >
                        <Icon
                            as={FiArrowDown}
                            boxSize={5}
                            opacity={0.5}
                            color={isDark ? 'whiteAlpha.700' : 'gray.600'}
                        />
                    </Center>

                    <Box
                        borderRadius="xl"
                        bg={isDark ? '#00000038' : 'gray.50'}
                    >
                        <VStack align="stretch" spacing={2} p={6} width="100%">
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
                                    variant="unstyled"
                                    data-testid="tx-address-input"
                                />
                                {errors.toAddressOrDomain && (
                                    <Text
                                        color="#ef4444"
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
