import { useVeChainKitConfig } from '@/providers';
import { formatTokenBalance } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { getB3trBalance } from '@vechain/contract-getters';
import { VECHAIN_KIT_QUERY_KEYS } from '@/constants/queryKeys';

export const getB3trBalanceQueryKey = (address?: string) =>
    VECHAIN_KIT_QUERY_KEYS.balance.b3tr(address);

export const useGetB3trBalance = (address?: string) => {
    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: getB3trBalanceQueryKey(address),
        queryFn: async () => {
            if (!address) throw new Error('Address is required');
            const res = await getB3trBalance(address, {
                networkUrl: network.nodeUrl,
            });

            if (!res) throw new Error('Failed to get b3tr balance');

            const original = res[0];
            return formatTokenBalance(original);
        },
        enabled: !!address && !!network.type,
    });
};
