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
    FormControl,
    Image,
    IconButton,
    useToken,
} from '@chakra-ui/react';
import { ModalBackButton, StickyHeaderContainer } from '@/components';
import { AccountModalContentTypes } from '../../Types';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { useCustomTokens } from '@/hooks/api/wallet/useCustomTokens';
import { humanAddress, TOKEN_LOGOS } from '@/utils';
import { LuPlus, LuTrash2 } from 'react-icons/lu';

export type ManageCustomTokenContentProps = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
};

// Add form values type
type FormValues = {
    newTokenAddress: string;
};

export const ManageCustomTokenContent = ({
    setCurrentContent,
}: ManageCustomTokenContentProps) => {
    const { t } = useTranslation();

    const textPrimary = useToken('colors', 'vechain-kit-text-primary');
    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');
    const backgroundCard = useToken('colors', 'vechain-kit-card');
    const backgroundOverlay = useToken('colors', 'vechain-kit-overlay');

    const {
        addToken,
        removeToken,
        isTokenIncluded,
        isDefaultToken,
        customTokens,
    } = useCustomTokens();

    // Form setup with validation rules
    const {
        register,
        setError,
        setValue,
        formState: { errors, isValid },
        handleSubmit,
    } = useForm<FormValues>({
        defaultValues: {
            newTokenAddress: '',
        },
        mode: 'onChange',
    });

    const onSubmit = async (data: FormValues) => {
        if (!data.newTokenAddress) return;

        if (
            isTokenIncluded(data.newTokenAddress) ||
            isDefaultToken(data.newTokenAddress)
        ) {
            return setError('newTokenAddress', {
                type: 'manual',
                message: t('Token already added'),
            });
        }

        try {
            await addToken(data.newTokenAddress);
            setValue('newTokenAddress', ''); // Clear the input after successful addition
        } catch (error) {
            console.error('Error adding token:', error);
            setError('newTokenAddress', {
                type: 'manual',
                message: t('Invalid token address'),
            });
        }
    };

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader>{t('Manage Custom Tokens')}</ModalHeader>
                <ModalBackButton onClick={() => setCurrentContent('assets')} />
                <ModalCloseButton />
            </StickyHeaderContainer>

            <ModalBody>
                <VStack spacing={4} align="stretch">
                    {/* Input Section */}
                    <Box p={4} borderRadius="xl" bg={backgroundCard}>
                        <VStack align="stretch" spacing={3}>
                            <Text fontSize="sm" color={textSecondary}>
                                {t(
                                    'Paste a token contract address to track its balance in your wallet.',
                                )}
                            </Text>
                            <FormControl isInvalid={!!errors.newTokenAddress}>
                                <HStack spacing={2}>
                                    <Input
                                        {...register('newTokenAddress', {
                                            required: t('Address is required'),
                                            pattern: {
                                                value: /^0x[a-fA-F0-9]{40}$/,
                                                message: t(
                                                    'Please enter a valid contract address',
                                                ),
                                            },
                                            validate: (value) =>
                                                /^0x[a-fA-F0-9]{40}$/.test(
                                                    value,
                                                ) ||
                                                t('Invalid contract address'),
                                        })}
                                        onChange={(e) => {
                                            const trimmed =
                                                e.target.value.trim();
                                            e.target.value = trimmed;
                                            setValue(
                                                'newTokenAddress',
                                                trimmed,
                                                { shouldValidate: true },
                                            );
                                        }}
                                        placeholder="0x..."
                                        variant="outline"
                                        fontSize="md"
                                        fontWeight="medium"
                                        flex={1}
                                    />
                                    <IconButton
                                        aria-label={t('Add Token')}
                                        icon={<LuPlus />}
                                        variant="vechainKitPrimary"
                                        size="md"
                                        minW="40px"
                                        w="40px"
                                        h="40px"
                                        borderRadius="lg"
                                        isDisabled={!isValid}
                                        onClick={handleSubmit(onSubmit)}
                                    />
                                </HStack>
                                {errors.newTokenAddress && (
                                    <Text
                                        color="#ef4444"
                                        fontSize="sm"
                                        mt={1}
                                    >
                                        {errors.newTokenAddress.message}
                                    </Text>
                                )}
                            </FormControl>
                        </VStack>
                    </Box>

                    {/* Existing Tokens List */}
                    <Box>
                        <Text
                            fontSize="sm"
                            fontWeight="medium"
                            color={textSecondary}
                            mb={2}
                            px={1}
                        >
                            {t('Existing Custom Tokens')}
                        </Text>
                        {customTokens.length > 0 ? (
                            <VStack align="stretch" spacing={2}>
                                {customTokens.map((token) => (
                                    <HStack
                                        key={token.address}
                                        justify="space-between"
                                        fontSize="sm"
                                        p={3}
                                        borderRadius="xl"
                                        bg={backgroundOverlay}
                                    >
                                        <HStack spacing={3}>
                                            <Image
                                                src={TOKEN_LOGOS[token?.symbol]}
                                                alt={`${token.symbol} logo`}
                                                boxSize="28px"
                                                borderRadius="full"
                                                fallback={
                                                    <Box
                                                        boxSize="28px"
                                                        borderRadius="full"
                                                        bg="whiteAlpha.200"
                                                        display="flex"
                                                        alignItems="center"
                                                        justifyContent="center"
                                                    >
                                                        <Text
                                                            fontSize="9px"
                                                            fontWeight="bold"
                                                            color={textPrimary}
                                                        >
                                                            {token.symbol?.slice(
                                                                0,
                                                                3,
                                                            )}
                                                        </Text>
                                                    </Box>
                                                }
                                            />
                                            <VStack
                                                spacing={0}
                                                align="start"
                                            >
                                                <Text
                                                    fontWeight="medium"
                                                    color={textPrimary}
                                                    fontSize="sm"
                                                >
                                                    {token.symbol ?? 'Unknown'}
                                                </Text>
                                                <Text
                                                    color={textSecondary}
                                                    fontSize="xs"
                                                >
                                                    {humanAddress(
                                                        token.address ?? '',
                                                        6,
                                                        4,
                                                    )}
                                                </Text>
                                            </VStack>
                                        </HStack>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            color={textSecondary}
                                            borderRadius="md"
                                            p={2}
                                            onClick={() =>
                                                removeToken(token.address)
                                            }
                                        >
                                            <LuTrash2 size={16} />
                                        </Button>
                                    </HStack>
                                ))}
                            </VStack>
                        ) : (
                            <Box
                                p={6}
                                borderRadius="xl"
                                bg={backgroundOverlay}
                                textAlign="center"
                            >
                                <Text
                                    fontSize="sm"
                                    color={textSecondary}
                                >
                                    {t('No custom tokens added yet.')}
                                </Text>
                            </Box>
                        )}
                    </Box>
                </VStack>
            </ModalBody>
        </>
    );
};
