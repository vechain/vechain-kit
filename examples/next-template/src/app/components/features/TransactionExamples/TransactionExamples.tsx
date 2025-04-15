'use client';

import { Box, Button, Heading, HStack } from '@chakra-ui/react';
import {
    useWallet,
    useBuildTransaction,
    useTransactionModal,
    useTransactionToast,
    TransactionModal,
    TransactionToast,
    EnhancedClause,
} from '@vechain/vechain-kit';
import { IB3TR__factory } from '@vechain/vechain-kit/contracts';
import { humanAddress } from '@vechain/vechain-kit/utils';
import { b3trMainnetAddress } from '../../../constants';
import { useMemo, useCallback } from 'react';

export function TransactionExamples() {
    const { account, connectedWallet } = useWallet();

    const clauseBuilder = useCallback((): EnhancedClause[] => {
        if (!connectedWallet?.address) return [];

        const B3TRInterface = IB3TR__factory.createInterface();

        const clausesArray: EnhancedClause[] = [];
        clausesArray.push({
            to: b3trMainnetAddress,
            value: '0x0',
            data: B3TRInterface.encodeFunctionData('transfer', [
                connectedWallet?.address,
                '0', // 0 B3TR (in wei)
            ]),
            comment: `This is a dummy transaction to test the transaction modal. Confirm to transfer ${0} B3TR to ${humanAddress(
                connectedWallet?.address,
            )}`,
            abi: B3TRInterface.getFunction('transfer'),
        });

        return clausesArray;
    }, [connectedWallet?.address]);

    const {
        sendTransaction,
        status,
        txReceipt,
        isTransactionPending,
        error,
        resetStatus,
    } = useBuildTransaction({
        clauseBuilder,
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

    const handleTransactionWithToast = useCallback(async () => {
        openTransactionToast();
        await sendTransaction();
    }, [sendTransaction, openTransactionToast]);

    const handleTransactionWithModal = useCallback(async () => {
        openTransactionModal();
        await sendTransaction();
    }, [sendTransaction, openTransactionModal]);

    const handleTryAgain = useCallback(async () => {
        resetStatus();
        await sendTransaction();
    }, [sendTransaction, resetStatus]);

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
                txError={error}
                txReceipt={txReceipt}
                onTryAgain={handleTryAgain}
            />

            <TransactionModal
                isOpen={isTransactionModalOpen}
                onClose={closeTransactionModal}
                status={status}
                txReceipt={txReceipt}
                txError={error}
                onTryAgain={handleTryAgain}
                uiConfig={{
                    title: 'Test Transaction',
                    description: `This is a dummy transaction to test the transaction modal. Confirm to transfer ${0} B3TR to ${
                        account?.address
                    }`,
                    showShareOnSocials: true,
                    showExplorerButton: true,
                    isClosable: true,
                }}
            />
        </>
    );
}
