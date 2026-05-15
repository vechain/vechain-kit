import React from 'react';
import {
    AspectRatio,
    Box,
    Button,
    FormControl,
    HStack,
    Image,
    Input,
    ModalBody,
    ModalCloseButton,
    ModalFooter,
    ModalHeader,
    Skeleton,
    Text,
    VStack,
    useToken,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ens_normalize } from '@adraffy/ens-normalize';
import {
    ModalBackButton,
    StickyHeaderContainer,
} from '@/components/common';
import { useVechainDomain } from '@/hooks';
import { useAccountModalOptions } from '@/hooks/modals/useAccountModalOptions';
import { OwnedNft } from '@/hooks/api/nfts';
import { AccountModalContentTypes } from '../../Types';

export type SendNftContentProps = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    nft: OwnedNft;
    collectionName?: string;
    imageUrl?: string;
    initialToAddressOrDomain?: string;
    onBack?: () => void;
};

type FormValues = {
    toAddressOrDomain: string;
};

export const SendNftContent = ({
    setCurrentContent,
    nft,
    collectionName,
    imageUrl,
    initialToAddressOrDomain = '',
    onBack,
}: SendNftContentProps) => {
    const { t } = useTranslation();
    const { isolatedView } = useAccountModalOptions();

    const textPrimary = useToken('colors', 'vechain-kit-text-primary');
    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');
    const errorColor = useToken('colors', 'vechain-kit-error');
    const cardBg = useToken('colors', 'vechain-kit-card');

    const {
        register,
        watch,
        setValue,
        setError,
        formState: { errors, isValid },
        handleSubmit,
    } = useForm<FormValues>({
        defaultValues: {
            toAddressOrDomain: initialToAddressOrDomain,
        },
        mode: 'onChange',
    });

    const { toAddressOrDomain } = watch();
    const { data: resolvedDomainData, isLoading } =
        useVechainDomain(toAddressOrDomain);

    const handleBack = () => {
        if (onBack) onBack();
        else setCurrentContent('assets');
    };

    const onSubmit = (data: FormValues) => {
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

        setCurrentContent({
            type: 'send-nft-summary',
            props: {
                setCurrentContent,
                nft,
                collectionName,
                imageUrl,
                toAddressOrDomain: data.toAddressOrDomain,
                resolvedDomain: resolvedDomainData?.domain,
                resolvedAddress: resolvedDomainData?.address,
            },
        });
    };

    const displayName = `${collectionName ?? 'NFT'} #${nft.tokenId}`;

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader>{t('Send NFT')}</ModalHeader>
                {!isolatedView && <ModalBackButton onClick={handleBack} />}
                <ModalCloseButton />
            </StickyHeaderContainer>

            <ModalBody>
                <VStack spacing={4} align="stretch" w="full">
                    <HStack spacing={3} bg={cardBg} p={3} borderRadius="xl">
                        <Box w="64px" flexShrink={0}>
                            <AspectRatio ratio={1} w="64px">
                                {imageUrl ? (
                                    <Image
                                        src={imageUrl}
                                        alt={displayName}
                                        objectFit="cover"
                                        borderRadius="md"
                                        fallback={
                                            <Skeleton borderRadius="md" />
                                        }
                                    />
                                ) : (
                                    <Skeleton borderRadius="md" />
                                )}
                            </AspectRatio>
                        </Box>
                        <VStack spacing={0} align="stretch" flex={1}>
                            <Text
                                fontWeight="600"
                                color={textPrimary}
                                noOfLines={1}
                            >
                                {displayName}
                            </Text>
                            <Text fontSize="sm" color={textSecondary}>
                                #{nft.tokenId}
                            </Text>
                        </VStack>
                    </HStack>

                    <Text fontSize="md" fontWeight="bold" color={textPrimary}>
                        {t('To')}
                    </Text>
                    <Box borderRadius="2xl" bg={cardBg}>
                        <VStack align="stretch" spacing={2} p={4} width="100%">
                            <FormControl
                                isInvalid={!!errors.toAddressOrDomain}
                            >
                                <Input
                                    {...register('toAddressOrDomain', {
                                        required: t('Address is required'),
                                    })}
                                    onChange={(e) => {
                                        const trimmed = e.target.value.trim();
                                        const normalizedValue =
                                            trimmed.includes('.')
                                                ? ens_normalize(trimmed)
                                                : trimmed;
                                        e.target.value = normalizedValue;
                                        setValue(
                                            'toAddressOrDomain',
                                            normalizedValue,
                                            { shouldValidate: true },
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
                                />
                                {errors.toAddressOrDomain && (
                                    <Text color={errorColor} fontSize="sm">
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
                    isDisabled={!isValid}
                    isLoading={isLoading}
                    onClick={handleSubmit(onSubmit)}
                >
                    {t('Send')}
                </Button>
            </ModalFooter>
        </>
    );
};
