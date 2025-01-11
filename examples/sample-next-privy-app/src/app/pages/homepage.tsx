'use client';

import { type ReactElement, useMemo, useCallback } from 'react';
import {
    Button,
    Container,
    Heading,
    HStack,
    Stack,
    Text,
    useColorMode,
    useDisclosure,
    VStack,
    Box,
    Spinner,
    Grid,
} from '@chakra-ui/react';
import {
    useWallet,
    useSendTransaction,
    WalletButton,
    TransactionModal,
    TransactionToast,
    useDAppKitPrivyColorMode,
    useConnectModal,
    useAccountModal,
    useGetB3trBalance,
} from '@vechain/dapp-kit-react-privy';
import { b3trAbi, b3trMainnetAddress } from '../constants';
import { Interface, ethers } from 'ethers';

const HomePage = (): ReactElement => {
    const { toggleColorMode, colorMode } = useColorMode();
    const { toggleColorMode: toggleDAppKitPrivyColorMode } =
        useDAppKitPrivyColorMode();

    const { connection, selectedAccount, connectedWallet, smartAccount } =
        useWallet();

    const { open } = useConnectModal();
    const { open: openAccountModal } = useAccountModal();

    const { data: b3trBalance, isLoading: b3trBalanceLoading } =
        useGetB3trBalance(smartAccount.address);

    // A dummy tx sending 0 b3tr tokens
    const clauses = useMemo(() => {
        if (!connectedWallet.address) return [];

        const clausesArray: any[] = [];
        const abi = new Interface(b3trAbi);
        clausesArray.push({
            to: b3trMainnetAddress,
            value: '0x0',
            data: abi.encodeFunctionData('transfer', [
                connectedWallet.address,
                '0', // 1 B3TR (in wei)
            ]),
            comment: `Transfer ${0} B3TR to `,
            abi: abi.getFunction('transfer'),
        });
        return clausesArray;
    }, [connectedWallet.address]);

    const {
        sendTransaction,
        status,
        txReceipt,
        resetStatus,
        isTransactionPending,
        error,
    } = useSendTransaction({
        signerAccountAddress: selectedAccount?.address,
        privyUIOptions: {
            title: 'Sign to confirm',
            description:
                'This is a test transaction performing a transfer of 0 B3TR tokens from your smart account.',
            buttonText: 'Sign',
        },
    });

    const transactionToast = useDisclosure();
    const handleTransactionWithToast = useCallback(async () => {
        transactionToast.onOpen();
        await sendTransaction(clauses);
    }, [sendTransaction, clauses]);

    const transactionModal = useDisclosure();
    const handleTransactionWithModal = useCallback(async () => {
        transactionModal.onOpen();
        await sendTransaction(clauses);
    }, [sendTransaction, clauses]);

    if (connection.isLoadingPrivyConnection) {
        return (
            <Container>
                <HStack justifyContent={'center'}>
                    <Spinner />
                </HStack>
            </Container>
        );
    }

    if (!connection.isConnected) {
        return (
            <Container justifyContent={'center'}>
                <VStack>
                    <Button onClick={open}>Login</Button>
                </VStack>
            </Container>
        );
    }

    return (
        <Container>
            <HStack justifyContent={'space-between'}>
                <WalletButton />

                <Button
                    onClick={() => {
                        toggleDAppKitPrivyColorMode();
                        toggleColorMode();
                    }}
                >
                    {colorMode === 'dark' ? 'Light' : 'Dark'}
                </Button>
            </HStack>

            <Stack
                mt={10}
                overflowWrap={'break-word'}
                wordBreak={'break-word'}
                whiteSpace={'normal'}
            >
                <VStack spacing={4} alignItems="flex-start">
                    {smartAccount.address && (
                        <Box mt={4}>
                            <Heading size={'md'}>
                                <b>Smart Account</b>
                            </Heading>
                            <Text>Smart Account: {smartAccount.address}</Text>
                            <Text>
                                Deployed: {smartAccount.isDeployed.toString()}
                            </Text>
                            {b3trBalanceLoading ? (
                                <Spinner />
                            ) : (
                                <Text>
                                    B3TR Balance:{' '}
                                    {ethers.formatEther(b3trBalance ?? '0')}
                                </Text>
                            )}
                        </Box>
                    )}

                    <Box>
                        <Heading size={'md'}>
                            <b>Wallet</b>
                        </Heading>
                        <Text>Address: {connectedWallet?.address}</Text>
                    </Box>

                    <Box>
                        <Heading size={'md'}>
                            <b>Connection</b>
                        </Heading>
                        <Text>Type: {connection.source.type}</Text>
                    </Box>

                    <Box mt={4}>
                        <Heading size={'md'}>
                            <b>Test actions</b>
                        </Heading>
                        <HStack mt={4} spacing={4}>
                            <Grid
                                mt={4}
                                templateColumns={[
                                    'repeat(2, 1fr)',
                                    'repeat(3, 1fr)',
                                ]}
                                gap={4}
                            >
                                <Button onClick={openAccountModal}>
                                    Account Modal
                                </Button>
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
                            </Grid>
                        </HStack>
                    </Box>
                </VStack>
            </Stack>

            <TransactionToast
                isOpen={transactionToast.isOpen}
                onClose={transactionToast.onClose}
                status={status}
                error={error}
                txReceipt={txReceipt}
                resetStatus={resetStatus}
            />

            <TransactionModal
                isOpen={transactionModal.isOpen}
                onClose={transactionModal.onClose}
                status={status}
                txId={txReceipt?.meta.txID}
                errorDescription={error?.reason ?? 'Unknown error'}
                showSocialButtons={true}
                showExplorerButton={true}
            />
        </Container>
    );
};

export default HomePage;
