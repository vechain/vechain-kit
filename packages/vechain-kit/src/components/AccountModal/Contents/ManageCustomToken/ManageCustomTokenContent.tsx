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
    ModalFooter,
    FormControl,
    FormLabel,
    Image,
} from '@chakra-ui/react';
import { ModalBackButton, StickyHeaderContainer } from '@/components';
import { AccountModalContentTypes } from '../../Types';
import { useTranslation } from 'react-i18next';
import { useVeChainKitConfig } from '@/providers';
import { useForm } from 'react-hook-form';
import { useCustomTokens } from '@/hooks/api/wallet/useCustomTokens';
import { humanAddress, TOKEN_LOGOS } from '@/utils';
import { IoTrashBin } from 'react-icons/io5';

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
    const { darkMode: isDark } = useVeChainKitConfig();
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

        addToken(data.newTokenAddress);
    };

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader
                    fontSize={'md'}
                    fontWeight={'500'}
                    textAlign={'center'}
                    color={isDark ? '#dfdfdd' : '#4d4d4d'}
                >
                    {t('Manage Custom Tokens')}
                </ModalHeader>
                <ModalBackButton onClick={() => setCurrentContent('main')} />
                <ModalCloseButton />
            </StickyHeaderContainer>

            <ModalBody>
                <VStack spacing={4} align="stretch" position="relative">
                    {/* Input Section */}
                    <Box
                        p={6}
                        borderRadius="xl"
                        bg={isDark ? '#1a1a1a' : 'gray.50'}
                    >
                        <VStack align="stretch" spacing={2}>
                            <FormControl isInvalid={!!errors.newTokenAddress}>
                                <FormLabel fontSize="sm" fontWeight="medium">
                                    {t('Token Contract Address')}
                                </FormLabel>
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
                                            /^0x[a-fA-F0-9]{40}$/.test(value) ||
                                            t('Invalid contract address'),
                                    })}
                                    onChange={(e) => {
                                        const trimmed = e.target.value.trim();
                                        e.target.value = trimmed;
                                        setValue('newTokenAddress', trimmed, {
                                            shouldValidate: true,
                                        });
                                    }}
                                    placeholder="0x..."
                                    variant="outline"
                                    fontSize="md"
                                    fontWeight="medium"
                                />
                                {errors.newTokenAddress && (
                                    <Text color="red.500" fontSize="sm">
                                        {errors.newTokenAddress.message}
                                    </Text>
                                )}
                            </FormControl>
                        </VStack>
                    </Box>

                    {/* Existing Tokens List */}
                    {customTokens.length > 0 && (
                        <Box
                            p={4}
                            borderRadius="xl"
                            bg={isDark ? '#ffffff0f' : 'gray.50'}
                        >
                            <Text fontSize="sm" fontWeight="medium" mb={2}>
                                {t('Existing Custom Tokens')}
                            </Text>
                            <VStack align="stretch" spacing={2}>
                                {customTokens.map((token) => (
                                    <HStack
                                        key={token.address}
                                        justify="space-between"
                                        fontSize="sm"
                                        p={2}
                                        borderRadius="md"
                                        bg={isDark ? '#2a2a2a' : 'gray.100'}
                                    >
                                        <HStack>
                                            <Image
                                                src={TOKEN_LOGOS[token?.symbol]}
                                                alt={`${token.symbol} logo`}
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
                                                            {token.symbol?.slice(
                                                                0,
                                                                3,
                                                            )}
                                                        </Text>
                                                    </Box>
                                                }
                                            />
                                            <Text fontWeight="medium">
                                                {token.symbol ?? 'Unknown'}
                                            </Text>
                                        </HStack>
                                        <Text opacity={0.7}>
                                            {humanAddress(
                                                token.address ?? '',
                                                4,
                                                4,
                                            )}
                                        </Text>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            colorScheme="red"
                                            borderRadius="md"
                                            p={2}
                                            onClick={() =>
                                                removeToken(token.address)
                                            }
                                        >
                                            <IoTrashBin size={16} />
                                        </Button>
                                    </HStack>
                                ))}
                            </VStack>
                        </Box>
                    )}
                </VStack>
            </ModalBody>

            <ModalFooter>
                <Button
                    variant="vechainKitSecondary"
                    isDisabled={!isValid}
                    onClick={handleSubmit(onSubmit)}
                >
                    {t('Add Token')}
                </Button>
            </ModalFooter>
        </>
    );
};
