import {
    UseSendTransactionReturnValue,
    useRefreshBalances,
    useSendTransaction,
} from '@/hooks';
import { ERC20__factory } from '@hooks/contracts';
import { useMemo } from 'react';
import { humanAddress, isValidAddress } from '@/utils';
import { parseEther } from 'viem';
import { EnhancedClause } from '@/types';

type useTransferERC20Props = {
    fromAddress: string;
    receiverAddress: string;
    amount: string;
    tokenAddress: string;
    tokenName: string;
    onSuccess?: () => void;
    onSuccessMessageTitle?: number;
    onError?: (error?: string) => void;
};

type useTransferERC20ReturnValue = {
    sendTransaction: () => Promise<void>;
    clauses: EnhancedClause[];
} & Omit<UseSendTransactionReturnValue, 'sendTransaction'>;

const ERC20Interface = ERC20__factory.createInterface();

export const buildERC20Clauses = (receiverAddress: string, amount: string, tokenAddress: string, tokenName: string): EnhancedClause[] => {
    if (!receiverAddress || !amount || !isValidAddress(receiverAddress))
        throw new Error('Invalid receiver address or amount');

    const clausesArray: any[] = [];

    clausesArray.push({
        to: tokenAddress,
        value: '0x0',
        data: ERC20Interface.encodeFunctionData('transfer', [
            receiverAddress,
            parseEther(amount),
        ]),
        comment: `Transfer ${amount} ${tokenName} to ${receiverAddress}`,
        abi: ERC20Interface.getFunction('transfer'),
    });
    return clausesArray;
};

export const useTransferERC20 = ({
    fromAddress,
    receiverAddress,
    amount,
    tokenAddress,
    tokenName,
    onSuccess,
    onError,
}: useTransferERC20Props): useTransferERC20ReturnValue => {
    const { refresh } = useRefreshBalances();

    // Memoize the clauses
    const clauses = useMemo(() => buildERC20Clauses(receiverAddress, amount, tokenAddress, tokenName), [receiverAddress, amount, tokenAddress, tokenName]);

    const result = useSendTransaction({
        signerAccountAddress: fromAddress,
        privyUIOptions: {
            title: 'Confirm Transfer',
            description: `Transfer ${amount} ${tokenName} to ${humanAddress(
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
