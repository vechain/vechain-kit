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
import { useGetResolverAddress } from '@/hooks/api/vetDomains/useGetResolverAddress';
import { Analytics } from '@/utils/mixpanelClientInstance';
import { isRejectionError } from '@/utils/StringUtils';

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
    onDoneRedirectContent: AccountModalContentTypes;
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
    onDoneRedirectContent,
}: CustomizationSummaryContentProps) => {
    const { t } = useTranslation();
    const { darkMode: isDark } = useVeChainKitConfig();
    const { account, connectedWallet } = useWallet();
    const { refresh: refreshMetadata } = useRefreshMetadata(
        account?.domain ?? '',
        account?.address ?? '',
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
        signerAccountAddress: account?.address ?? '',
        onSuccess: async () => {
            Analytics.customization.completed({
                hasAvatar: !!changes.avatarIpfsHash,
                hasDisplayName: !!changes.displayName,
                hasDescription: !!changes.description,
                hasSocials: !!(
                    changes.twitter ||
                    changes.website ||
                    changes.email
                ),
            });

            // Set success content first
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
                        setCurrentContent(onDoneRedirectContent);
                    },
                },
            });

            try {
                await refreshMetadata();
            } catch (error) {
                console.error('Error refreshing data:', error);
            }
        },
        onError: (error) => {
            if (error && isRejectionError(error?.message ?? '')) {
                Analytics.customization.dropOff({
                    stage: 'confirmation',
                    reason: 'wallet_rejected',
                    error: error?.message,
                });
            } else {
                Analytics.customization.failed(
                    'confirmation',
                    error instanceof Error ? error.message : 'Unknown error',
                );
            }
        },
    });

    const onSubmit = async (data: FormValues) => {
        if (upgradeRequired) {
            openUpgradeSmartAccountModal();
            return;
        }

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
            Analytics.customization.dropOff({
                stage: 'confirmation',
                reason: 'transaction_error',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    };

    const renderField = (label: string, value: string) => {
        if (!value?.trim()) return null;
        return (
            <VStack align="flex-start" w="full" spacing={1}>
                <Text
                    fontSize="sm"
                    color={isDark ? 'whiteAlpha.600' : 'blackAlpha.600'}
                >
                    {label}
                </Text>
                <Text fontSize="md">{value}</Text>
            </VStack>
        );
    };

    const handleRetry = () => {
        Analytics.customization.failed(
            'confirmation',
            txError instanceof Error ? txError.message : 'Unknown error',
        );
        handleSubmit(onSubmit)();
    };

    const handleClose = () => {
        Analytics.customization.dropOff({
            stage: 'confirmation',
            reason: 'modal_closed',
        });
    };

    const handleBack = () => {
        Analytics.customization.dropOff({
            stage: 'confirmation',
            reason: 'back_button',
        });
        setCurrentContent({
            type: 'account-customization',
            props: {
                setCurrentContent,
            },
        });
    };

    return (
        <Box as="form" onSubmit={handleSubmit(onSubmit)}>
            <StickyHeaderContainer>
                <ModalHeader>{t('Confirm Changes')}</ModalHeader>
                <ModalBackButton
                    isDisabled={isTransactionPending}
                    onClick={handleBack}
                />
                <ModalCloseButton
                    isDisabled={isTransactionPending}
                    onClick={handleClose}
                />
            </StickyHeaderContainer>

            <ModalBody>
                <VStack spacing={4} align="stretch">
                    {changes.avatarIpfsHash && (
                        <VStack align="flex-start" w="full" spacing={1}>
                            <Text
                                fontSize="sm"
                                color={
                                    isDark ? 'whiteAlpha.600' : 'blackAlpha.600'
                                }
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
                    onRetry={handleRetry}
                    transactionPendingText={t('Saving changes...')}
                    txReceipt={txReceipt}
                    buttonText={t('Confirm')}
                    isDisabled={isTransactionPending}
                />
            </ModalFooter>
        </Box>
    );
};
