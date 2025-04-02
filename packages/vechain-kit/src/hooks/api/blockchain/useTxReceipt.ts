'use client';

import { useState, useEffect } from 'react';
import { useThor } from '@vechain/dapp-kit-react';
import {
    Poll,
    ThorClient,
    type TransactionReceipt,
} from '@vechain/sdk-network';

/**
 * Poll the chain for a transaction receipt until it is found (or timeout after 5 blocks)
 * @param thor Thor instance
 * @param id Transaction id
 * @param blocksTimeout Number of blocks to wait for the receipt
 * @returns Transaction receipt
 */
export const pollForReceipt = async (
    thor: ThorClient,
    id?: string,
    blocksTimeout = 5,
): Promise<TransactionReceipt> => {
    if (!id) throw new Error('No transaction id provided');

    let receipt;

    // Query the transaction until it has a receipt
    for (let i = 0; i < blocksTimeout; i++) {
        receipt = await thor.transactions.getTransactionReceipt(id);
        if (receipt) {
            break;
        }

        // Wait until a new block is created
        const currentBlock = await thor.blocks.getBestBlockCompressed();
        await Poll.SyncPoll(
            // Get the latest block as polling target function
            async () => await thor.blocks.getBlockCompressed('best'),
            // Optional: Set polling interval (default is 1000ms)
            { requestIntervalInMilliseconds: 3000 },
        ).waitUntil((newBlockData) => {
            // Stop polling when the new block number is greater than the current block number
            return (
                (newBlockData?.number as number) >
                (currentBlock?.number as number)
            );
        });
    }

    if (!receipt) {
        throw new Error('Transaction receipt not found');
    }

    return receipt;
};

/**
 * Get the tx receipt of a tx id with a block timeout to wait for the receipt
 * @param txId The tx id to get the receipt
 * @param blockTimeout The block timeout to wait for the receipt
 * @returns The tx receipt
 */
export const useTxReceipt = (txId?: string, blockTimeout?: number) => {
    const thor = useThor();
    const [receipt, setReceipt] = useState<TransactionReceipt | null>();
    const [error, setError] = useState<Error | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchReceipt = async () => {
            if (!txId) {
                setReceipt(null);
                return;
            }

            setIsLoading(true);
            try {
                const result = await pollForReceipt(thor, txId, blockTimeout);
                setReceipt(result);
            } catch (e) {
                setError(e instanceof Error ? e : new Error('Unknown error'));
            } finally {
                setIsLoading(false);
            }
        };

        fetchReceipt();
    }, [txId, blockTimeout, thor]);

    return {
        data: receipt,
        error,
        isLoading,
    };
};
