import React from 'react';
import {
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    VStack,
    ModalFooter,
    Text,
    useToken,
} from '@chakra-ui/react';
import {
    ModalBackButton,
    StickyHeaderContainer,
    TransactionButtonAndStatus,
    GasFeeSummary,
} from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import { useClaimVeWorldSubdomain } from '@/hooks/api/vetDomains/useClaimVeWorldSubdomain';
import { useClaimVetDomain } from '@/hooks/api/vetDomains/useClaimVetDomain';
import { useUnsetDomain } from '@/hooks/api/vetDomains/useUnsetDomain';
import { useTranslation } from 'react-i18next';
import {
    useUpgradeRequired,
    useUpgradeSmartAccountModal,
    useWallet,
    useGasTokenSelection,
    useGenericDelegatorFeeEstimation,
} from '@/hooks';
import { useVeChainKitConfig } from '@/providers';
import { GasTokenType } from '@/types/gasToken';
import { useAccountModalOptions } from '@/hooks/modals/useAccountModalOptions';

export type ChooseNameSummaryContentProps = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    fullDomain: string;
    domainType?: string;
    isOwnDomain: boolean;
    isUnsetting?: boolean;
    initialContentSource?: AccountModalContentTypes;
};

export const ChooseNameSummaryContent = ({
    setCurrentContent,
    fullDomain,
    domainType = 'veworld.vet',
    isOwnDomain,
    isUnsetting = false,
    initialContentSource = 'settings',
}: ChooseNameSummaryContentProps) => {
    const { t } = useTranslation();
    const textPrimary = useToken('colors', 'vechain-kit-text-primary');
    const { isolatedView, closeAccountModal } = useAccountModalOptions();
    const { account, connectedWallet, connection } = useWallet();
    const { data: upgradeRequired } = useUpgradeRequired(
        account?.address ?? '',
        connectedWallet?.address ?? '',
        3,
    );
    const { open: openUpgradeSmartAccountModal } =
        useUpgradeSmartAccountModal();

    const { preferences } = useGasTokenSelection();
    const { feeDelegation } = useVeChainKitConfig();

    const handleError = (error: string) => {
        console.error('Transaction failed:', error);
    };

    // Use the unset domain hook if we're unsetting
    const unsetDomainHook = useUnsetDomain({
        onSuccess: () => handleSuccess(),
    });

    // If not unsetting, determine if this is a .veworld.vet subdomain or a primary .vet domain
    const isVeWorldSubdomain = domainType.endsWith('veworld.vet');

    // Use the appropriate claim hook based on domain type (only when not unsetting)
    const veWorldSubdomainHook = useClaimVeWorldSubdomain({
        subdomain: fullDomain.split('.veworld.vet')[0],
        domain: domainType,
        alreadyOwned: isOwnDomain,
        onSuccess: () => handleSuccess(),
    });

    const vetDomainHook = useClaimVetDomain({
        domain: !isUnsetting && !isVeWorldSubdomain ? fullDomain : '',
        alreadyOwned: isOwnDomain,
        onSuccess: () => handleSuccess(),
    });

    // Use the appropriate hook based on action and domain type
    const {
        sendTransaction,
        txReceipt,
        error: txError,
        isWaitingForWalletConfirmation,
        isTransactionPending,
        clauses,
    } = isUnsetting
        ? unsetDomainHook
        : isVeWorldSubdomain
        ? veWorldSubdomainHook
        : vetDomainHook;

    const handleSuccess = () => {
        setCurrentContent({
            type: 'successful-operation',
            props: {
                setCurrentContent,
                txId: txReceipt?.meta.txID,
                title: isUnsetting ? t('Domain unset') : t('Domain set'),
                description: isUnsetting
                    ? t('Your domain has been unset successfully.')
                    : t(`Your address has been successfully set to {{name}}`, {
                          name: fullDomain,
                      }),
                onDone: () => {
                    if (isolatedView) {
                        closeAccountModal();
                    } else {
                        setCurrentContent(initialContentSource);
                    }
                },
            },
        });
    };

    const handleConfirm = async () => {
        if (upgradeRequired) {
            openUpgradeSmartAccountModal();
            return;
        }

        try {
            await sendTransaction();
        } catch (error) {
            console.error('Transaction failed:', error);
        }
    };

    const handleRetry = () => {
        handleConfirm();
    };

    const handleBack = () => {
        setCurrentContent({
            type: 'choose-name-search',
            props: {
                setCurrentContent,
                name: fullDomain,
                initialContentSource,
            },
        });
    };

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
        clauses: clauses(),
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

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader data-testid="confirm-domain">
                    {isUnsetting
                        ? t('Confirm Unset Domain')
                        : t('Confirm Name')}
                </ModalHeader>
                <ModalBackButton
                    onClick={handleBack}
                    isDisabled={isTransactionPending}
                />
                <ModalCloseButton isDisabled={isTransactionPending} />
            </StickyHeaderContainer>

            <ModalBody>
                <VStack spacing={4} w="full" textAlign="center">
                    <Text fontSize="lg" color={textPrimary}>
                        {isUnsetting
                            ? t(
                                  'Are you sure you want to unset your current domain?',
                              )
                            : t(
                                  'Are you sure you want to set your domain name to',
                              )}
                    </Text>
                    {!isUnsetting && (
                        <Text
                            fontSize="xl"
                            fontWeight="bold"
                            color={textPrimary}
                            data-testid="preconfirm-domain-val"
                        >
                            {`${fullDomain}`}
                        </Text>
                    )}
                </VStack>
                {connection.isConnectedWithPrivy && (
                    <GasFeeSummary
                        estimation={gasEstimation}
                        isLoading={gasEstimationLoading}
                        isLoadingTransaction={isTransactionPending}
                        onTokenChange={handleGasTokenChange}
                        clauses={clauses() as any}
                        userSelectedToken={userSelectedGasToken}
                    />
                )}
            </ModalBody>

            <ModalFooter gap={4} w="full">
                <TransactionButtonAndStatus
                    transactionError={txError}
                    isSubmitting={isTransactionPending}
                    isTxWaitingConfirmation={isWaitingForWalletConfirmation}
                    onConfirm={handleConfirm}
                    onRetry={handleRetry}
                    transactionPendingText={
                        isUnsetting
                            ? t('Unsetting current domain...')
                            : t('Claiming name...')
                    }
                    txReceipt={txReceipt}
                    buttonText={t('Confirm')}
                    isDisabled={
                        isTransactionPending ||
                        disableConfirmButtonDuringEstimation
                    }
                    onError={handleError}
                    gasEstimationError={gasEstimationError}
                    hasEnoughGasBalance={hasEnoughBalance}
                    isLoadingGasEstimation={gasEstimationLoading}
                    showGasEstimationError={
                        !feeDelegation?.delegatorUrl &&
                        connection.isConnectedWithPrivy
                    }
                    context="domain"
                />
            </ModalFooter>
        </>
    );
};
