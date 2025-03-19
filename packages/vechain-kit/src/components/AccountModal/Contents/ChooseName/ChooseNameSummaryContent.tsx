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
import { useTranslation } from 'react-i18next';
import {
    useUpgradeRequired,
    useUpgradeSmartAccountModal,
    useWallet,
} from '@/hooks';
import { Analytics } from '@/utils/mixpanelClientInstance';

export type ChooseNameSummaryContentProps = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    name: string;
    isOwnDomain: boolean;
    initialContentSource?: AccountModalContentTypes;
};

export const ChooseNameSummaryContent = ({
    setCurrentContent,
    name,
    isOwnDomain,
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
        if (
            error.toLowerCase().includes('rejected') ||
            error.toLowerCase().includes('cancelled') ||
            error.toLowerCase().includes('user denied')
        ) {
            Analytics.nameSelection.dropOff('confirmation', {
                name,
                error,
            });
        } else {
            Analytics.nameSelection.failed('confirmation', {
                error,
                name,
            });
        }
    };

    const {
        sendTransaction,
        txReceipt,
        error: txError,
        isWaitingForWalletConfirmation,
        isTransactionPending,
    } = useClaimVeWorldSubdomain({
        subdomain: name,
        domain: 'veworld.vet',
        alreadyOwned: isOwnDomain,
        onSuccess: () => {
            Analytics.nameSelection.completed(name, isOwnDomain);
            setCurrentContent({
                type: 'successful-operation',
                props: {
                    setCurrentContent,
                    txId: txReceipt?.meta.txID,
                    title: t('Name claimed'),
                    description: t(
                        `Your {{name}}.veworld.vet name has been claimed successfully.`,
                        { name },
                    ),
                    onDone: () => {
                        setCurrentContent(initialContentSource);
                    },
                },
            });
        },
        onError: () => {},
    });

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

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader>{t('Confirm Name')}</ModalHeader>
                <ModalBackButton
                    onClick={() =>
                        setCurrentContent({
                            type: 'choose-name-search',
                            props: {
                                setCurrentContent,
                                name,
                                initialContentSource,
                            },
                        })
                    }
                    isDisabled={isTransactionPending}
                />
                <ModalCloseButton isDisabled={isTransactionPending} />
            </StickyHeaderContainer>

            <ModalBody>
                <VStack spacing={4} w="full" textAlign="center">
                    <Text fontSize="lg">
                        {t('Are you sure you want to set your domain name to')}
                    </Text>
                    <Text fontSize="xl" fontWeight="bold" color="blue.500">
                        {`${name}.veworld.vet`}
                    </Text>
                </VStack>
            </ModalBody>

            <ModalFooter gap={4} w="full">
                <TransactionButtonAndStatus
                    transactionError={txError}
                    isSubmitting={isTransactionPending}
                    isTxWaitingConfirmation={isWaitingForWalletConfirmation}
                    onConfirm={handleConfirm}
                    onRetry={handleRetry}
                    transactionPendingText={t('Claiming name...')}
                    txReceipt={txReceipt}
                    buttonText={t('Confirm')}
                    isDisabled={isTransactionPending}
                    onError={handleError}
                />
            </ModalFooter>
        </>
    );
};
