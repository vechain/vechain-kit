import { useQuery } from '@tanstack/react-query';
import { useVeChainKitConfig } from '@/providers';
import { getConfig } from '@/config';
import { useThor } from '@vechain/dapp-kit-react';
import { GalaxyMember__factory } from '@/contracts';
import { NETWORK_TYPE } from '@/config/network';
import { type ThorClient } from '@vechain/sdk-network';

/**
 * Get the number of GM NFTs for an address
 * @param thor the connex instance
 * @param network the network type
 * @param address the address to get the number of GM NFts
 * @returns the number of GM NFTs for the address
 */
export const getBalanceOf = async (
    thor: ThorClient,
    network: NETWORK_TYPE,
    address: null | string,
) => {
    if (!address) return Promise.reject(new Error('Address not provided'));

    const contractAddress = getConfig(network).galaxyMemberContractAddress;

    const res = await thor.contracts
        .load(contractAddress, GalaxyMember__factory.abi)
        .read.balanceOf(address);

    if (!res) throw new Error('Reverted');
    return Number(res[0]);
};

export const getGMbalanceQueryKey = (address: null | string) => [
    'VECHAIN_KIT',
    'balanceOf',
    'galaxyMember',
    address,
];

/**
 * Get the number of GM NFTs for an address
 * @param address the address to get the number of GM NFTs owned
 * @returns the number of GM NFTs for the address
 */
export const useGMbalance = (address: null | string) => {
    const thor = useThor();
    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: getGMbalanceQueryKey(address),
        queryFn: () => getBalanceOf(thor, network.type, address),
        enabled: !!address && !!network.type,
    });
};
