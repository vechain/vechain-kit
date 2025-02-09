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
    IconButton,
    InputGroup,
    InputLeftElement,
} from '@chakra-ui/react';
import { ModalBackButton, StickyHeaderContainer } from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import { useTranslation } from 'react-i18next';
import { useVeChainKitConfig } from '@/providers';
import { getAvatarQueryKey, useWallet } from '@/hooks';
import { MdOutlineNavigateNext, MdPhotoCamera } from 'react-icons/md';
import { ActionButton } from '../../Components';
import { useSingleImageUpload } from '@/hooks/api/ipfs';
import { useUpdateAvatarRecord } from '@/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { uploadBlobToIPFS } from '@/utils/ipfs';
import {
    FaRegAddressCard,
    FaTwitter,
    FaEnvelope,
    FaGlobe,
} from 'react-icons/fa';
import { AccountAvatar } from '@/components/common';
import { picasso } from '@vechain/picasso';
import { DomainRequiredAlert } from '../../Components/Alerts';

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
};

export const AccountCustomizationContent = ({ setCurrentContent }: Props) => {
    const { t } = useTranslation();
    const { network, darkMode: isDark } = useVeChainKitConfig();
    const { account } = useWallet();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const queryClient = useQueryClient();
    const { onUpload } = useSingleImageUpload({
        compressImage: true,
    });
    const [description, setDescription] = useState('');
    const [twitter, setTwitter] = useState('');
    const [email, setEmail] = useState('');
    const coverInputRef = useRef<HTMLInputElement>(null);
    const [displayName, setDisplayName] = useState('');
    const [website, setWebsite] = useState('');
    const hasDomain = !!account?.domain;

    const { updateAvatar } = useUpdateAvatarRecord({
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: getAvatarQueryKey(account?.domain ?? ''),
            });

            await queryClient.refetchQueries({
                queryKey: getAvatarQueryKey(account?.domain ?? ''),
            });

            setIsProcessing(false);
        },
        onError: () => {
            setIsProcessing(false);
        },
    });

    const handleImageUpload = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setIsUploading(true);
            setIsProcessing(true);
            const uploadedImage = await onUpload(file);
            if (!uploadedImage) throw new Error('Failed to compress image');

            const ipfsHash = await uploadBlobToIPFS(
                uploadedImage.file,
                file.name,
                network.type,
            );
            await updateAvatar(account?.domain ?? '', 'ipfs://' + ipfsHash);
        } catch (error) {
            console.error('Error uploading image:', error);
            setIsProcessing(false);
        } finally {
            setIsUploading(false);
        }
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
                    {t('Customize Account')}
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
                        {hasDomain && (
                            <IconButton
                                aria-label="Update cover"
                                icon={<MdPhotoCamera />}
                                size="sm"
                                position="absolute"
                                right="2"
                                bottom="2"
                                onClick={() => coverInputRef.current?.click()}
                            />
                        )}
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
                        {isUploading ||
                            (isProcessing && (
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
                            ))}
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
                                    value={displayName}
                                    onChange={(e) =>
                                        setDisplayName(e.target.value)
                                    }
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
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                    placeholder={t('Eg: DevRel @ ENS Labs')}
                                    maxLength={200}
                                />
                            </FormControl>

                            <FormControl isDisabled={!hasDomain}>
                                <FormLabel>Social Links</FormLabel>
                                <VStack spacing={3}>
                                    <InputGroup>
                                        <InputLeftElement>
                                            <Icon as={FaTwitter} />
                                        </InputLeftElement>
                                        <Input
                                            value={twitter}
                                            onChange={(e) =>
                                                setTwitter(e.target.value)
                                            }
                                            placeholder={t('Twitter username')}
                                        />
                                    </InputGroup>
                                    <InputGroup>
                                        <InputLeftElement>
                                            <Icon as={FaGlobe} />
                                        </InputLeftElement>
                                        <Input
                                            value={website}
                                            onChange={(e) =>
                                                setWebsite(e.target.value)
                                            }
                                            placeholder={t('Website URL')}
                                            type="url"
                                        />
                                    </InputGroup>
                                    <InputGroup>
                                        <InputLeftElement>
                                            <Icon as={FaEnvelope} />
                                        </InputLeftElement>
                                        <Input
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
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
            <ModalFooter w="full">
                <Button
                    px={4}
                    width="full"
                    height="60px"
                    variant="solid"
                    borderRadius="xl"
                    colorScheme="blue"
                    onClick={() => setCurrentContent('settings')}
                    isDisabled={!hasDomain}
                >
                    {t('Save Changes')}
                </Button>
            </ModalFooter>
        </>
    );
};
