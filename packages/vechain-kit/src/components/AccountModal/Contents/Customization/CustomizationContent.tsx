import {
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    VStack,
    Text,
    Button,
    Card,
    CardBody,
    Box,
    ModalFooter,
    Icon,
    Input,
    Textarea,
    FormControl,
    FormLabel,
    InputGroup,
    InputLeftElement,
} from '@chakra-ui/react';
import {
    ModalBackButton,
    StickyFooterContainer,
    StickyHeaderContainer,
} from '@/components/common';
import { useTranslation } from 'react-i18next';
import { useVeChainKitConfig } from '@/providers';
import { useWallet } from '@/hooks';
import { MdOutlineNavigateNext, MdPhotoCamera } from 'react-icons/md';
import { ActionButton } from '../../Components';
import { useSingleImageUpload } from '@/hooks/api/ipfs';
import { useRef, useState, useEffect, useMemo } from 'react';
import { uploadBlobToIPFS } from '@/utils/ipfs';
import { FaRegAddressCard, FaEnvelope, FaGlobe } from 'react-icons/fa';
import { AccountAvatar } from '@/components/common';
import { picasso } from '@vechain/picasso';
import { DomainRequiredAlert } from '../../Components/Alerts';
import { convertUriToUrl } from '@/utils/uri';
import { AccountModalContentTypes } from '../../Types';
import { useForm } from 'react-hook-form';
import { FaXTwitter } from 'react-icons/fa6';

// Add FormValues type
type FormValues = {
    displayName: string;
    description: string;
    twitter: string;
    email: string;
    website: string;
};

