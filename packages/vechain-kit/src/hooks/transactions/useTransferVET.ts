import {
    UseSendTransactionReturnValue,
    useRefreshBalances,
    useSendTransaction,
} from '@/hooks';
import { isValidAddress } from '@/utils';
import { useCallback } from 'react';
import { parseEther } from 'viem';

type useTransferVETProps = {
    fromAddress: string;
    receiverAddress: string;
    amount: string;
    onSuccess?: () => void;
};

type useTransferVETReturnValue = {
    sendTransaction: () => Promise<void>;
} & Omit<UseSendTransactionReturnValue, 'sendTransaction'>;

export const useTransferVET = ({
    fromAddress,
    receiverAddress,
    amount,
    onSuccess,
}: useTransferVETProps): useTransferVETReturnValue => {
    const { refresh } = useRefreshBalances();

    const buildClauses = useCallback(async () => {
        if (!receiverAddress || !amount || !isValidAddress(receiverAddress))
            throw new Error('Invalid receiver address or amount');

        // Validate amount is a valid number
        if (isNaN(Number(amount))) {
            throw new Error('Invalid amount');
        }

        const clausesArray: any[] = [];

        try {
            clausesArray.push({
                to: receiverAddress,
                value: parseEther(amount).toString(), // Convert to string
                data: '0x',
                comment: `Transfer ${amount} VET to ${receiverAddress}`,
            });
        } catch (error) {
            console.error('Error building clauses:', error);
            throw new Error('Invalid amount format');
        }

        return clausesArray;
    }, [receiverAddress, amount]);

    const result = useSendTransaction({
        signerAccountAddress: fromAddress,
        privyUIOptions: {
            title: 'Sign to confirm',
            description: `Transfer ${amount} VET to ${receiverAddress}`,
            buttonText: 'Sign',
        },
        onTxConfirmed: async () => {
            await refresh();
            onSuccess?.();
        },
    });

    return {
        ...result,
        sendTransaction: async () => {
            return result.sendTransaction(await buildClauses());
        },
    };
};
