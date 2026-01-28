'use client';

import { useOptionalThor } from '../../api/dappkit/useOptionalThor';
import { useQuery } from '@tanstack/react-query';
import { TIME } from '../../../utils';

const BLOCK_GENERATION_INTERVAL = 10 * TIME.SECOND;

export const txReceiptQueryKey = (txId: string) => [
    'VECHAIN_KIT',
    'TX_RECEIPT',
    txId,
];

/**
 * Retrieve the receipt of a transaction identified by its ID.
 * If the transaction is not found, the response will be null.
 * @param txId The ID of the transaction to retrieve the receipt for
 * @param blockTimeout Optional timeout in milliseconds to stop polling for receipt
 * @returns Query result containing the transaction receipt
 */
export const useTxReceipt = (txId: string, blockTimeout = 5) => {
    // Use optional Thor hook that handles missing provider gracefully
    const thor = useOptionalThor();

    return useQuery({
        queryKey: txReceiptQueryKey(txId),
        queryFn: async () => {
            if (!thor) throw new Error('Thor client not available');
            const response = await thor.transactions.waitForTransaction(txId, {
                timeoutMs: blockTimeout * BLOCK_GENERATION_INTERVAL,
                intervalMs: 3000
            });

            if (!response) throw new Error('Transaction receipt not found');

            return response;
        },
        enabled: !!thor && !!txId,
    });
};
