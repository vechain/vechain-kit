import { useQuery } from '@tanstack/react-query';
import { IVOT3__factory } from '@vechain/vechain-contract-types';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';
import { getConfig } from '@/config';
import { humanNumber } from '@/utils';
import { formatEther } from 'ethers';
import { TokenBalance } from '@/types';
import { useThor } from '@vechain/dapp-kit-react';
import { ThorClient } from '@vechain/sdk-network';

export const getVot3Balance = async (
    thor: ThorClient,
    network: NETWORK_TYPE,
    address?: string,
): Promise<TokenBalance> => {
    const res = await thor.contracts
        .load(getConfig(network).vot3ContractAddress, IVOT3__factory.abi)
        .read.balanceOf(address);

    if (!res) throw new Error('Reverted');

    const original = res[0].toString();
    const scaled = formatEther(original);
    const formatted = scaled === '0' ? '0' : humanNumber(scaled);

    return {
        original,
        scaled,
        formatted,
    };
};

export const getVot3BalanceQueryKey = (address?: string) => [
    'VEBETTERDAO_BALANCE',
    address,
    'VOT3',
];

export const useGetVot3Balance = (address?: string) => {
    const thor = useThor();
    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: getVot3BalanceQueryKey(address),
        queryFn: async () => getVot3Balance(thor, network.type, address),
        enabled: !!thor && !!address && !!network.type,
    });
};
