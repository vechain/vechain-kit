import { useQueryClient } from '@tanstack/react-query';
import { useWallet } from './useWallet';
import {
    getAccountBalanceQueryKey,
    getB3trBalanceQueryKey,
    getVot3BalanceQueryKey,
    getVeDelegateBalanceQueryKey,
    getTokenUsdPriceQueryKey,
} from './api';

export const useRefreshBalances = () => {
    const queryClient = useQueryClient();
    const { selectedAccount } = useWallet();

    const refresh = async () => {
        const address = selectedAccount?.address;

        // First invalidate all queries
        await Promise.all([
            queryClient.cancelQueries({
                queryKey: getAccountBalanceQueryKey(address),
            }),
            queryClient.cancelQueries({
                queryKey: getB3trBalanceQueryKey(address),
            }),
            queryClient.cancelQueries({
                queryKey: getVot3BalanceQueryKey(address),
            }),
            queryClient.cancelQueries({
                queryKey: getVeDelegateBalanceQueryKey(address),
            }),
            queryClient.cancelQueries({
                queryKey: getTokenUsdPriceQueryKey('VET'),
            }),
            queryClient.cancelQueries({
                queryKey: getTokenUsdPriceQueryKey('VTHO'),
            }),
            queryClient.cancelQueries({
                queryKey: getTokenUsdPriceQueryKey('B3TR'),
            }),
        ]);

        // Then refetch all queries
        await Promise.all([
            queryClient.refetchQueries({
                queryKey: getAccountBalanceQueryKey(address),
            }),
            queryClient.refetchQueries({
                queryKey: getB3trBalanceQueryKey(address),
            }),
            queryClient.refetchQueries({
                queryKey: getVot3BalanceQueryKey(address),
            }),
            queryClient.refetchQueries({
                queryKey: getVeDelegateBalanceQueryKey(address),
            }),
            queryClient.refetchQueries({
                queryKey: getTokenUsdPriceQueryKey('VET'),
            }),
            queryClient.refetchQueries({
                queryKey: getTokenUsdPriceQueryKey('VTHO'),
            }),
            queryClient.refetchQueries({
                queryKey: getTokenUsdPriceQueryKey('B3TR'),
            }),
        ]);
    };

    return { refresh };
};
