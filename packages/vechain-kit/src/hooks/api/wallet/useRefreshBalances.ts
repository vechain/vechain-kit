import { useQueryClient } from '@tanstack/react-query';
import { VECHAIN_KIT_QUERY_KEYS } from '@/constants/queryKeys';

export const useRefreshBalances = () => {
    const queryClient = useQueryClient();

    const refresh = async () => {
        await Promise.all([
            queryClient.invalidateQueries({
                queryKey: VECHAIN_KIT_QUERY_KEYS.balance.all,
            }),
            queryClient.invalidateQueries({
                queryKey: VECHAIN_KIT_QUERY_KEYS.price.all,
            }),
        ]);
    };

    return { refresh };
};
