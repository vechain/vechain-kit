import { useQuery } from '@tanstack/react-query';
import { useThor } from '@vechain/dapp-kit-react';
// import { networkConfig } from '@repo/config';
import { IERC20__factory } from '../../../contracts/typechain-types';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';
import { getConfig } from '@/config';
import { formatEther } from 'ethers';
import { humanNumber } from '@/utils';
import { type ThorClient } from '@vechain/sdk-network';

export const getVeDelegateBalance = async (
    thor: ThorClient,
    network: NETWORK_TYPE,
    address?: string,
): Promise<{ original: string; scaled: string; formatted: string }> => {
    const res = await thor.contracts
        .load(
            getConfig(network).veDelegateTokenContractAddress,
            IERC20__factory.abi,
        )
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

export const getVeDelegateBalanceQueryKey = (address?: string) => [
    'VECHAIN_KIT_VE_DELEGATE_BALANCE',
    address,
];

export const useGetVeDelegateBalance = (address?: string) => {
    const thor = useThor();
    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: getVeDelegateBalanceQueryKey(address),
        queryFn: async () => getVeDelegateBalance(thor, network.type, address),
        enabled: !!thor && !!address && !!network.type,
    });
};
