'use client';

import { VStack, Text, SimpleGrid, Box, Code, Button } from '@chakra-ui/react';
import { MdAccountBalance } from 'react-icons/md';
import { CollapsibleCard } from '../../ui/CollapsibleCard';
import {
    useWallet,
    useCurrentAllocationsRoundId,
    useSelectedGmNft,
    useParticipatedInGovernance,
    useIsPerson,
    useSendTransaction,
    useTransactionModal,
    useTransactionToast,
} from '@vechain/vechain-kit';
import { TransactionModal, TransactionToast } from '@vechain/vechain-kit';

export function DaoInfo() {
    const { account } = useWallet();
    const { data: currentAllocationsRoundId } = useCurrentAllocationsRoundId();
    const { gmId } = useSelectedGmNft(account?.address ?? '');
    const { data: participatedInGovernance } = useParticipatedInGovernance(
        account?.address ?? '',
    );
    const { data: isValidPassport } = useIsPerson(account?.address);

    // Transaction handling
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

    const handleDummyTransaction = async (useModal = true) => {
        const clauses = [
            {
                to: '0x0000000000000000000000000000000000000000',
                value: '0x0',
                data: '0x',
                comment:
                    'This is a dummy transaction to demonstrate the Kit features',
            },
        ];

        if (useModal) {
            openTransactionModal();
        } else {
            openTransactionToast();
        }

        await sendTransaction(clauses);
    };

    return (
        <CollapsibleCard title="Contract Interactions" icon={MdAccountBalance}>
            <VStack spacing={6} align="stretch">
                <Text textAlign="center">
                    VeChain Kit provides hooks to easily interact with popular
                    VeChain contracts. Here's how to use them in your
                    application.
                </Text>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    {/* Current Implementation */}
                    <VStack
                        spacing={4}
                        p={6}
                        borderRadius="md"
                        bg="whiteAlpha.50"
                    >
                        <Text fontWeight="bold">Live VeBetterDAO Data</Text>
                        <VStack spacing={3} align="start" w="full">
                            <Text>
                                <Text as="span" fontWeight="bold">
                                    Current Round ID:{' '}
                                </Text>
                                {currentAllocationsRoundId}
                            </Text>
                            <Text>
                                <Text as="span" fontWeight="bold">
                                    Selected GM NFT:{' '}
                                </Text>
                                {gmId === '0' ? 'None' : gmId}
                            </Text>
                            <Text>
                                <Text as="span" fontWeight="bold">
                                    Participated:{' '}
                                </Text>
                                {participatedInGovernance?.toString()}
                            </Text>
                            <Text>
                                <Text as="span" fontWeight="bold">
                                    Valid Passport:{' '}
                                </Text>
                                {isValidPassport?.toString()}
                            </Text>
                        </VStack>
                    </VStack>

                    {/* Transaction Examples */}
                    <VStack
                        spacing={4}
                        p={6}
                        borderRadius="md"
                        bg="whiteAlpha.50"
                    >
                        <Text fontWeight="bold">Transaction Examples</Text>
                        <VStack spacing={3} w="full">
                            <Button
                                onClick={() => handleDummyTransaction(true)}
                                isLoading={isTransactionPending}
                                isDisabled={isTransactionPending}
                            >
                                Test with Modal
                            </Button>
                            <Button
                                onClick={() => handleDummyTransaction(false)}
                                isLoading={isTransactionPending}
                                isDisabled={isTransactionPending}
                            >
                                Test with Toast
                            </Button>
                        </VStack>
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
                                {`// Transaction hooks
const {
  sendTransaction,
  status,
  txReceipt,
  isTransactionPending,
} = useSendTransaction({
  signerAccountAddress: address
});

// UI components hooks
const {
  open: openModal,
  close: closeModal,
  isOpen: isModalOpen,
} = useTransactionModal();

const {
  open: openToast,
  close: closeToast,
  isOpen: isToastOpen,
} = useTransactionToast();`}
                            </Code>
                        </Box>
                    </VStack>
                </SimpleGrid>

                <Text fontSize="sm" textAlign="center" color="gray.400">
                    Note: These hooks automatically handle contract interactions
                    and state management for you.
                </Text>

                {/* Transaction UI Components */}
                <TransactionModal
                    isOpen={isTransactionModalOpen}
                    onClose={closeTransactionModal}
                    status={status}
                    progress={progress}
                    txId={txReceipt?.meta.txID}
                    errorDescription={error?.reason ?? 'Unknown error'}
                    showSocialButtons={true}
                    showExplorerButton={true}
                    onTryAgain={() => handleDummyTransaction(true)}
                    showTryAgainButton={true}
                />

                <TransactionToast
                    isOpen={isTransactionToastOpen}
                    onClose={closeTransactionToast}
                    status={status}
                    error={error}
                    txReceipt={txReceipt}
                    resetStatus={resetStatus}
                    progress={progress}
                />
            </VStack>
        </CollapsibleCard>
    );
}
