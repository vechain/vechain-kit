import { useQuery } from '@tanstack/react-query';
import { useVeChainKitConfig } from '@/providers';
import { getConfig } from '@/config';
import { useConnex } from '@vechain/dapp-kit-react';
import { GalaxyMember__factory } from '@/contracts';
import { NETWORK_TYPE } from '@/config/network';

/**
 * Get the number of GM NFTs for an address
 * @param thor the connex instance
 * @param network the network type
 * @param address the address to get the number of GM NFts
 * @returns the number of GM NFTs for the address
 */
export const getBalanceOf = async (
    thor: Connex.Thor,
    network: NETWORK_TYPE,
    address: null | string,
) => {
    if (!address) return Promise.reject(new Error('Address not provided'));

    const contractAddress = getConfig(network).galaxyMemberContractAddress;

    const functionFragment = GalaxyMember__factory.createInterface()
        .getFunction('balanceOf')
        .format('json');
    const res = await thor
        .account(contractAddress)
        .method(JSON.parse(functionFragment))
        .call(address);

    if (res.vmError) return Promise.reject(new Error(res.vmError));
    return Number(res.decoded[0]);
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
    const { thor } = useConnex();
    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: getGMbalanceQueryKey(address),
        queryFn: () => getBalanceOf(thor, network.type, address),
        enabled: !!address && !!network.type,
    });
};
