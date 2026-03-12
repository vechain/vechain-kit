import {
    UseSendTransactionReturnValue,
    useRefreshBalances,
    useSendTransaction,
} from '@/hooks';
import { useGetCustomTokenInfo } from '@/hooks/api/wallet/useGetCustomTokenInfo';
import { IERC20__factory } from '@vechain/vechain-contract-types';
import { useMemo } from 'react';
import { humanAddress, isValidAddress } from '@/utils';
import { parseUnits } from 'viem';
import { EnhancedClause } from '@/types';

type useTransferERC20Props = {
    fromAddress: string;
    receiverAddress: string;
    amount: string;
    tokenAddress: string;
    tokenName: string;
    tokenDecimals?: number;
    onSuccess?: () => void;
    onSuccessMessageTitle?: number;
    onError?: (error?: string) => void;
};

type useTransferERC20ReturnValue = {
    sendTransaction: () => Promise<void>;
    clauses: EnhancedClause[];
    isLoadingTokenInfo: boolean;
} & Omit<UseSendTransactionReturnValue, 'sendTransaction'>;

const ERC20Interface = IERC20__factory.createInterface();

export const buildERC20Clauses = (
    receiverAddress: string,
    amount: string,
    tokenAddress: string,
    tokenName: string,
    tokenDecimals: number,
): EnhancedClause[] => {
    if (!receiverAddress || !amount || !isValidAddress(receiverAddress))
        throw new Error('Invalid receiver address or amount');

    const clausesArray: any[] = [];

    clausesArray.push({
        to: tokenAddress,
        value: '0x0',
        data: ERC20Interface.encodeFunctionData('transfer', [
            receiverAddress,
            parseUnits(amount, tokenDecimals),
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
    tokenDecimals,
    onSuccess,
    onError,
}: useTransferERC20Props): useTransferERC20ReturnValue => {
    const { refresh } = useRefreshBalances();
    const {
        data: tokenInfo,
        isLoading: isLoadingTokenInfo,
        error: tokenInfoError,
    } = useGetCustomTokenInfo(tokenDecimals === undefined ? tokenAddress : '');
    const resolvedTokenDecimals = useMemo(() => {
        const decimals = tokenDecimals ?? tokenInfo?.decimals;
        return decimals != null ? Number(decimals) : undefined;
    }, [tokenDecimals, tokenInfo?.decimals]);

    const clauses = useMemo(() => {
        if (resolvedTokenDecimals === undefined) {
            return [];
        }

        return buildERC20Clauses(
            receiverAddress,
            amount,
            tokenAddress,
            tokenName,
            resolvedTokenDecimals,
        );
    }, [
        receiverAddress,
        amount,
        tokenAddress,
        tokenName,
        resolvedTokenDecimals,
    ]);

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
        isLoadingTokenInfo,
        sendTransaction: async () => {
            if (resolvedTokenDecimals === undefined) {
                const message = tokenInfoError
                    ? `Failed to load token info: ${tokenInfoError.message}`
                    : 'Token decimals are required';
                onError?.(message);
                return;
            }

            return result.sendTransaction(clauses);
        },
    };
};
