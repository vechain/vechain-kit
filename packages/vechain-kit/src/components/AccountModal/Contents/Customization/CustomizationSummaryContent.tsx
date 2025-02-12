import {
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    VStack,
    Button,
    Text,
    ModalFooter,
    Box,
} from '@chakra-ui/react';
import { ModalBackButton, StickyHeaderContainer } from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import { useTranslation } from 'react-i18next';
import { useVeChainKitConfig } from '@/providers';
import { useWallet, useRefreshMetadata } from '@/hooks';
import { useUpdateTextRecord } from '@/hooks';
import { useState } from 'react';
import { ENS_TEXT_RECORDS } from '@/types/ensTextRecords';

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    changes: {
        avatarIpfsHash?: string | null;
        displayName?: string;
        description?: string;
        twitter?: string;
        website?: string;
        email?: string;
    };
};

export const CustomizationSummaryContent = ({
    setCurrentContent,
    changes,
}: Props) => {
    const { t } = useTranslation();
    const { darkMode: isDark } = useVeChainKitConfig();
    const { account } = useWallet();
    const [isProcessing, setIsProcessing] = useState(false);
    const { refresh: refreshMetadata } = useRefreshMetadata(
        account?.address ?? '',
        account?.domain ?? '',
    );

    const { sendTransaction: updateTextRecord } = useUpdateTextRecord({
        onSuccess: async () => {
            await refreshMetadata();
            setIsProcessing(false);
            setCurrentContent('settings');
        },
    });

    const handleConfirm = async () => {
        try {
            setIsProcessing(true);
            const domain = account?.domain ?? '';

            const CHANGES_TO_TEXT_RECORDS: Record<
                keyof Props['changes'],
                (typeof ENS_TEXT_RECORDS)[number]
            > = {
                displayName: 'display',
                description: 'description',
                twitter: 'com.x',
                website: 'url',
                email: 'email',
                avatarIpfsHash: 'avatar',
            } as const;

            // Filter out undefined/null values and map to the correct format
            const textRecordUpdates = Object.entries(changes)
                .filter(
                    (entry): entry is [string, string] =>
                        entry[1] !== undefined && entry[1] !== null,
                )
                .map(([key, value]) => ({
                    domain,
                    key: CHANGES_TO_TEXT_RECORDS[key as keyof Props['changes']],
                    value: key === 'avatarIpfsHash' ? `ipfs://${value}` : value,
                }));

            if (textRecordUpdates.length > 0) {
                await updateTextRecord(textRecordUpdates);
            }

            // TODO: go to success modal content
        } catch (error) {
            console.error('Error saving changes:', error);
            setIsProcessing(false);
            // TODO: go to error modal content
        }
    };

    const renderField = (label: string, value: string) => {
        if (!value?.trim()) return null;
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
        <Box>
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
                <ModalCloseButton isDisabled={isProcessing} />
            </StickyHeaderContainer>

            <ModalBody>
                <VStack spacing={4} align="stretch">
                    {changes.avatarIpfsHash && (
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

                    {changes.displayName &&
                        renderField(t('Display Name'), changes.displayName)}
                    {changes.description &&
                        renderField(t('Description'), changes.description)}
                    {changes.twitter &&
                        renderField(t('Twitter'), changes.twitter)}
                    {changes.website &&
                        renderField(t('Website'), changes.website)}
                    {changes.email && renderField(t('Email'), changes.email)}
                </VStack>
            </ModalBody>

            <ModalFooter gap={4} w="full">
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
        </Box>
    );
};
