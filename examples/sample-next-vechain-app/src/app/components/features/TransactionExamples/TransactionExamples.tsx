'use client';

import {
    VStack,
    Text,
    SimpleGrid,
    Box,
    Button,
    Link,
    Code,
} from '@chakra-ui/react';
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

    const codeExample = `const { account } = useWallet();
const b3trMainnetAddress = getConfig("main").b3trContractAddress;

const clauses = useMemo(() => {
    const B3TRInterface = IB3TR__factory.createInterface();

    const clausesArray: any[] = [];
    clausesArray.push({
        to: b3trMainnetAddress,
        value: '0x0',
        data: B3TRInterface.encodeFunctionData('transfer', [
            "0x0, // receiver address
            '0', // 0 B3TR (in wei)
        ]),
        comment: \`This is a dummy transaction to test the transaction modal. Confirm to transfer \${0} B3TR to \${humanAddress(
    'Ox0',
)}\`,
        abi: B3TRInterface.getFunction('transfer'),
    });

    return clausesArray;
}, [connectedWallet?.address]);

const {
    sendTransaction,
} = useSendTransaction({
    signerAccountAddress: account?.address ?? '',
});

// This is the function triggering the transaction
const handleTransaction = useCallback(async () => {
    await sendTransaction(clauses);
}, [sendTransaction, clauses]);

return (
    <>
        <button
            onClick={handleTransactionWithModal}
            isLoading={isTransactionPending}
            isDisabled={isTransactionPending}
        >
            Send B3TR
        </button>
    </>
);`;

    return (
        <CollapsibleCard
            defaultIsOpen
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
                        <Box
                            w="full"
                            p={3}
                            bg="blackAlpha.300"
                            borderRadius="md"
                        >
                            <Link
                                isExternal
                                my={2}
                                href="https://vechain-foundation-san-marino.gitbook.io/vechain-kit/vechain-kit/send-transactions"
                            >
                                View full code
                            </Link>

                            <Code
                                display="block"
                                whiteSpace="pre"
                                p={2}
                                overflowX="auto"
                            >
                                {codeExample}
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
