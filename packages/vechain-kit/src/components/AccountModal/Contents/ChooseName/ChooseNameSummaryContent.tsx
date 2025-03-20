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

export type ChooseNameSummaryContentProps = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    name: string;
    domainType?: string;
    isOwnDomain: boolean;
    isUnsetting?: boolean;
    initialContentSource?: AccountModalContentTypes;
};

export const ChooseNameSummaryContent = ({
    setCurrentContent,
    name,
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

    const {
        sendTransaction,
        txReceipt,
        error: txError,
        isWaitingForWalletConfirmation,
        isTransactionPending,
    } = useClaimVeWorldSubdomain({
        subdomain: name,
        domain: domainType,
        alreadyOwned: isOwnDomain,
        isUnsetting: isUnsetting,
        onSuccess: () => {
            setCurrentContent({
                type: 'successful-operation',
                props: {
                    setCurrentContent,
                    txId: txReceipt?.meta.txID,
                    title: isUnsetting ? t('Domain unset') : t('Domain set'),
                    description: isUnsetting
                        ? t('Your domain has been unset successfully.')
                        : t(
                              `Your address has been successfully set to {{name}}.{{domainType}}.`,
                              { name, domainType },
                          ),
                    onDone: () => {
                        setCurrentContent(initialContentSource);
                    },
                },
            });
        },
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

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader>
                    {isUnsetting
                        ? t('Confirm Unset Domain')
                        : t('Confirm Name')}
                </ModalHeader>
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
                            {`${name}.${domainType}`}
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
                    transactionPendingText={
                        isUnsetting
                            ? t('Unsetting current domain...')
                            : t('Claiming name...')
                    }
                    txReceipt={txReceipt}
                    buttonText={t('Confirm')}
                    isDisabled={isTransactionPending}
                />
            </ModalFooter>
        </>
    );
};
