import { useQuery } from '@tanstack/react-query';
import { useVeChainKitConfig } from '../../../providers/VeChainKitContext';
import { formatTokenBalance } from '../../../utils';
import { getVot3Balance } from '@vechain/contract-getters';

export const getVot3BalanceQueryKey = (address?: string) => [
    'VEBETTERDAO_BALANCE',
    address,
    'VOT3',
];

export const useGetVot3Balance = (address?: string) => {
    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: getVot3BalanceQueryKey(address),
        queryFn: async () => {
            if (!address) throw new Error('Address is required');
            const res = await getVot3Balance(address, {
                networkUrl: network.nodeUrl,
            });

            if (!res) throw new Error('Failed to get vot3 balance');

            const original = res[0];
            return formatTokenBalance(original);   
        },
        enabled: !!address && !!network.type,
    });
};
