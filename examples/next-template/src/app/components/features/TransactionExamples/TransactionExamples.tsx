'use client';

import { Box, Button, Heading, HStack } from '@chakra-ui/react';
import {
    useWallet,
    useSendTransaction,
    useTransactionModal,
    useTransactionToast,
    TransactionModal,
    TransactionToast,
} from '@vechain/vechain-kit';
import { IB3TR__factory } from '@vechain/vechain-kit/contracts';
import { humanAddress } from '@vechain/vechain-kit/utils';
import { b3trMainnetAddress } from '../../../constants';
import { useMemo, useCallback } from 'react';

export function TransactionExamples() {
    const { account, connectedWallet } = useWallet();

    const {
        sendTransaction,
        status,
        txReceipt,
        resetStatus,
        isTransactionPending,
        error,
    } = useSendTransaction({
        signerAccountAddress: account?.address ?? '',
        privyUIOptions: {
            title: 'Send Dummy Transaction',
            description: `This is a dummy transaction to test the transaction modal. Confirm to transfer ${0} B3TR to ${humanAddress(
                account?.address ?? '',
            )}`,
            buttonText: 'Sign to continue',
        },
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

    const clauses = useMemo(() => {
        if (!connectedWallet?.address) return [];

        const B3TRInterface = IB3TR__factory.createInterface();

        const clausesArray: any[] = [];
        clausesArray.push({
            to: b3trMainnetAddress,
            value: '0x0',
            data: B3TRInterface.encodeFunctionData('transfer', [
                connectedWallet?.address,
                '0', // 1 B3TR (in wei)
            ]),
            comment: `This is a dummy transaction to test the transaction modal. Confirm to transfer ${0} B3TR to ${humanAddress(
                connectedWallet?.address,
            )}`,
            abi: B3TRInterface.getFunction('transfer'),
        });

        return clausesArray;
    }, [connectedWallet?.address]);

    const handleTransactionWithToast = useCallback(async () => {
        openTransactionToast();
        await sendTransaction(clauses);
    }, [sendTransaction, clauses, openTransactionToast]);

    const handleTransactionWithModal = useCallback(async () => {
        openTransactionModal();
        await sendTransaction(clauses);
    }, [sendTransaction, clauses, openTransactionModal]);

    return (
        <>
            <Box>
                <Heading size={'md'}>
                    <b>Test Transactions</b>
                </Heading>
                <HStack mt={4} spacing={4}>
                    <Button
                        onClick={handleTransactionWithToast}
                        isLoading={isTransactionPending}
                        isDisabled={isTransactionPending}
                    >
                        Tx with toast
                    </Button>
                    <Button
                        onClick={handleTransactionWithModal}
                        isLoading={isTransactionPending}
                        isDisabled={isTransactionPending}
                    >
                        Tx with modal
                    </Button>
                </HStack>
            </Box>

            <TransactionToast
                isOpen={isTransactionToastOpen}
                onClose={closeTransactionToast}
                status={status}
                error={error}
                txReceipt={txReceipt}
                resetStatus={resetStatus}
            />

            <TransactionModal
                isOpen={isTransactionModalOpen}
                onClose={closeTransactionModal}
                status={status}
                txReceipt={txReceipt}
                txError={error}
                showSocialButtons={true}
                showExplorerButton={true}
                onTryAgain={handleTransactionWithModal}
                description={`This is a dummy transaction to test the transaction modal. Confirm to transfer ${0} B3TR to ${
                    account?.address
                }`}
            />
        </>
    );
}
