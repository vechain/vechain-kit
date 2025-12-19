import React, { useMemo } from 'react';
import {
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    VStack,
    Text,
    ModalFooter,
    Box,
    Icon,
    useToken,
} from '@chakra-ui/react';
import {
    ModalBackButton,
    StickyHeaderContainer,
    TransactionButtonAndStatus,
    GasFeeSummary,
} from '@/components/common';
import { AccountModalContentTypes } from '../../../Types';
import { useTranslation } from 'react-i18next';
import { useVeChainKitConfig } from '@/providers';
import {
    useWallet,
    useUpgradeRequired,
    useUpgradeSmartAccountModal,
    getAvatarQueryKey,
    getAvatarOfAddressQueryKey,
    getTextRecordsQueryKey,
    useGasTokenSelection,
    useGenericDelegatorFeeEstimation,
} from '@/hooks';
import { useUpdateTextRecord } from '@/hooks';
import { useForm } from 'react-hook-form';
import { useGetResolverAddress } from '@/hooks/api/vetDomains/useGetResolverAddress';
import { useQueryClient } from '@tanstack/react-query';
import { convertUriToUrl } from '@/utils';
import { GasTokenType } from '@/types/gasToken';
import { LuFileText } from 'react-icons/lu';

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
    const { darkMode: isDark, network, feeDelegation } = useVeChainKitConfig();
    const textPrimary = useToken('colors', 'vechain-kit-text-primary');
    const { account, connectedWallet, connection } = useWallet();
    const { preferences } = useGasTokenSelection();

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

    const queryClient = useQueryClient();

    const {
        sendTransaction: updateTextRecord,
        txReceipt,
        error: txError,
        isWaitingForWalletConfirmation,
        isTransactionPending,
        clauses: getClauses,
    } = useUpdateTextRecord({
        resolverAddress, // Pass the pre-fetched resolver address
        signerAccountAddress: account?.address ?? '',
        onSuccess: async () => {
            try {
                await refresh();
            } catch (error) {
                console.error('Error refreshing data:', error);
            }
        },
        onError: (error) => {
            console.error('Error updating text record:', error);
        },
    });

    // Track if we've already shown success to prevent duplicate calls
    const [hasShownSuccess, setHasShownSuccess] = React.useState(false);

    // Handle successful transaction via useEffect to avoid synchronous state updates
    React.useEffect(() => {
        // Guard clauses
        if (!txReceipt) return;
        if (txReceipt.reverted) return;
        if (hasShownSuccess) return;
        if (isTransactionPending) return;

        const txId = txReceipt.meta.txID;
        if (!txId) return;

        setHasShownSuccess(true);
        setCurrentContent({
            type: 'successful-operation',
            props: {
                setCurrentContent,
                txId,
                title: t('Profile Updated'),
                description: t('Your changes have been saved successfully.'),
                onDone: () => {
                    setCurrentContent(onDoneRedirectContent);
                },
            },
        });
    }, [
        txReceipt,
        hasShownSuccess,
        isTransactionPending,
        setCurrentContent,
        t,
        onDoneRedirectContent,
    ]);

    // Reset the flag when starting a new transaction
    React.useEffect(() => {
        if (isTransactionPending) {
            setHasShownSuccess(false);
        }
    }, [isTransactionPending]);

    // Build the text record updates immediately
    const textRecordUpdates = useMemo(() => {
        const domain = account?.domain ?? '';
        const CHANGES_TO_TEXT_RECORDS = {
            displayName: 'display',
            description: 'description',
            twitter: 'com.x',
            website: 'url',
            email: 'email',
            avatarIpfsHash: 'avatar',
        } as const;

        return Object.entries(changes)
            .filter(
                (entry): entry is [string, string] =>
                    entry[1] !== undefined && entry[1] !== null,
            )
            .map(([key, value]) => ({
                domain,
                key: CHANGES_TO_TEXT_RECORDS[key as keyof FormValues],
                value: key === 'avatarIpfsHash' ? `ipfs://${value}` : value,
            }));
    }, [changes, account?.domain]);

    // Build clauses synchronously only if resolver address is available
    const clauses = useMemo(() => {
        try {
            // Don't build clauses until we have a resolver address
            if (
                !resolverAddress ||
                textRecordUpdates.length === 0 ||
                !getClauses
            ) {
                return [];
            }
            return getClauses(textRecordUpdates);
        } catch (error) {
            console.error('Error building clauses:', error);
            return [];
        }
    }, [textRecordUpdates, getClauses, resolverAddress]);

    // Gas estimation
    const [selectedGasToken, setSelectedGasToken] =
        React.useState<GasTokenType | null>(null);
    // Track the user's manual selection to show it during loading (before estimation completes)
    const [userSelectedGasToken, setUserSelectedGasToken] =
        React.useState<GasTokenType | null>(null);

    const shouldEstimateGas =
        preferences.availableGasTokens.length > 0 &&
        (connection.isConnectedWithPrivy ||
            connection.isConnectedWithVeChain) &&
        !feeDelegation?.delegatorUrl;
    const {
        data: gasEstimation,
        isLoading: gasEstimationLoading,
        error: gasEstimationError,
        refetch: refetchGasEstimation,
    } = useGenericDelegatorFeeEstimation({
        clauses: clauses,
        tokens: selectedGasToken
            ? [selectedGasToken]
            : preferences.availableGasTokens, // Use selected token or all available
        enabled: shouldEstimateGas && !!feeDelegation?.genericDelegatorUrl,
    });
    const usedGasToken = gasEstimation?.usedToken;
    const disableConfirmButtonDuringEstimation =
        (gasEstimationLoading || !gasEstimation) &&
        connection.isConnectedWithPrivy &&
        !feeDelegation?.delegatorUrl;

    const handleGasTokenChange = React.useCallback(
        (token: GasTokenType) => {
            setSelectedGasToken(token);
            setUserSelectedGasToken(token); // Track user's choice
            setTimeout(() => refetchGasEstimation(), 100);
        },
        [refetchGasEstimation],
    );

    // hasEnoughBalance is now determined by the hook itself
    const hasEnoughBalance = !!usedGasToken && !gasEstimationError;

    // Auto-fallback: if the selected token cannot cover fees (estimation error),
    // clear selection to re-estimate across all available tokens
    // Keep userSelectedGasToken to show during loading, but actual result will show the token that succeeds
    React.useEffect(() => {
        if (gasEstimationError && selectedGasToken) {
            setSelectedGasToken(null);
        }
    }, [gasEstimationError, selectedGasToken]);

    const onSubmit = async () => {
        if (upgradeRequired) {
            openUpgradeSmartAccountModal();
            return;
        }

        try {
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
                    color={isDark ? 'whiteAlpha.600' : 'blackAlpha.600'}
                >
                    {label}
                </Text>
                <Text fontSize="md">{value}</Text>
            </VStack>
        );
    };

    const handleRetry = () => {
        handleSubmit(onSubmit)();
    };

    const handleBack = () => {
        setCurrentContent({
            type: 'account-customization',
            props: {
                setCurrentContent,
            },
        });
    };

    const refresh = async () => {
        // only update avatar data if it's being changed
        if (changes.avatarIpfsHash) {
            queryClient.setQueryData(
                getAvatarQueryKey(domain, network.type),
                convertUriToUrl(
                    'ipfs://' + changes.avatarIpfsHash,
                    network.type,
                ),
            );

            queryClient.setQueryData(
                getAvatarOfAddressQueryKey(account?.address ?? ''),
                convertUriToUrl(
                    'ipfs://' + changes.avatarIpfsHash,
                    network.type,
                ),
            );
        }

        // still refresh text records since they might have other changes
        await queryClient.invalidateQueries({
            queryKey: getTextRecordsQueryKey(domain, network.type),
        });

        await queryClient.refetchQueries({
            queryKey: getTextRecordsQueryKey(domain, network.type),
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
                <ModalCloseButton isDisabled={isTransactionPending} />
            </StickyHeaderContainer>

            <ModalBody>
                <VStack spacing={6} align="center" mt={10}>
                    <Icon
                        as={LuFileText}
                        color={textPrimary}
                        fontSize={'60px'}
                        opacity={0.5}
                    />
                    <Text fontSize="md" textAlign="center" color={textPrimary}>
                        {t(
                            'By confirming, the following details attached to your name ({{domain}}) will be updated',
                            {
                                domain,
                            },
                        )}
                    </Text>
                </VStack>
                <VStack spacing={4} align="stretch" mt={6}>
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
                {connection.isConnectedWithPrivy && (
                    <GasFeeSummary
                        estimation={gasEstimation}
                        isLoading={gasEstimationLoading}
                        isLoadingTransaction={isTransactionPending}
                        onTokenChange={handleGasTokenChange}
                        clauses={clauses as any}
                        userSelectedToken={userSelectedGasToken}
                    />
                )}
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
                    isDisabled={
                        isTransactionPending ||
                        disableConfirmButtonDuringEstimation
                    }
                    gasEstimationError={gasEstimationError}
                    hasEnoughGasBalance={hasEnoughBalance}
                    isLoadingGasEstimation={gasEstimationLoading}
                    showGasEstimationError={
                        !feeDelegation?.delegatorUrl &&
                        connection.isConnectedWithPrivy
                    }
                    context="customization"
                />
            </ModalFooter>
        </Box>
    );
};
