import { useQuery } from '@tanstack/react-query';
import { useVeChainKitConfig } from '@/providers';

import { getErc20Balance } from '@vechain/contract-getters';
import { formatTokenBalance } from '@/utils';

export const getErc20BalanceQueryKey = (
    tokenAddress: string,
    address?: string,
) => ['VECHAIN_KIT', 'BALANCE', 'ERC20', tokenAddress, address];

export type UseGetErc20BalanceOptions = {
    enabled?: boolean;
};

export const useGetErc20Balance = (
    tokenAddress: string,
    address?: string,
    options?: UseGetErc20BalanceOptions,
) => {
    const { network } = useVeChainKitConfig();
    const baseEnabled = !!address && !!network.type;

    return useQuery({
        queryKey: getErc20BalanceQueryKey(tokenAddress, address),
        queryFn: async () => {
            if (!address) throw new Error('Address is required');
            const res = await getErc20Balance(tokenAddress, address, {
                networkUrl: network.nodeUrl,
            });

            if (!res) throw new Error('Failed to get vot3 balance');

            const original = res[0];
            return formatTokenBalance(original);
        },
        enabled: baseEnabled && (options?.enabled ?? true),
    });
};
