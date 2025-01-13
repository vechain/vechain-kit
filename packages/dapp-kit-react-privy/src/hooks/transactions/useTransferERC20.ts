import {
    UseSendTransactionReturnValue,
    useRefreshBalances,
    useSendTransaction,
} from '@/hooks';
import { useCallback } from 'react';
import { ERC20__factory } from '@/contracts/typechain-types';
import { ethers } from 'ethers';
import { useQueryClient } from '@tanstack/react-query';
import { isValidAddress } from '@/utils';

type useTransferERC20Props = {
    fromAddress: string;
    receiverAddress: string;
    amount: string;
    tokenAddress: string;
    tokenName: string;
    onSuccess?: () => void;
    onSuccessMessageTitle?: number;
};

type useTransferERC20ReturnValue = {
    sendTransaction: () => Promise<void>;
} & Omit<UseSendTransactionReturnValue, 'sendTransaction'>;

const ERC20Interface = ERC20__factory.createInterface();

export const useTransferERC20 = ({
    fromAddress,
    receiverAddress,
    amount,
    tokenAddress,
    tokenName,
    onSuccess,
}: useTransferERC20Props): useTransferERC20ReturnValue => {
    const queryClient = useQueryClient();
    const { refresh } = useRefreshBalances();

    const buildClauses = useCallback(async () => {
        if (!receiverAddress || !amount || !isValidAddress(receiverAddress))
            throw new Error('Invalid receiver address or amount');

        const clausesArray: any[] = [];

        clausesArray.push({
            to: tokenAddress,
            value: '0x0',
            data: ERC20Interface.encodeFunctionData('transfer', [
                receiverAddress,
                ethers.parseEther(amount),
            ]),
            comment: `Transfer ${amount} ${tokenName} to ${receiverAddress}`,
            abi: ERC20Interface.getFunction('transfer'),
        });

        return clausesArray;
    }, [receiverAddress, amount]);

    //Refetch queries to update ui after the tx is confirmed
    const handleOnSuccess = useCallback(async () => {
        await refresh();
        onSuccess?.();
    }, [onSuccess, fromAddress, queryClient]);

    const result = useSendTransaction({
        signerAccountAddress: fromAddress,
        privyUIOptions: {
            title: 'Sign to confirm',
            description: `Transfer ${amount} ${tokenName} to ${receiverAddress}`,
            buttonText: 'Sign',
        },
        onTxConfirmed: handleOnSuccess,
    });

    return {
        ...result,
        sendTransaction: async () => {
            return result.sendTransaction(await buildClauses());
        },
    };
};
