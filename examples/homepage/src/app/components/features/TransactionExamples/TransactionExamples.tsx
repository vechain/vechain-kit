'use client';

import { VStack, Text, SimpleGrid, Button, Link } from '@chakra-ui/react';
import { MdSend } from 'react-icons/md';
import { FaCode } from 'react-icons/fa';
import { useMemo, useCallback } from 'react';
import { CollapsibleCard } from '../../ui/CollapsibleCard';
import {
    useWallet,
    useBuildTransaction,
    useTransactionModal,
    useTransactionToast,
    TransactionModal,
    TransactionToast,
} from '@vechain/vechain-kit';
import { IB3TR__factory } from '@vechain/vechain-kit/contracts';
import { b3trMainnetAddress } from '../../../constants';

export function TransactionExamples() {
    const { account } = useWallet();

    const clauseBuilder = useCallback(() => {
        const B3TRInterface = IB3TR__factory.createInterface();

        return [
            {
                to: b3trMainnetAddress,
                value: '0x0',
                data: B3TRInterface.encodeFunctionData('transfer', [
                    account?.address ?? '',
                    '0',
                ]),
                comment: `This is a dummy transaction to test the transaction modal. Confirm to transfer 0 B3TR to ${account?.address}`,
                abi: B3TRInterface.getFunction('transfer'),
            },
        ];
    }, [account?.address]);

    const {
        sendTransaction,
        status,
        txReceipt,
        isTransactionPending,
        error,
        resetStatus,
    } = useBuildTransaction({
        clauseBuilder,
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
        </CollapsibleCard>
    );
}
