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
} from '@/hooks';
import { Analytics } from '@/utils/mixpanelClientInstance';
import { isRejectionError } from '@/utils/StringUtils';
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
    const { account, connectedWallet } = useWallet();
    const { data: upgradeRequired } = useUpgradeRequired(
        account?.address ?? '',
        connectedWallet?.address ?? '',
        3,
    );
    const { open: openUpgradeSmartAccountModal } =
        useUpgradeSmartAccountModal();

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
        domain: fullDomain,
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

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader>
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
                        <Text fontSize="xl" fontWeight="bold" color="blue.500">
                            {`${fullDomain}`}
                        </Text>
                    )}
                </VStack>
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
                    isDisabled={isTransactionPending}
                    onError={handleError}
                />
            </ModalFooter>
        </>
    );
};
