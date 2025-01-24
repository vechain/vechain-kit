'use client';

import { VStack, Text, SimpleGrid, Box, Code, Button } from '@chakra-ui/react';
import { MdSend } from 'react-icons/md';
import { CollapsibleCard } from '../../ui/CollapsibleCard';
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
        progress,
    } = useSendTransaction({
        signerAccountAddress: account?.address ?? '',
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
        <CollapsibleCard title="Transaction Examples" icon={MdSend}>
            <VStack spacing={6} align="stretch">
                <Text textAlign="center">
                    VeChain Kit provides built-in transaction handling with UI
                    components. Try these examples to see the transaction flow
                    in action.
                </Text>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    {/* Transaction Buttons */}
                    <VStack
                        spacing={4}
                        p={6}
                        borderRadius="md"
                        bg="whiteAlpha.50"
                    >
                        <Text fontWeight="bold">Test Transactions</Text>
                        <VStack spacing={4} w="full">
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
                        </VStack>
                    </VStack>

                    {/* Code Example */}
                    <VStack
                        spacing={4}
                        p={6}
                        borderRadius="md"
                        bg="whiteAlpha.50"
                    >
                        <Text fontWeight="bold">Implementation</Text>
                        <Box
                            w="full"
                            p={3}
                            bg="blackAlpha.300"
                            borderRadius="md"
                        >
                            <Code
                                display="block"
                                whiteSpace="pre"
                                p={2}
                                overflowX="auto"
                            >
                                {`import {
  useSendTransaction,
  useTransactionModal,
  useTransactionToast,
} from '@vechain/vechain-kit';
import { IB3TR__factory } from '@vechain/vechain-kit/contracts';

// Create clauses
const clauses = [{
  to: contractAddress,
  value: '0x0',
  data: interface.encodeFunctionData(
    'transfer',
    [address, amount]
  ),
  comment: 'Transfer tokens',
  abi: interface.getFunction('transfer'),
}];

// Send with UI feedback
openTransactionModal();
await sendTransaction(clauses);`}
                            </Code>
                        </Box>
                    </VStack>
                </SimpleGrid>

                {/* Transaction UI Components */}
                <TransactionToast
                    isOpen={isTransactionToastOpen}
                    onClose={closeTransactionToast}
                    status={status}
                    error={error}
                    txReceipt={txReceipt}
                    resetStatus={resetStatus}
                    progress={progress}
                />

                <TransactionModal
                    isOpen={isTransactionModalOpen}
                    onClose={closeTransactionModal}
                    status={status}
                    progress={progress}
                    txId={txReceipt?.meta.txID}
                    errorDescription={error?.reason ?? 'Unknown error'}
                    showSocialButtons={true}
                    showExplorerButton={true}
                    onTryAgain={handleTransactionWithModal}
                    showTryAgainButton={true}
                />
            </VStack>
        </CollapsibleCard>
    );
}
