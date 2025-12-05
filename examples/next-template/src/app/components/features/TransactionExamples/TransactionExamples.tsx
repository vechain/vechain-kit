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
} from '@vechain/vechain-kit';
import { IB3TR__factory } from '@vechain/vechain-contract-types';
import { humanAddress } from '@vechain/vechain-kit/utils';
import { b3trMainnetAddress } from '../../../constants';
import { useCallback } from 'react';

export function TransactionExamples() {
    const { account } = useWallet();
    const thor = useThor();

    const {
        sendTransaction,
        status,
        txReceipt,
        isTransactionPending,
        error,
        resetStatus,
    } = useBuildTransaction({
        clauseBuilder: () => {
            if (!account?.address) return [];

            return [
                {
                    ...thor.contracts
                        .load(b3trMainnetAddress, IB3TR__factory.abi)
                        .clause.transfer(account.address, BigInt('0')).clause,
                    comment: `This is a dummy transaction to test the transaction modal. Confirm to transfer 0 B3TR to ${account?.address}`,
                },
            ];
        },
        refetchQueryKeys: [],
        onSuccess: () => {},
        onFailure: () => {},
        suggestedMaxGas: undefined,
    });

    const buildTransactionWithDAppSponsored = useBuildTransaction({
        clauseBuilder: () => {
            if (!account?.address) return [];

            return [
                {
                    ...thor.contracts
                        .load(b3trMainnetAddress, IB3TR__factory.abi)
                        .clause.transfer(account.address, BigInt('0')).clause,
                    comment: `This is a dummy transaction to test the transaction modal. Confirm to transfer 0 B3TR to ${account?.address}`,
                },
            ];
        },
        refetchQueryKeys: [],
        onSuccess: () => {},
        onFailure: () => {},
        suggestedMaxGas: undefined,
        // dAppSponsoredUrl: "", <--- YOUR DELEGATOR URL HERE
    });

    const {
        open: openTransactionModal,
        close: closeTransactionModal,
        isOpen: isTransactionModalOpen,
    } = useTransactionModal();

    const {
        open: openTransactionToast,
        close: closeTransactionToast,
        isOpen: isTransactionToastOpen,
    } = useTransactionToast();

    const handleTransactionWithToast = useCallback(async () => {
        openTransactionToast();
        await sendTransaction({});
    }, [sendTransaction, openTransactionToast]);

    const handleTransactionWithModal = useCallback(async () => {
        openTransactionModal();
        await (buildTransactionWithDAppSponsored.sendTransaction({}) ?? sendTransaction({}));
    }, [buildTransactionWithDAppSponsored, openTransactionModal, sendTransaction]);

    const handleTryAgain = useCallback(async () => {
        resetStatus();
        await sendTransaction({});
    }, [sendTransaction, resetStatus]);

    const handleTryAgainWithSponsoredModal = buildTransactionWithDAppSponsored ? useCallback(async () => {
        buildTransactionWithDAppSponsored.resetStatus();
        await buildTransactionWithDAppSponsored.sendTransaction({});
    }, [buildTransactionWithDAppSponsored]) : null;

    return (
        <>
            <Box>
                <Heading size="md">
                    <b>Test Transactions</b>
                </Heading>
                <HStack mt={4} spacing={4}>
                    <Button
                        onClick={handleTransactionWithToast}
                        isLoading={isTransactionPending}
                        isDisabled={isTransactionPending}
                        data-testid="tx-with-toast-button"
                    >
                        Tx with toast
                    </Button>
                    <Button
                        onClick={handleTransactionWithModal}
                        isLoading={buildTransactionWithDAppSponsored.isTransactionPending ?? isTransactionPending}
                        isDisabled={buildTransactionWithDAppSponsored.isTransactionPending ?? isTransactionPending}
                        data-testid="tx-with-modal-button"
                    >
                        Tx with modal
                    </Button>
                </HStack>
            </Box>

            <TransactionToast
                isOpen={isTransactionToastOpen}
                onClose={closeTransactionToast}
                status={status}
                txError={error}
                txReceipt={txReceipt}
                onTryAgain={handleTryAgain}
                description={`This is a dummy transaction to test the transaction modal. Confirm to transfer 0 B3TR to ${humanAddress(
                    account?.address ?? '',
                )}`}
            />

            <TransactionModal
                isOpen={isTransactionModalOpen}
                onClose={closeTransactionModal}
                status={buildTransactionWithDAppSponsored.status ?? status}
                txReceipt={buildTransactionWithDAppSponsored.txReceipt ?? txReceipt}
                txError={buildTransactionWithDAppSponsored.error ?? error}
                onTryAgain={handleTryAgainWithSponsoredModal ?? handleTryAgain}
                uiConfig={{
                    title: 'Test Transaction with DApp Sponsored',
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
