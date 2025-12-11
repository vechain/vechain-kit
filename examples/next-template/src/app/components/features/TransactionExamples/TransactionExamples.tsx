'use client';

import { Box, Button, Heading, HStack } from '@chakra-ui/react';
import {
    useWallet,
    useThor,
    useBuildTransaction,
    useTransactionModal,
    useTransactionToast,
    TransactionModal,
    TransactionToast,
    useSendTransaction,
} from '@vechain/vechain-kit';
import { IB3TR__factory } from '@vechain/vechain-contract-types';
import { humanAddress } from '@vechain/vechain-kit/utils';
import { b3trMainnetAddress } from '../../../constants';
import { useCallback, useState } from 'react';

export function TransactionExamples() {
    const { account } = useWallet();
    const thor = useThor();

    const clauses = [
        {
            ...thor.contracts
                .load(b3trMainnetAddress, IB3TR__factory.abi)
                .clause.transfer(account?.address ?? '', BigInt('0')).clause,
            comment: `This is a dummy transaction to test the transaction modal. Confirm to transfer 0 B3TR to ${account?.address}`,
        },
    ];

    const callUseBuildTransaction = (delegationUrl?: string) => {
        return useBuildTransaction({
        clauseBuilder: () => {
            if (!account?.address) return [];

            return clauses;
        },
        refetchQueryKeys: [],
        onSuccess: () => {},
        onFailure: () => {},
        suggestedMaxGas: undefined,
        delegationUrl: delegationUrl,
    });}

    const callUseSendTransaction = (delegationUrl?: string) => {
        return useSendTransaction({
            signerAccountAddress: account?.address,
            delegationUrl: delegationUrl,
        });
    }

    const buildTransactionNoDelegation = callUseBuildTransaction();

    const delegationUrl = "https://sponsor-testnet.vechain.energy/by/848";
    
    const buildTransactionWithDelegation = callUseBuildTransaction(delegationUrl);

    const sendTransactionNoDelegation = callUseSendTransaction();

    const sendTransactionWithDelegation = callUseSendTransaction();

    const {
        open: openTransactionToast,
        close: closeTransactionToast,
        isOpen: isTransactionToastOpen,
    } = useTransactionToast();

    const {
        open: openTransactionModal,
        close: closeTransactionModal,
        isOpen: isTransactionModalOpen,
    } = useTransactionModal();

    // State to track which modal type is currently open
    const [currentModalType, setCurrentModalType] = useState<'useBuildTxWithDelegation' | 'useSendTxWithDelegation' | 'useBuildTxWithToast' | 'useSendTxWithToast' | null>(null);

    const handleTransactionWithToast = useCallback(async () => {
        setCurrentModalType('useBuildTxWithToast');
        openTransactionToast();
        await buildTransactionNoDelegation.sendTransaction({});
    }, [buildTransactionNoDelegation, openTransactionToast]);

    const handleBuildTransactionDelegatedWithModal = useCallback(async () => {
        setCurrentModalType('useBuildTxWithDelegation');
        openTransactionModal();
        await (buildTransactionWithDelegation.sendTransaction({}));
    }, [buildTransactionWithDelegation.sendTransaction, openTransactionModal]);

    const handleUseSendTransactionWithToast = useCallback(async () => {
        setCurrentModalType('useSendTxWithToast');
        openTransactionToast();
        await sendTransactionNoDelegation.sendTransaction(clauses);
    }, [sendTransactionNoDelegation.sendTransaction, openTransactionToast]);

    const handleSendTransactionDelegatedWithModal = useCallback(async () => {
        setCurrentModalType('useSendTxWithDelegation');
        openTransactionModal();
        await sendTransactionWithDelegation.sendTransaction(clauses, delegationUrl);
    }, [sendTransactionWithDelegation.sendTransaction, openTransactionModal]);

    const retryBuildTransactionDelegated = useCallback(async () => {
        buildTransactionWithDelegation.resetStatus();
        await buildTransactionWithDelegation.sendTransaction({});
    }, [buildTransactionWithDelegation.resetStatus, buildTransactionWithDelegation.sendTransaction]);

    const retryBuildTransactionNoDelegation = useCallback(async () => {
        buildTransactionNoDelegation.resetStatus();
        await buildTransactionNoDelegation.sendTransaction({});
    }, [buildTransactionNoDelegation.resetStatus, buildTransactionNoDelegation.sendTransaction]);

    const retrySendTransactionDelegated = useCallback(async () => {
        sendTransactionWithDelegation.resetStatus();
        await sendTransactionWithDelegation.sendTransaction(clauses, delegationUrl);
    }, [sendTransactionWithDelegation.resetStatus, sendTransactionWithDelegation.sendTransaction]);

    const retrySendTransactionNoDelegation = useCallback(async () => {
        sendTransactionNoDelegation.resetStatus();
        await sendTransactionNoDelegation.sendTransaction(clauses);
    }, [sendTransactionNoDelegation.resetStatus, sendTransactionNoDelegation.sendTransaction]);

    const closeModalAndReset = useCallback(() => {
        closeTransactionModal();
        setCurrentModalType(null);
    }, [closeTransactionModal]);

    return (
        <>
            <Box>
                <Heading size="md">
                    <b>Test Transactions</b>
                </Heading>
                <HStack mt={4} spacing={4}>
                    <Button
                        onClick={handleTransactionWithToast}
                        isLoading={buildTransactionNoDelegation.isTransactionPending}
                        isDisabled={buildTransactionNoDelegation.isTransactionPending}
                        data-testid="tx-with-toast-button"
                    >
                        useBuildTransaction with toast (no delegation)
                    </Button>
                    <Button
                        onClick={handleBuildTransactionDelegatedWithModal}
                        isLoading={buildTransactionWithDelegation.isTransactionPending}
                        isDisabled={buildTransactionWithDelegation.isTransactionPending}
                        data-testid="tx-with-modal-button"
                    >
                        useBuildTransaction with modal (delegated)
                    </Button>
                </HStack>
                <HStack mt={5} spacing={4}>
                    <Button
                        onClick={handleUseSendTransactionWithToast}
                        isLoading={sendTransactionNoDelegation.isTransactionPending}
                        isDisabled={sendTransactionNoDelegation.isTransactionPending}
                        data-testid="tx-with-toast-button"
                    >
                        useSendTransaction with toast (no delegation)
                    </Button>
                    <Button
                        onClick={handleSendTransactionDelegatedWithModal}
                        isLoading={sendTransactionWithDelegation.isTransactionPending}
                        isDisabled={sendTransactionWithDelegation.isTransactionPending}
                        data-testid="tx-with-modal-button"
                    >
                        useSendTransaction with modal (delegated)
                    </Button>
                </HStack>
            </Box>

            <TransactionToast
                isOpen={isTransactionToastOpen}
                onClose={closeTransactionToast}
                status={
                    currentModalType === 'useBuildTxWithToast'
                        ? buildTransactionNoDelegation.status
                        : sendTransactionNoDelegation.status
                }
                txError={
                    currentModalType === 'useBuildTxWithToast'
                        ? buildTransactionNoDelegation.error
                        : sendTransactionNoDelegation.error
                }
                txReceipt={
                    currentModalType === 'useBuildTxWithToast'
                        ? buildTransactionNoDelegation.txReceipt
                        : sendTransactionNoDelegation.txReceipt
                }
                onTryAgain={
                    currentModalType === 'useBuildTxWithToast'
                        ? retryBuildTransactionNoDelegation
                        : retrySendTransactionNoDelegation
                }
                description={`This is a dummy transaction to test the transaction modal. Confirm to transfer 0 B3TR to ${humanAddress(
                    account?.address ?? '',
                )}`}
            />

            {/* Single conditional modal that switches content based on currentModalType */}
            <TransactionModal
                isOpen={isTransactionModalOpen}
                onClose={closeModalAndReset}
                status={
                    currentModalType === 'useBuildTxWithDelegation'
                        ? buildTransactionWithDelegation.status ?? buildTransactionNoDelegation.status
                        : sendTransactionWithDelegation.status ?? sendTransactionNoDelegation.status
                }
                txReceipt={
                    currentModalType === 'useBuildTxWithDelegation'
                        ? buildTransactionWithDelegation.txReceipt ?? buildTransactionNoDelegation.txReceipt
                        : sendTransactionWithDelegation.txReceipt ?? sendTransactionNoDelegation.txReceipt
                }
                txError={
                    currentModalType === 'useBuildTxWithDelegation'
                        ? buildTransactionWithDelegation.error ?? buildTransactionNoDelegation.error
                        : sendTransactionWithDelegation.error ?? sendTransactionNoDelegation.error
                }
                onTryAgain={
                    currentModalType === 'useBuildTxWithDelegation'
                        ? retryBuildTransactionDelegated
                        : retrySendTransactionDelegated
                }
                uiConfig={{
                    title:
                        currentModalType === 'useBuildTxWithDelegation'
                            ? 'Test Transaction with DApp Sponsored'
                            : 'Test Transaction with useSendTransaction',
                    description: `This is a dummy transaction to test the transaction modal. Confirm to transfer 0 B3TR to ${humanAddress(
                        account?.address ?? '',
                    )}`,
                    showShareOnSocials: true,
                    showExplorerButton: true,
                    isClosable: true,
                }}
            />
        </>
    );
}
