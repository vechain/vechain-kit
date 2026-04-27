import { useQuery } from '@tanstack/react-query';
import { useAppConfig, useVeChainKitConfig } from '@/providers';
import { formatTokenBalance } from '@/utils';
import { getErc20Balance } from '@vechain/contract-getters';
import { VECHAIN_KIT_QUERY_KEYS } from '@/constants/queryKeys';

export const getVot3BalanceQueryKey = (address?: string) =>
    VECHAIN_KIT_QUERY_KEYS.balance.vot3(address);

export const useGetVot3Balance = (address?: string) => {
    const { network } = useVeChainKitConfig();
    const { vot3ContractAddress } = useAppConfig();

    return useQuery({
        queryKey: getVot3BalanceQueryKey(address),
        queryFn: async () => {
            if (!address) throw new Error('Address is required');
            const res = await getErc20Balance(
                vot3ContractAddress,
                address,
                { networkUrl: network.nodeUrl },
            );

            if (!res) throw new Error('Failed to get vot3 balance');

            const original = res[0];
            return formatTokenBalance(original);
        },
        enabled: !!address && !!network.type,
    });
};
