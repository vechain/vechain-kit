'use client';

import { VStack, Text, SimpleGrid, Button, Link } from '@chakra-ui/react';
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
import { b3trMainnetAddress } from '../../../constants';
import { useMemo, useCallback } from 'react';
import { FaCode } from 'react-icons/fa';
import { humanAddress } from '@vechain/vechain-kit/utils';

export function TransactionExamples() {
    const { account } = useWallet();

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
        const B3TRInterface = IB3TR__factory.createInterface();

        const clausesArray: any[] = [];
        clausesArray.push({
            to: b3trMainnetAddress,
            value: '0x0',
            data: B3TRInterface.encodeFunctionData('transfer', [
                account?.address ?? '',
                '0', // 1 B3TR (in wei)
            ]),
            comment: `This is a dummy transaction to test the transaction modal. Confirm to transfer ${0} B3TR to ${
                account?.address
            }`,
            abi: B3TRInterface.getFunction('transfer'),
        });

        return clausesArray;
    }, [account?.address]);

    const handleTransactionWithToast = useCallback(async () => {
        openTransactionToast();
        await sendTransaction(clauses);
    }, [sendTransaction, clauses, openTransactionToast]);

    const handleTransactionWithModal = useCallback(async () => {
        openTransactionModal();
        await sendTransaction(clauses);
    }, [sendTransaction, clauses, openTransactionModal]);

    return (
        <CollapsibleCard
            defaultIsOpen={false}
            title="Transaction Examples"
            icon={MdSend}
        >
            <VStack spacing={6} align="stretch">
                <Text textAlign="center">
                    VeChain Kit provides built-in transaction handling with UI
                    components. Try these examples to see the transaction flow
                    in action.
                </Text>

                <SimpleGrid columns={{ base: 1, md: 1 }} spacing={6}>
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
                        <Text my={2} fontWeight="bold">
                            Implementation
                        </Text>
                        <Button
                            as={Link}
                            isExternal
                            href="https://github.com/vechain/vechain-kit/blob/main/examples/next-template/src/app/components/features/TransactionExamples/TransactionExamples.tsx"
                            w="full"
                            variant="outline"
                            rightIcon={<FaCode />}
                        >
                            View Code Example
                        </Button>
                        <Button
                            as={Link}
                            isExternal
                            href="https://docs.vechainkit.vechain.org/vechain-kit/send-transactions"
                            w="full"
                            variant="outline"
                            rightIcon={<MdSend />}
                        >
                            Read Docs
                        </Button>
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
