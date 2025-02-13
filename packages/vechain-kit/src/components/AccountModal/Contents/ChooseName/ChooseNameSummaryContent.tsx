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
import { useVeChainKitConfig } from '@/providers';
import { useState } from 'react';

export type ChooseNameSummaryContentProps = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    name: string;
    isOwnDomain: boolean;
};

export const ChooseNameSummaryContent = ({
    setCurrentContent,
    name,
    isOwnDomain,
}: ChooseNameSummaryContentProps) => {
    const { t } = useTranslation();
    const { darkMode: isDark } = useVeChainKitConfig();

    const [error, setError] = useState<string | null>(null);

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
            setCurrentContent({
                type: 'successful-operation',
                props: {
                    setCurrentContent,
                    txId: txReceipt?.meta.txID,
                    title: t('Name claimed'),
                    description: t(
                        `Your {{name}}.veworld.vet name has been claimed successfully.`,
                        {
                            name,
                        },
                    ),
                    onDone: () => {
                        setCurrentContent('account-customization');
                    },
                },
            });
        },
        onError: () => {
            setError(
                txError?.reason ??
                    t('Failed to save changes. Please try again.'),
            );
        },
    });

    const handleConfirm = async () => {
        try {
            await sendTransaction();
        } catch (error) {
            console.error('Transaction failed:', error);
        }
    };

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader
                    fontSize={'md'}
                    fontWeight={'500'}
                    textAlign={'center'}
                    color={isDark ? '#dfdfdd' : '#4d4d4d'}
                >
                    {t('Confirm Name')}
                </ModalHeader>
                <ModalBackButton
                    onClick={() =>
                        setCurrentContent({
                            type: 'choose-name-search',
                            props: {
                                setCurrentContent,
                                name,
                            },
                        })
                    }
                />
                <ModalCloseButton />
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
                    error={error}
                    isSubmitting={isTransactionPending}
                    isTxWaitingConfirmation={isWaitingForWalletConfirmation}
                    handleSend={handleConfirm}
                    transactionPendingText={t('Claiming name...')}
                    txReceipt={txReceipt}
                />
            </ModalFooter>
        </>
    );
};
