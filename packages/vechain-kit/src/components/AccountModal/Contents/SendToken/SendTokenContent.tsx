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
import { SelectTokenContent, Token } from './SelectTokenContent';
import { parseEther, ZeroAddress } from 'ethers';
import {
    compareAddresses,
    isValidAddress,
    TOKEN_LOGOS,
    TOKEN_LOGO_COMPONENTS,
} from '@/utils';
import { useVechainDomain } from '@vechain/dapp-kit-react';
import { useTranslation } from 'react-i18next';
import { useVeChainKitConfig } from '@/providers';
import { useForm } from 'react-hook-form';
import { Analytics } from '@/utils/mixpanelClientInstance';

const compactFormatter = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 2,
});

export type SendTokenContentProps = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    isNavigatingFromMain?: boolean;
    preselectedToken?: Token;
    onBack?: () => void;
};

// Add form values type
type FormValues = {
    amount: string;
    toAddressOrDomain: string;
};

export const SendTokenContent = ({
    setCurrentContent,
    isNavigatingFromMain = false,
    preselectedToken,
    onBack: parentOnBack = () => setCurrentContent('main'),
}: SendTokenContentProps) => {
    const { t } = useTranslation();
    const { darkMode: isDark } = useVeChainKitConfig();
    const [selectedToken, setSelectedToken] = useState<Token | null>(
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

    const {
        domain: resolvedDomain,
        address: resolvedAddress,
        isLoading: isLoadingDomain,
    } = useVechainDomain({ addressOrDomain: toAddressOrDomain });

    const handleSetMaxAmount = () => {
        if (selectedToken) {
            setValue('amount', selectedToken.numericBalance);
            Analytics.send.flow('amount', {
                tokenSymbol: selectedToken.symbol,
                amount: selectedToken.numericBalance,
            });
        }
    };

    const handleBack = () => {
        if (selectedToken) {
            Analytics.send.flow('review', {
                tokenSymbol: selectedToken.symbol,
                amount: amount || undefined,
                recipientAddress: toAddressOrDomain || undefined,
                error: 'User cancelled - back button',
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
                error: 'User cancelled - close modal',
            });
        }
    };

    const onSubmit = async (data: FormValues) => {
        if (!selectedToken) return;

        const isValidReceiver =
            !compareAddresses(resolvedAddress ?? ZeroAddress, ZeroAddress) ||
            isValidAddress(data.toAddressOrDomain);

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
            if (numericAmount > parseEther(selectedToken.numericBalance)) {
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
            recipientAddress: resolvedAddress || data.toAddressOrDomain,
            recipientType: resolvedDomain ? 'domain' : 'address',
        });

        setCurrentContent({
            type: 'send-token-summary',
            props: {
                toAddressOrDomain: data.toAddressOrDomain,
                resolvedDomain,
                resolvedAddress,
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
                                {errors.amount && (
                                    <Text color="#ef4444" fontSize="sm">
                                        {errors.amount.message}
                                    </Text>
                                )}
                            </FormControl>

                            {selectedToken && (
                                <HStack
                                    spacing={1}
                                    fontSize="sm"
                                    color={
                                        isDark
                                            ? 'whiteAlpha.700'
                                            : 'blackAlpha.700'
                                    }
                                >
                                    <Text>{t('Balance')}:</Text>
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
                                        {compactFormatter.format(
                                            Number(
                                                selectedToken.numericBalance,
                                            ),
                                        )}
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
                                        e.target.value = trimmed;
                                        setValue('toAddressOrDomain', trimmed, {
                                            shouldValidate: true,
                                        });
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
                                />
                                {errors.toAddressOrDomain && (
                                    <Text color="#ef4444" fontSize="sm">
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
                    isDisabled={!selectedToken || !isValid || isLoadingDomain}
                    onClick={handleSubmit(onSubmit)}
                >
                    {selectedToken ? t('Send') : t('Select Token')}
                </Button>
            </ModalFooter>
        </>
    );
};
