'use client';

import { useState, useRef, useEffect } from 'react';
import { useThor } from '@vechain/dapp-kit-react';
import { CompressedBlockDetail } from '@vechain/sdk-network';
import { useQuery } from '@tanstack/react-query';
import { TIME } from '@/utils';

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
    const thor = useThor();
    const headBlockRef = useRef<CompressedBlockDetail | null>(
        thor.blocks.getHeadBlock(),
    );
    const [isPolling, setIsPolling] = useState(true);

    useEffect(() => {
        if (!headBlockRef.current) {
            const headBlock = thor.blocks.getHeadBlock();
            if (headBlock) headBlockRef.current = headBlock;
        }

        return () => {
            headBlockRef.current = null;
        };
    }, [thor]);

    return useQuery({
        queryKey: txReceiptQueryKey(txId),
        queryFn: async () => {
            const headBlock = thor.blocks.getHeadBlock();
            if (
                headBlockRef.current &&
                headBlock &&
                headBlock.number - headBlockRef.current.number >= blockTimeout
            ) {
                setIsPolling(false);
                throw new Error('Transaction receipt not found');
            }
            const response = await thor.transactions.getTransactionReceipt(
                txId,
            );

            // transaction not found
            if (!response) return null;

            if (response.reverted) throw new Error('Transaction reverted');

            setIsPolling(false);
            return response;
        },
        refetchInterval: isPolling ? BLOCK_GENERATION_INTERVAL : false,
    });
};
