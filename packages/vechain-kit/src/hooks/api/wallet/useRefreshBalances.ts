import { useQueryClient } from '@tanstack/react-query';
import { useWallet } from './useWallet';
import { getAccountBalanceQueryKey } from '../wallet';

export const useRefreshBalances = () => {
    const queryClient = useQueryClient();
    const { account } = useWallet();

    const refresh = async () => {
        const address = account?.address ?? '';

        await Promise.all([
            queryClient.invalidateQueries({
                queryKey: getAccountBalanceQueryKey(address),
            }),
            queryClient.invalidateQueries({
                queryKey: ['VEBETTERDAO_BALANCE', address],
            }),
            queryClient.invalidateQueries({
                queryKey: ['VEBETTERDAO_PRICE', 'USD'],
            }),
            queryClient.invalidateQueries({
                queryKey: ['VECHAIN_KIT_CUSTOM_TOKEN_BALANCE'],
            }),
        ]);
    };

    return { refresh };
};