export const CustomizationContent = ({
    setCurrentContent,
}: {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
}) => {
    const { t } = useTranslation();
    const { network, darkMode: isDark } = useVeChainKitConfig();
    const { account } = useWallet();
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
    const [initialTwitter, setInitialTwitter] = useState('');
    const [initialWebsite, setInitialWebsite] = useState('');
    const [initialEmail, setInitialEmail] = useState('');

    // Initialize form with account metadata
    const { register, watch } = useForm<FormValues>({
        defaultValues: {
            displayName: account?.metadata?.display || '',
            description: account?.metadata?.description || '',
            twitter: account?.metadata?.['com.x'] || '',
            email: account?.metadata?.email || '',
            website: account?.metadata?.url || '',
        },
    });

    // Set initial values for comparison
    useEffect(() => {
        if (account?.metadata) {
            const metadata = account.metadata;
            setInitialDisplayName(metadata.display || '');
            setInitialDescription(metadata.description || '');
            setInitialTwitter(metadata['com.x'] || '');
            setInitialEmail(metadata.email || '');
            setInitialWebsite(metadata.url || '');
            setInitialAvatarHash(
                metadata.avatar ? metadata.avatar.replace('ipfs://', '') : null,
            );
            setPreviewImageUrl(
                convertUriToUrl(metadata.avatar ?? '', network.type) || null,
            );
        }
    }, [account?.metadata, network.type]);

    // Watch all form values for changes
    const formValues = watch();

    const handleImageUpload = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setIsUploading(true);

            // Create temporary preview URL
            setPreviewImageUrl(URL.createObjectURL(file));

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
            twitter?: string;
            website?: string;
            email?: string;
        } = {};

        if (avatarIpfsHash !== initialAvatarHash && avatarIpfsHash)
            changes.avatarIpfsHash = avatarIpfsHash;
        if (formValues.displayName !== initialDisplayName)
            changes.displayName = formValues.displayName;
        if (formValues.description !== initialDescription)
            changes.description = formValues.description;
        if (formValues.twitter !== initialTwitter)
            changes.twitter = formValues.twitter;
        if (formValues.website !== initialWebsite)
            changes.website = formValues.website;
        if (formValues.email !== initialEmail) changes.email = formValues.email;
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
            },
        });
    };

    return (
        <Box>
            <StickyHeaderContainer>
                <ModalHeader
                    fontSize={'md'}
                    fontWeight={'500'}
                    textAlign={'center'}
                    color={isDark ? '#dfdfdd' : '#4d4d4d'}
                >
                    {t('Customization')}
                </ModalHeader>
                <ModalBackButton
                    onClick={() => setCurrentContent('settings')}
                />
                <ModalCloseButton />
            </StickyHeaderContainer>

            <ModalBody>
                <Card
                    bg={isDark ? 'whiteAlpha.100' : '#00000005'}
                    borderRadius="xl"
                    width="full"
                    position="relative"
                    overflow="visible"
                >
                    <Box
                        p={0}
                        backgroundSize="100% !important"
                        backgroundPosition="center"
                        position="relative"
                        h="80px"
                        background={`no-repeat url('data:image/svg+xml;utf8,${picasso(
                            account?.address ?? '',
                        )}')`}
                        w="100%"
                        borderRadius="14px 14px 0 0"
                    >
                        {/* For now we don't allow cover image upload */}
                        {/* {hasDomain && (
                            <IconButton
                                aria-label="Update cover"
                                icon={<MdPhotoCamera />}
                                size="sm"
                                position="absolute"
                                right="2"
                                bottom="2"
                                onClick={() => coverInputRef.current?.click()}
                            />
                        )} */}
                    </Box>
                    <Box
                        position="absolute"
                        top="30px"
                        left="50%"
                        transform="translateX(-50%)"
                        cursor={hasDomain ? 'pointer' : 'default'}
                        onClick={() =>
                            hasDomain && fileInputRef.current?.click()
                        }
                    >
                        <AccountAvatar
                            wallet={account}
                            props={{
                                width: '100px',
                                height: '100px',
                                boxShadow: '0px 0px 3px 2px #00000024',
                                src: previewImageUrl || undefined,
                            }}
                        />
                        {hasDomain && (
                            <Icon
                                as={MdPhotoCamera}
                                position="absolute"
                                right="2"
                                bottom="2"
                                bg="gray.700"
                                color="white"
                                p="1"
                                borderRadius="full"
                                boxSize="6"
                            />
                        )}
                        {isUploading && (
                            <Box
                                position="absolute"
                                top="0"
                                left="0"
                                right="0"
                                bottom="0"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                backgroundColor="rgba(0, 0, 0, 0.5)"
                                borderRadius="full"
                            >
                                <Text fontSize="xs" color="white">
                                    {isUploading
                                        ? 'Uploading...'
                                        : 'Processing...'}
                                </Text>
                            </Box>
                        )}
                    </Box>

                    <CardBody
                        pt="14"
                        pb="6"
                        w="full"
                        backgroundColor={'none'}
                        border={'none'}
                    >
                        <VStack spacing={6} mt={4}>
                            {!hasDomain && <DomainRequiredAlert />}

                            <ActionButton
                                title={
                                    account?.domain ?? t('Choose account name')
                                }
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
                                            },
                                        });
                                    } else {
                                        setCurrentContent('choose-name');
                                    }
                                }}
                                leftIcon={FaRegAddressCard}
                                rightIcon={MdOutlineNavigateNext}
                            />

                            <FormControl isDisabled={!hasDomain}>
                                <FormLabel>Display Name</FormLabel>
                                <Input
                                    {...register('displayName')}
                                    placeholder={
                                        !hasDomain
                                            ? t('Set a domain first')
                                            : t('Enter your display name')
                                    }
                                />
                            </FormControl>

                            <FormControl isDisabled={!hasDomain}>
                                <FormLabel>Description</FormLabel>
                                <Textarea
                                    {...register('description')}
                                    placeholder={t('Eg: DevRel @ ENS Labs')}
                                    maxLength={200}
                                />
                            </FormControl>

                            <FormControl isDisabled={!hasDomain}>
                                <FormLabel>Social Links</FormLabel>
                                <VStack spacing={3}>
                                    <InputGroup>
                                        <InputLeftElement>
                                            <Icon as={FaXTwitter} />
                                        </InputLeftElement>
                                        <Input
                                            {...register('twitter')}
                                            placeholder={t('Twitter username')}
                                        />
                                    </InputGroup>
                                    <InputGroup>
                                        <InputLeftElement>
                                            <Icon as={FaGlobe} />
                                        </InputLeftElement>
                                        <Input
                                            {...register('website')}
                                            placeholder={t('Website URL')}
                                            type="url"
                                        />
                                    </InputGroup>
                                    <InputGroup>
                                        <InputLeftElement>
                                            <Icon as={FaEnvelope} />
                                        </InputLeftElement>
                                        <Input
                                            {...register('email')}
                                            placeholder={t('Email address')}
                                            type="email"
                                        />
                                    </InputGroup>
                                </VStack>
                            </FormControl>
                        </VStack>
                    </CardBody>
                </Card>

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

            <StickyFooterContainer>
                <ModalFooter w="full" p={0}>
                    <Button
                        px={4}
                        width="full"
                        height="60px"
                        variant="solid"
                        borderRadius="xl"
                        colorScheme="blue"
                        onClick={handleSaveChanges}
                        isDisabled={!hasDomain || !hasChanges}
                        isLoading={isUploading}
                        loadingText={t('Preparing changes...')}
                    >
                        {t('Save Changes')}
                    </Button>
                </ModalFooter>
            </StickyFooterContainer>
        </Box>
    );
};
