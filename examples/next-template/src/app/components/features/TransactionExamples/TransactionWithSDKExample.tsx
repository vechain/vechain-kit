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

    const b3trContract = useMemo(() => {
        if (!signer) return null;

        return thor.contracts.load(
            b3trMainnetAddress,
            IB3TR__factory.abi,
            signer,
        );
    }, [thor, signer]);

    // SDK-based transaction sending
    const sendTransactionWithSDK = useCallback(async () => {
        if (!account || !signer || !b3trContract) {
            setError({ reason: 'Signer or clauses missing' });
            setStatus('error');
            return;
        }
        setIsTransactionPending(true);
        setStatus('pending');
        setError(null);
        setTxReceipt(null);

        try {
            const receipt = await b3trContract.transact.transfer(
                account.address,
                '0',
            );
            setTxReceipt(receipt);
            await receipt.wait();
            setStatus('success');
        } catch (err) {
            setError(err);
            setStatus('error');
        } finally {
            setIsTransactionPending(false);
        }
    }, [signer, b3trContract, account?.address]);

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
