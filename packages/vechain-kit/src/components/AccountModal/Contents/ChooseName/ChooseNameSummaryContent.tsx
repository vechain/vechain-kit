import React from 'react';
import {
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    VStack,
    ModalFooter,
    Text,
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
    useGasEstimation,
} from '@/hooks';
import { Analytics } from '@/utils/mixpanelClientInstance';
import { isRejectionError } from '@/utils/stringUtils';
import { useVeChainKitConfig } from '@/providers';
import { showGasFees } from '@/utils/constants';
import { GasTokenType } from '@/types/gasToken';

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
    const showGasFeeSummary = showGasFees(
        connection.isConnectedWithPrivy,
        !!feeDelegation?.delegatorUrl,
        preferences.showCostBreakdown,
    );

    const handleError = (error: string) => {
        if (isRejectionError(error)) {
            Analytics.nameSelection.dropOff('confirmation', {
                isError: true,
                name: fullDomain,
                error,
                reason: 'wallet_rejected',
            });
        } else {
            Analytics.nameSelection.failed('confirmation', {
                error,
                name: fullDomain,
            });
        }
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
                    setCurrentContent(initialContentSource);
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
        Analytics.nameSelection.retry('confirmation');
        handleConfirm();
    };

    const handleClose = () => {
        Analytics.nameSelection.dropOff('confirmation', {
            isError: false,
            name: isUnsetting ? '' : fullDomain,
            error: 'modal_closed',
        });
    };

    const handleBack = () => {
        Analytics.nameSelection.dropOff('confirmation', {
            isError: false,
            name: isUnsetting ? '' : fullDomain,
            error: 'back_button',
        });
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
    } = useGasEstimation({
        clauses: clauses(),
        tokens: selectedGasToken
            ? [selectedGasToken]
            : preferences.availableGasTokens, // Use selected token or all available
        enabled: shouldEstimateGas && !!feeDelegation?.genericDelegatorUrl,
    });
    const usedGasToken = gasEstimation?.usedToken;

    const handleGasTokenChange = React.useCallback(
        (token: GasTokenType) => {
            setSelectedGasToken(token);
            setTimeout(() => refetchGasEstimation(), 100);
        },
        [refetchGasEstimation],
    );

    // hasEnoughBalance is now determined by the hook itself
    const hasEnoughBalance = !!usedGasToken && !gasEstimationError;

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
                <ModalCloseButton
                    isDisabled={isTransactionPending}
                    onClick={handleClose}
                />
            </StickyHeaderContainer>

            <ModalBody>
                <VStack spacing={4} w="full" textAlign="center">
                    <Text fontSize="lg">
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
                            color="blue.500"
                            data-testid="preconfirm-domain-val"
                        >
                            {`${fullDomain}`}
                        </Text>
                    )}
                </VStack>
                {feeDelegation?.genericDelegatorUrl &&
                    showGasFeeSummary &&
                    gasEstimation &&
                    usedGasToken && (
                        <GasFeeSummary
                            estimation={gasEstimation}
                            isLoading={gasEstimationLoading}
                            onTokenChange={handleGasTokenChange}
                            clauses={clauses() as any}
                        />
                    )}
            </ModalBody>

            <ModalFooter gap={4} w="full">
                {((!feeDelegation?.delegatorUrl && hasEnoughBalance) ||
                    feeDelegation?.delegatorUrl ||
                    connection.isConnectedWithDappKit) && (
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
                        isDisabled={isTransactionPending}
                        onError={handleError}
                    />
                )}
                {!feeDelegation?.delegatorUrl &&
                    !hasEnoughBalance &&
                    connection.isConnectedWithPrivy &&
                    !gasEstimationLoading && (
                        <Text color="red.500">
                            {gasEstimationError
                                ? t(
                                      'Unable to find a gas token with sufficient balance. Please enable more gas tokens in Gas Token Preferences or add funds to your wallet and try again.',
                                  )
                                : t(
                                      "You don't have any gas tokens enabled. Please enable at least one gas token in Gas Token Preferences.",
                                  )}
                        </Text>
                    )}
            </ModalFooter>
        </>
    );
};
