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
    useGasEstimation,
    useGasTokenSelection,
    useTokenBalances,
} from '@/hooks';
import { Analytics } from '@/utils/mixpanelClientInstance';
import { isRejectionError } from '@/utils/stringUtils';
import { useVeChainKitConfig } from '@/providers';

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
    const { balances } = useTokenBalances(account?.address ?? '');
    const { feeDelegation } = useVeChainKitConfig();

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

    let gasEstimation, gasEstimationLoading, totalCost, hasEnoughBalance;
    if (preferences.availableGasTokens.length > 0 && connection.isConnectedWithPrivy && !feeDelegation?.delegatorUrl) {
        ({
            data: gasEstimation,
            isLoading: gasEstimationLoading,
        } = useGasEstimation({
            clauses: clauses(),
            token: preferences.availableGasTokens[0],
            enabled: !!feeDelegation?.genericDelegatorUrl && !feeDelegation?.delegatorUrl, 
        }));
        totalCost = gasEstimation?.transactionCost;
        if (!gasEstimationLoading && totalCost !== undefined) {
            const gasTokenBalance = Number(
                balances.find(token => token.symbol === preferences.availableGasTokens[0])?.balance || '0'
            );
            hasEnoughBalance = totalCost < gasTokenBalance;
        }
    }

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
            </ModalBody>

            <ModalFooter gap={4} w="full">
                {((!feeDelegation?.delegatorUrl && hasEnoughBalance) || feeDelegation?.delegatorUrl || connection.isConnectedWithDappKit) && (
                    <TransactionButtonAndStatus
                        transactionError={txError}
                        isSubmitting={isTransactionPending}
                        isTxWaitingConfirmation={isWaitingForWalletConfirmation}
                        onConfirm={handleConfirm}
                        onRetry={handleRetry}
                        transactionPendingText={isUnsetting
                            ? t('Unsetting current domain...')
                            : t('Claiming name...')}
                        txReceipt={txReceipt}
                        buttonText={t('Confirm')}
                        isDisabled={isTransactionPending}
                        onError={handleError}
                    />
                )}
                {(!feeDelegation?.delegatorUrl && !hasEnoughBalance && connection.isConnectedWithPrivy) && (
                    <Text color="red.500">
                        {t('You do not have enough {{token}} to cover the gas fee and the transaction. Please check to see that you have gas tokens enabled in Gas Token Preferences or add more funds to your wallet and try again.', {token: preferences.availableGasTokens[0]})}
                    </Text>
                )}
            </ModalFooter>
        </>
    );
};
