'use client';

import { VStack, Text, SimpleGrid, Button, HStack } from '@chakra-ui/react';
import { useCallback } from 'react';
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
import { b3trMainnetAddress } from '../../../constants';

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
        gasPadding: 0.25, //Testing with 25% padding
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
        await sendTransaction({});
    }, [sendTransaction, openTransactionModal]);

    const handleTryAgain = useCallback(async () => {
        resetStatus();
        await sendTransaction({});
    }, [sendTransaction, resetStatus]);

    return (
        <VStack spacing={6} align="stretch" w="full">
            <Text fontSize="xl" fontWeight="bold">
                Transaction Handling Examples
            </Text>

            <SimpleGrid columns={{ base: 1, md: 1 }} spacing={6}>
                <VStack spacing={4} p={6} borderRadius="md" bg="whiteAlpha.50">
                    <Text fontWeight="bold">
                        Test a transaction sending 0 value to yourself.
                    </Text>
                    <HStack spacing={4} w="full" justifyContent="space-between">
                        <Button
                            onClick={handleTransactionWithToast}
                            isLoading={isTransactionPending}
                            isDisabled={isTransactionPending}
                            w="full"
                        >
                            Test with Toast
                        </Button>
                        <Button
                            onClick={handleTransactionWithModal}
                            isLoading={isTransactionPending}
                            isDisabled={isTransactionPending}
                            w="full"
                        >
                            Test with Modal
                        </Button>
                    </HStack>
                </VStack>
            </SimpleGrid>

            <TransactionToast
                isOpen={isTransactionToastOpen}
                onClose={closeTransactionToast}
                status={status}
                txError={error}
                txReceipt={txReceipt}
                onTryAgain={handleTryAgain}
                description={`This is a dummy transaction to test the transaction modal. Confirm to transfer 0 B3TR to ${account?.address}`}
            />

            <TransactionModal
                isOpen={isTransactionModalOpen}
                onClose={closeTransactionModal}
                status={status}
                txReceipt={txReceipt}
                onTryAgain={handleTryAgain}
                txError={error}
                uiConfig={{
                    title: 'Test Transaction',
                    description: `This is a dummy transaction to test the transaction modal. Confirm to transfer 0 B3TR to ${account?.address}`,
                    showShareOnSocials: true,
                    showExplorerButton: true,
                    isClosable: true,
                }}
            />
        </VStack>
    );
}
