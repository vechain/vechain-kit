import { useQueryClient } from '@tanstack/react-query';
import { useWallet } from './useWallet';
import {
    getAccountBalanceQueryKey,
    getB3trBalanceQueryKey,
    getVeDelegateBalanceQueryKey,
    getVot3BalanceQueryKey,
    getTokenUsdPriceQueryKey,
    getCustomTokenBalanceQueryKey,
} from '..';
import { useCustomTokens } from './useCustomTokens';
import { getCurrencyQueryKey } from './useCurrency';
export const useRefreshBalances = () => {
    const queryClient = useQueryClient();
    const { account } = useWallet();
    const { customTokens } = useCustomTokens();

    const refresh = async () => {
        const address = account?.address ?? '';

        // Generate query keys for custom token balances
        const customTokenQueryKeys = customTokens.map((token) =>
            getCustomTokenBalanceQueryKey(token.address, address),
        );

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
            ...customTokenQueryKeys.map((queryKey) =>
                queryClient.cancelQueries({ queryKey }),
            ),
            queryClient.cancelQueries({
                queryKey: getCurrencyQueryKey(),
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
            ...customTokenQueryKeys.map((queryKey) =>
                queryClient.refetchQueries({ queryKey }),
            ),
            queryClient.refetchQueries({
                queryKey: getCurrencyQueryKey(),
            }),
        ]);
    };

    return { refresh };
};
