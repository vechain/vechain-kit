import { UseSendTransactionReturnValue, useSendTransaction } from '@/hooks';
import { useCallback } from 'react';
import { ERC20__factory } from '@/contracts/typechain-types';
import { ethers } from 'ethers';
import { useQueryClient } from '@tanstack/react-query';
import { isValidAddress } from '@/utils';
import { getVeB3trBalanceQueryKey, getVot3BalanceQueryKey } from '../api';

type useTransferERC20Props = {
    fromAddress: string;
    receiverAddress: string;
    amount: string;
    tokenAddress: string;
    tokenName: string;
    onSuccess?: () => void;
    invalidateCache?: boolean;
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
    invalidateCache = true,
}: useTransferERC20Props): useTransferERC20ReturnValue => {
    const queryClient = useQueryClient();

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
        if (invalidateCache) {
            // Invalidate cache
            await queryClient.cancelQueries({
                queryKey: getVot3BalanceQueryKey(fromAddress),
            });
            // Refetch queries
            await queryClient.refetchQueries({
                queryKey: getVot3BalanceQueryKey(fromAddress),
            });

            // Invalidate cache
            await queryClient.cancelQueries({
                queryKey: getVot3BalanceQueryKey(fromAddress),
            });
            // Refetch queries
            await queryClient.refetchQueries({
                queryKey: getVot3BalanceQueryKey(fromAddress),
            });

            // Invalidate cache
            await queryClient.cancelQueries({
                queryKey: getVeB3trBalanceQueryKey(fromAddress),
            });
            // Refetch queries
            await queryClient.refetchQueries({
                queryKey: getVeB3trBalanceQueryKey(fromAddress),
            });
        }
        onSuccess?.();
    }, [onSuccess, invalidateCache, fromAddress, queryClient]);

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
