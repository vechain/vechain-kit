import { useQueryClient } from '@tanstack/react-query';
import { useWallet } from './useWallet';

export const useRefreshBalances = () => {
    const queryClient = useQueryClient();
    const { account } = useWallet();

    const refresh = async () => {
        const address = account?.address ?? '';

        await Promise.all([
            // getAccountBalanceQueryKey
            // getB3trBalanceQueryKey
            // getVot3BalanceQueryKey
            // getVeDelegateBalanceQueryKey
            // getCustomTokenBalanceQueryKey
            queryClient.invalidateQueries({
                queryKey: ['VECHAIN_KIT_BALANCE', address],
            }),
            // getTokenUsdPriceQueryKey
            queryClient.invalidateQueries({
                queryKey: ['VECHAIN_KIT_PRICE'],
            }),
        ]);
    };

    return { refresh };
};
