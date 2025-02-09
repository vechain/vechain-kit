import {
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    VStack,
    Button,
    Text,
    ModalFooter,
    useDisclosure,
} from '@chakra-ui/react';
import { ModalBackButton, StickyHeaderContainer } from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import { useTranslation } from 'react-i18next';
import { useVeChainKitConfig } from '@/providers';
import { getAvatarQueryKey, useWallet } from '@/hooks';
import { TransactionModal } from '@/components';
import { useUpdateAvatarRecord } from '@/hooks';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    avatarIpfsHash: string | null;
    displayName: string;
    description: string;
    twitter: string;
    website: string;
    email: string;
};

export const CustomizationSummaryContent = ({
    setCurrentContent,
    avatarIpfsHash,
    displayName,
    description,
    twitter,
    website,
    email,
}: Props) => {
    const { t } = useTranslation();
    const { darkMode: isDark } = useVeChainKitConfig();
    const { account } = useWallet();
    const transactionModal = useDisclosure();
    const [isProcessing, setIsProcessing] = useState(false);
    const queryClient = useQueryClient();

    const { updateAvatar, txReceipt, error } = useUpdateAvatarRecord({
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: getAvatarQueryKey(account?.domain ?? ''),
            });

            await queryClient.refetchQueries({
                queryKey: getAvatarQueryKey(account?.domain ?? ''),
            });

            transactionModal.onClose();

            setCurrentContent('settings');
        },
        onError: () => {
            setIsProcessing(false);
        },
    });

    const handleConfirm = async () => {
        try {
            setIsProcessing(true);
            transactionModal.onOpen();

            if (avatarIpfsHash) {
                await updateAvatar(
                    account?.domain ?? '',
                    'ipfs://' + avatarIpfsHash,
                );
            }

            // TODO: Add other profile updates here (displayName, description, etc.)
        } catch (error) {
            console.error('Error saving changes:', error);
            setIsProcessing(false);
        }
    };

    const renderField = (label: string, value: string) => {
        if (!value) return null;
        return (
            <VStack align="flex-start" w="full" spacing={1}>
                <Text
                    fontSize="sm"
                    color={isDark ? 'whiteAlpha.600' : 'gray.500'}
                >
                    {label}
                </Text>
                <Text fontSize="md">{value}</Text>
            </VStack>
        );
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
                    {t('Confirm Changes')}
                </ModalHeader>
                <ModalBackButton
                    onClick={() => setCurrentContent('account-customization')}
                />
                <ModalCloseButton />
            </StickyHeaderContainer>

            <ModalBody>
                <VStack spacing={4} align="stretch">
                    {avatarIpfsHash && (
                        <VStack align="flex-start" w="full" spacing={1}>
                            <Text
                                fontSize="sm"
                                color={isDark ? 'whiteAlpha.600' : 'gray.500'}
                            >
                                {t('Profile Image')}
                            </Text>
                            <Text fontSize="md">{t('New image selected')}</Text>
                        </VStack>
                    )}

                    {renderField(t('Display Name'), displayName)}
                    {renderField(t('Description'), description)}
                    {renderField(t('Twitter'), twitter)}
                    {renderField(t('Website'), website)}
                    {renderField(t('Email'), email)}
                </VStack>
            </ModalBody>

            <ModalFooter gap={4} w="full">
                {/* <Button
                    px={4}
                    width="full"
                    height="48px"
                    variant="outline"
                    borderRadius="xl"
                    onClick={() => setCurrentContent('account-customization')}
                >
                    {t('Back')}
                </Button> */}
                <Button
                    px={4}
                    width="full"
                    height="48px"
                    variant="solid"
                    borderRadius="xl"
                    colorScheme="blue"
                    onClick={handleConfirm}
                    isLoading={isProcessing}
                >
                    {t('Confirm')}
                </Button>
            </ModalFooter>

            <TransactionModal
                isOpen={transactionModal.isOpen}
                onClose={() => {
                    transactionModal.onClose();
                    setCurrentContent('settings');
                }}
                status={status}
                txId={txReceipt?.meta.txID}
                errorDescription={error?.reason ?? t('Unknown error')}
                showExplorerButton={true}
                showSocialButtons={true}
                showTryAgainButton={true}
                onTryAgain={handleConfirm}
            />
        </>
    );
};
