import {
    ModalBody,
    ModalHeader,
    VStack,
    Text,
    Button,
    Box,
    ModalFooter,
    Icon,
    Input,
    Textarea,
    FormControl,
    FormLabel,
    useToken,
} from '@chakra-ui/react';
import {
    ModalBackButton,
    StickyHeaderContainer,
    ModalCloseButton,
} from '@/components/common';
import { useTranslation } from 'react-i18next';
import { useVeChainKitConfig } from '@/providers';
import { useWallet } from '@/hooks';
import { LuChevronRight, LuCamera, LuSquareUser } from 'react-icons/lu';
import { ActionButton } from '../../../Components';
import { useSingleImageUpload } from '@/hooks/api/ipfs';
import { useRef, useState, useEffect, useMemo } from 'react';
import { uploadBlobToIPFS } from '@/utils/ipfs';
import { AccountAvatar } from '@/components/common';
import { DomainRequiredAlert } from '../../../Components/Alerts';
import { AccountModalContentTypes } from '../../../Types';
import { useForm } from 'react-hook-form';

// Update FormValues type to include validation
type FormValues = {
    displayName: string;
    description: string;
};

export type AccountCustomizationContentProps = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    initialContentSource?: AccountModalContentTypes;
};

export const CustomizationContent = ({
    setCurrentContent,
    initialContentSource = 'profile',
}: AccountCustomizationContentProps) => {
    const { t } = useTranslation();
    const { network } = useVeChainKitConfig();
    const { account } = useWallet();

    const textPrimary = useToken('colors', 'vechain-kit-text-primary');
    const errorColor = useToken('colors', 'vechain-kit-error');
    const cardBg = useToken('colors', 'vechain-kit-card');

    const fileInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const { onUpload } = useSingleImageUpload({
        compressImage: true,
    });

    const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
    const [avatarIpfsHash, setAvatarIpfsHash] = useState<string | null>(null);
    const hasDomain = !!account?.domain;

    // Add these state variables for initial values
    const [initialAvatarHash, setInitialAvatarHash] = useState<string | null>(
        null,
    );
    const [initialDisplayName, setInitialDisplayName] = useState('');
    const [initialDescription, setInitialDescription] = useState('');

    // Update form initialization with validation rules
    const {
        register,
        watch,
        formState: { errors, isValid },
    } = useForm<FormValues>({
        defaultValues: {
            displayName: account?.metadata?.display || '',
            description: account?.metadata?.description || '',
        },
        mode: 'onChange',
    });

    // Update effect to reset image when domain changes
    useEffect(() => {
        if (account?.metadata) {
            const metadata = account.metadata;
            setInitialDisplayName(metadata.display || '');
            setInitialDescription(metadata.description || '');
            setInitialAvatarHash(
                account.image ? account.image.replace('ipfs://', '') : null,
            );

            // Only set the preview URL if it hasn't been set yet
            setPreviewImageUrl((prev) => prev ?? account.image ?? null);
        }
    }, [account, network.type]);

    // Watch all form values for changes
    const formValues = watch();

    const handleImageUpload = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setIsUploading(true);

            // Clear the previous preview URL first
            if (previewImageUrl) {
                URL.revokeObjectURL(previewImageUrl);
            }

            // Create temporary preview URL
            const newPreviewUrl = URL.createObjectURL(file);
            setPreviewImageUrl(newPreviewUrl);

            const uploadedImage = await onUpload(file);
            if (!uploadedImage) throw new Error('Failed to compress image');

            const ipfsHash = await uploadBlobToIPFS(
                uploadedImage.file,
                file.name,
                network.type,
            );
            setAvatarIpfsHash(ipfsHash);
        } catch (error) {
            console.error('Error uploading image:', error);
            setPreviewImageUrl(null);
        } finally {
            setIsUploading(false);
        }
    };

    // This cleanup effect is important for memory management in the browser. Here's why:
    // When you create a URL using URL.createObjectURL() (which happens in the handleImageUpload function),
    // the browser creates a unique URL that points to the file/blob in memory.
    // This URL remains valid and the object remains in memory until explicitly revoked.
    // If you don't revoke these URLs, you can create memory leaks,
    // especially if users upload multiple images or the component remounts frequently.
    useEffect(() => {
        return () => {
            if (previewImageUrl) {
                URL.revokeObjectURL(previewImageUrl);
            }
        };
    }, [previewImageUrl]);

    // Update getChangedValues to use form values
    const getChangedValues = () => {
        const changes: {
            avatarIpfsHash?: string;
            displayName?: string;
            description?: string;
        } = {};

        if (avatarIpfsHash !== initialAvatarHash && avatarIpfsHash)
            changes.avatarIpfsHash = avatarIpfsHash;
        if (formValues.displayName !== initialDisplayName)
            changes.displayName = formValues.displayName;
        if (formValues.description !== initialDescription)
            changes.description = formValues.description;
        return changes;
    };

    // Add this function to check if there are any changes
    const hasChanges = useMemo(() => {
        const changes = getChangedValues();
        return Object.keys(changes).length > 0;
    }, [getChangedValues]);

    const handleSaveChanges = () => {
        setCurrentContent({
            type: 'account-customization-summary',
            props: {
                setCurrentContent,
                changes: getChangedValues(),
                onDoneRedirectContent: initialContentSource,
            },
        });
    };

    const handleBack = () => {
        setCurrentContent(initialContentSource);
    };

    return (
        <Box>
            <StickyHeaderContainer>
                <ModalHeader data-testid="modal-title">
                    {t('Customization')}
                </ModalHeader>
                <ModalBackButton onClick={handleBack} />
                <ModalCloseButton />
            </StickyHeaderContainer>

            <ModalBody>
                <Box
                    cursor={hasDomain ? 'pointer' : 'default'}
                    pt={2}
                    display="flex"
                    justifyContent="center"
                    position="relative"
                    onClick={() => hasDomain && fileInputRef.current?.click()}
                >
                    <AccountAvatar
                        wallet={account}
                        props={{
                            width: '100px',
                            height: '100px',
                            boxShadow: '0px 0px 3px 2px #00000024',
                            src: previewImageUrl ?? undefined,
                        }}
                    />
                    {hasDomain && (
                        <Icon
                            as={LuCamera}
                            position="absolute"
                            top="80px"
                            left="60%"
                            bg={cardBg}
                            color={textPrimary}
                            p="1"
                            borderRadius="full"
                            boxSize="6"
                        />
                    )}
                    {isUploading && (
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            backgroundColor="rgba(0, 0, 0, 0.5)"
                            position="absolute"
                            transform="translateX(0%)"
                            width="100px"
                            height="100px"
                            borderRadius="full"
                            zIndex={10}
                        >
                            <Text fontSize="xs" color="white">
                                {isUploading ? 'Uploading...' : 'Processing...'}
                            </Text>
                        </Box>
                    )}
                </Box>

                <VStack spacing={6} mt={4}>
                    {!hasDomain && <DomainRequiredAlert />}

                    <ActionButton
                        title={account?.domain ?? t('Choose account name')}
                        description={t(
                            'Choose a unique .vet domain name for your account.',
                        )}
                        onClick={() => {
                            if (account?.domain) {
                                setCurrentContent({
                                    type: 'choose-name-search',
                                    props: {
                                        name: '',
                                        setCurrentContent,
                                        initialContentSource: {
                                            type: 'account-customization',
                                            props: {
                                                setCurrentContent,
                                            },
                                        },
                                    },
                                });
                            } else {
                                setCurrentContent({
                                    type: 'choose-name',
                                    props: {
                                        setCurrentContent,
                                        initialContentSource: {
                                            type: 'account-customization',
                                            props: {
                                                setCurrentContent,
                                            },
                                        },
                                        onBack: () =>
                                            setCurrentContent({
                                                type: 'account-customization',
                                                props: {
                                                    setCurrentContent,
                                                },
                                            }),
                                    },
                                });
                            }
                        }}
                        leftIcon={LuSquareUser}
                        rightIcon={LuChevronRight}
                        dataTestId="set-domain-name-button"
                    />

                    <FormControl
                        isDisabled={!hasDomain}
                        isInvalid={!!errors.displayName}
                    >
                        <FormLabel
                            fontSize="sm"
                            fontWeight="medium"
                            color={textPrimary}
                        >
                            {t('Display Name')}
                        </FormLabel>
                        <Input
                            {...register('displayName', {
                                maxLength: {
                                    value: 25,
                                    message: t(
                                        'Display name must be less than 25 characters',
                                    ),
                                },
                            })}
                            placeholder={
                                !hasDomain
                                    ? t('Set a domain first')
                                    : t('Enter your display name')
                            }
                            fontWeight="medium"
                            color={textPrimary}
                            data-testid="display-name-input"
                        />
                        {errors.displayName && (
                            <Text
                                color={errorColor}
                                fontSize="sm"
                                mt={1}
                                fontWeight="medium"
                            >
                                {errors.displayName.message}
                            </Text>
                        )}
                    </FormControl>

                    <FormControl
                        isDisabled={!hasDomain}
                        isInvalid={!!errors.description}
                    >
                        <FormLabel
                            fontSize="sm"
                            fontWeight="medium"
                            color={textPrimary}
                        >
                            {t('Description')}
                        </FormLabel>
                        <Textarea
                            {...register('description', {
                                maxLength: {
                                    value: 100,
                                    message: t(
                                        'Description must be less than 100 characters',
                                    ),
                                },
                            })}
                            placeholder={t('Eg: DevRel @ ENS Labs')}
                            fontWeight="medium"
                            color={textPrimary}
                            data-testid="description-input"
                            minH="50px"
                        />
                        {errors.description && (
                            <Text
                                color={errorColor}
                                mt={1}
                                fontSize="sm"
                                fontWeight="medium"
                            >
                                {errors.description.message}
                            </Text>
                        )}
                    </FormControl>
                </VStack>

                <input
                    type="file"
                    ref={fileInputRef}
                    hidden
                    accept="image/*"
                    onChange={async (event) => await handleImageUpload(event)}
                />
                <input
                    type="file"
                    ref={coverInputRef}
                    hidden
                    accept="image/*"
                    onChange={async (event) => {
                        /* Add cover upload handler */
                        event.preventDefault();
                    }}
                />
            </ModalBody>

            <ModalFooter w="full">
                <Button
                    variant="vechainKitPrimary"
                    onClick={handleSaveChanges}
                    isDisabled={!hasDomain || !hasChanges || !isValid}
                    isLoading={isUploading}
                    loadingText={t('Preparing changes...')}
                    data-testid="save-changes-button"
                >
                    {t('Save Changes')}
                </Button>
            </ModalFooter>
        </Box>
    );
};
