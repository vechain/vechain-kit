import {
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    VStack,
    Text,
    ModalFooter,
    Box,
} from '@chakra-ui/react';
import {
    ModalBackButton,
    StickyHeaderContainer,
    TransactionButtonAndStatus,
} from '@/components/common';
import { AccountModalContentTypes } from '../../../Types';
import { useTranslation } from 'react-i18next';
import { useVeChainKitConfig } from '@/providers';
import {
    useWallet,
    useRefreshMetadata,
    useUpgradeRequired,
    useUpgradeSmartAccountModal,
} from '@/hooks';
import { useUpdateTextRecord } from '@/hooks';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useGetResolverAddress } from '@/hooks/api/vetDomains/useGetResolverAddress';

export type CustomizationSummaryContentProps = {
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

type FormValues = {
    avatarIpfsHash?: string;
    displayName?: string;
    description?: string;
    twitter?: string;
    website?: string;
    email?: string;
};

export const CustomizationSummaryContent = ({
    setCurrentContent,
    changes,
}: CustomizationSummaryContentProps) => {
    const { t } = useTranslation();
    const { darkMode: isDark } = useVeChainKitConfig();
    const { account, connectedWallet } = useWallet();
    const { refresh: refreshMetadata } = useRefreshMetadata(
        account?.domain ?? '',
    );
    const { data: upgradeRequired } = useUpgradeRequired(
        account?.address ?? '',
        connectedWallet?.address ?? '',
        3,
    );
    const { open: openUpgradeSmartAccountModal } =
        useUpgradeSmartAccountModal();
    const { handleSubmit } = useForm<FormValues>({
        defaultValues: {
            ...changes,
            avatarIpfsHash: changes.avatarIpfsHash ?? undefined,
        },
    });

    const domain = account?.domain ?? '';

    // Pre-fetch the resolver address
    const { data: resolverAddress } = useGetResolverAddress(domain);

    const {
        sendTransaction: updateTextRecord,
        txReceipt,
        error: txError,
        isWaitingForWalletConfirmation,
        isTransactionPending,
    } = useUpdateTextRecord({
        resolverAddress, // Pass the pre-fetched resolver address
        onSuccess: async () => {
            refreshMetadata();
            setCurrentContent({
                type: 'successful-operation',
                props: {
                    setCurrentContent,
                    txId: txReceipt?.meta.txID,
                    title: t('Profile Updated'),
                    description: t(
                        'Your changes have been saved successfully.',
                    ),
                    onDone: () => {
                        setCurrentContent('settings');
                    },
                },
            });
        },
    });

    const onSubmit = async (data: FormValues) => {
        try {
            const domain = account?.domain ?? '';
            const CHANGES_TO_TEXT_RECORDS = {
                displayName: 'display',
                description: 'description',
                twitter: 'com.x',
                website: 'url',
                email: 'email',
                avatarIpfsHash: 'avatar',
            } as const;

            const textRecordUpdates = Object.entries(data)
                .filter(
                    (entry): entry is [string, string] =>
                        entry[1] !== undefined && entry[1] !== null,
                )
                .map(([key, value]) => ({
                    domain,
                    key: CHANGES_TO_TEXT_RECORDS[key as keyof FormValues],
                    value: key === 'avatarIpfsHash' ? `ipfs://${value}` : value,
                }));

            if (textRecordUpdates.length > 0) {
                await updateTextRecord(textRecordUpdates);
            }
        } catch (error) {
            console.error('Error saving changes:', error);
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

    useEffect(() => {
        if (upgradeRequired) {
            openUpgradeSmartAccountModal();
        }
    }, [upgradeRequired, openUpgradeSmartAccountModal]);

    return (
        <Box as="form" onSubmit={handleSubmit(onSubmit)}>
            <StickyHeaderContainer>
                <ModalHeader>{t('Confirm Changes')}</ModalHeader>
                <ModalBackButton
                    isDisabled={isTransactionPending}
                    onClick={() => setCurrentContent('account-customization')}
                />
                <ModalCloseButton isDisabled={isTransactionPending} />
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
                <TransactionButtonAndStatus
                    transactionError={txError}
                    isSubmitting={isTransactionPending}
                    isTxWaitingConfirmation={isWaitingForWalletConfirmation}
                    onConfirm={handleSubmit(onSubmit)}
                    transactionPendingText={t('Saving changes...')}
                    txReceipt={txReceipt}
                    buttonText={t('Confirm')}
                    isDisabled={isTransactionPending || upgradeRequired}
                />
            </ModalFooter>
        </Box>
    );
};
