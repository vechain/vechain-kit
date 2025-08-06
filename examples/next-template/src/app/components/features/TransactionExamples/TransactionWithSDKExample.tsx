'use client';

import { Box, Button, Heading, HStack, Text } from '@chakra-ui/react';
import { useWallet, useThor, TransactionStatus } from '@vechain/vechain-kit';
import { IB3TR__factory } from '@vechain/vechain-contract-types';
import { b3trMainnetAddress } from '../../../constants';
import { useCallback, useMemo, useState } from 'react';

export function TransactionWithSDKExample() {
    const { account, signer } = useWallet();
    const thor = useThor();

    const [status, setStatus] = useState<TransactionStatus>('ready');
    const [txReceipt, setTxReceipt] = useState<any>(null);
    const [error, setError] = useState<any>(null);
    const [isTransactionPending, setIsTransactionPending] = useState(false);

    const clauses = useMemo(() => {
        if (!account?.address) return [];

        return [
            {
                ...thor.contracts
                    .load(b3trMainnetAddress, IB3TR__factory.abi)
                    .clause.transfer(account.address, '0').clause,
                comment: `This is a dummy transaction to test the transaction modal. Confirm to transfer 0 B3TR to ${account?.address}`,
            },
        ];
    }, [account?.address, thor]);

    // SDK-based transaction sending
    const sendTransactionWithSDK = useCallback(async () => {
        if (!account || !signer || !clauses.length) {
            setError({ reason: 'Signer or clauses missing' });
            setStatus('error');
            return;
        }
        setIsTransactionPending(true);
        setStatus('pending');
        setError(null);
        setTxReceipt(null);

        try {
            // Estimate gas
            const gasResult = await thor.transactions.estimateGas(
                clauses,
                account.address,
            );
            // Build transaction body
            const txBody = await thor.transactions.buildTransactionBody(
                clauses,
                gasResult.totalGas,
            );
            // Sign transaction
            const rawSignedTransaction = await signer.signTransaction(txBody);
            // Send transaction
            const sendResult = await thor.transactions.sendTransaction(
                rawSignedTransaction,
            );
            // Wait for receipt
            const receipt = await thor.transactions.waitForTransaction(
                sendResult.id,
            );
            setTxReceipt(receipt);
            setStatus('success');
        } catch (err) {
            setError(err);
            setStatus('error');
        } finally {
            setIsTransactionPending(false);
        }
    }, [signer, clauses, thor, account?.address]);

    const handleTransaction = useCallback(async () => {
        await sendTransactionWithSDK();
    }, [sendTransactionWithSDK]);

    return (
        <>
            <Box>
                <Heading size="md">
                    <b>Test Transactions with SDK "signer"</b>
                </Heading>
                <HStack mt={4} spacing={4}>
                    <Button
                        onClick={handleTransaction}
                        isLoading={isTransactionPending}
                        isDisabled={isTransactionPending}
                        data-testid="tx-with-toast-button"
                    >
                        Tx with toast
                    </Button>
                </HStack>
                {status && <Text>Status: {status}</Text>}
                {txReceipt && (
                    <Text>Tx Receipt: {JSON.stringify(txReceipt)}</Text>
                )}
                {error && <Text>Error: {JSON.stringify(error)}</Text>}
            </Box>
        </>
    );
}
