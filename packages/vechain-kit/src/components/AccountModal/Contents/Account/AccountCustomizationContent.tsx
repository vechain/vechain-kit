import {
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    VStack,
    Text,
    Button,
} from '@chakra-ui/react';
import { ModalBackButton, StickyHeaderContainer } from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import { useTranslation } from 'react-i18next';
import { useVeChainKitConfig } from '@/providers';
import { getAvatarQueryKey, useWallet } from '@/hooks';
import { MdOutlineNavigateNext } from 'react-icons/md';
import { ActionButton } from '../../Components';
import { PiAddressBook } from 'react-icons/pi';
import { useSingleImageUpload } from '@/hooks/api/ipfs';
import { useUpdateAvatarRecord } from '@/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { uploadBlobToIPFS } from '@/utils/ipfs';

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
    const [showFullText, setShowFullText] = useState(false);
    const queryClient = useQueryClient();
    const { onUpload } = useSingleImageUpload({
        compressImage: true,
    });

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
                <VStack spacing={3} align="center">
                    <VStack
                        spacing={3}
                        w={'full'}
                        justifyContent={'flex-start'}
                        alignItems={'flex-start'}
                    >
                        <Text fontSize={'sm'} opacity={0.5}>
                            {t(
                                'Customize your account with a unique .vet domain name and profile image to enhance your identity across VeChain applications.',
                            )}
                        </Text>

                        {showFullText && (
                            <>
                                <Text fontSize={'sm'} opacity={0.5}>
                                    {t(
                                        'Your customizations are linked to your .vet domain name, making them portable across different applications.',
                                    )}
                                </Text>
                                <Text fontSize={'sm'} opacity={0.5}>
                                    {t(
                                        'To get started with customization, first secure your .vet domain name. Once you have a domain, you can add a profile image that will be visible wherever you use your account.',
                                    )}
                                </Text>
                                <Text fontSize={'sm'} opacity={0.5}>
                                    {t(
                                        'Changing your domain name will update also your profile image.',
                                    )}
                                </Text>
                            </>
                        )}

                        <Button
                            mt={0}
                            variant="link"
                            size="sm"
                            onClick={() => setShowFullText(!showFullText)}
                            color="blue.500"
                            textAlign="left"
                        >
                            {t(showFullText ? 'Show Less' : 'Read More')}
                        </Button>
                    </VStack>

                    <ActionButton
                        style={{
                            mt: 3,
                        }}
                        title={
                            account?.domain
                                ? account?.domain
                                : t('Choose account name')
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
                        leftIcon={PiAddressBook}
                        rightIcon={MdOutlineNavigateNext}
                    />

                    <ActionButton
                        title={t('Update profile image')}
                        description={t(
                            !account?.domain
                                ? 'You can change your profile image only after you setup your domain name.'
                                : 'Customize your account by adding a profile image, which will be displayed on the apps you use.',
                        )}
                        onClick={() => fileInputRef.current?.click()}
                        leftImage={account?.image}
                        isLoading={isUploading || isProcessing}
                        isDisabled={!account?.domain}
                        loadingText={
                            isUploading
                                ? t('Uploading image')
                                : t('Setting image')
                        }
                    />

                    <input
                        type="file"
                        ref={fileInputRef}
                        hidden
                        accept="image/*"
                        onChange={async (event) =>
                            await handleImageUpload(event)
                        }
                    />
                </VStack>
            </ModalBody>
        </>
    );
};
