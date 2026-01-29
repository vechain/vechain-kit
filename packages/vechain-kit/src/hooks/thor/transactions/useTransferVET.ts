// Direct imports to avoid circular dependencies
import { useSendTransaction, UseSendTransactionReturnValue } from './useSendTransaction';
import { useRefreshBalances } from '../../api/wallet/useRefreshBalances';
import { humanAddress, isValidAddress } from '../../../utils';
import { useMemo } from 'react';
import { parseEther } from 'viem';
import type { EnhancedClause } from '../../../types';

type useTransferVETProps = {
    fromAddress: string;
    receiverAddress: string;
    amount: string;
    onSuccess?: () => void;
    onError?: (error?: string) => void;
};

type useTransferVETReturnValue = {
    sendTransaction: () => Promise<void>;
    clauses: EnhancedClause[];
} & Omit<UseSendTransactionReturnValue, 'sendTransaction'>;

export const buildVETClauses = (receiverAddress: string, amount: string): EnhancedClause[] => {
    if (!receiverAddress || !amount || !isValidAddress(receiverAddress))
        throw new Error('Invalid receiver address or amount');

    // Validate amount is a valid number
    if (isNaN(Number(amount))) {
        throw new Error('Invalid amount');
    }

    const clausesArray: EnhancedClause[] = [];

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
};

export const useTransferVET = ({
    fromAddress,
    receiverAddress,
    amount,
    onSuccess,
    onError,
}: useTransferVETProps): useTransferVETReturnValue => {
    const { refresh } = useRefreshBalances();
    
    // Memoize the clauses
    const clauses = useMemo(() => buildVETClauses(receiverAddress, amount), [receiverAddress, amount]);

    const result = useSendTransaction({
        signerAccountAddress: fromAddress,
        privyUIOptions: {
            title: 'Confirm Transfer',
            description: `Transfer ${amount} VET to ${humanAddress(
                receiverAddress,
            )}`,
            buttonText: 'Sign to continue',
        },
        onTxConfirmed: async () => {
            refresh();
            onSuccess?.();
        },
        onTxFailedOrCancelled: async (error) => {
            onError?.(error instanceof Error ? error.message : String(error));
        },
    });

    return {
        ...result,
        clauses,
        sendTransaction: async () => {
            return result.sendTransaction(clauses);
        },
    };
};
