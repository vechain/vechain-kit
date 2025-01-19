import { useQuery } from '@tanstack/react-query';
import { getConfig } from '@/config';
import { useConnex } from '@vechain/dapp-kit-react';
import { GalaxyMember__factory } from '@/contracts';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';

/**
 * Get the token ID for an address given an index
 * @param thor the thor instance
 * @param networkType the network type
 * @param address the address to get the token ID for
 * @param index the index of the token ID
 *
 * @returns the token ID for the address
 */
export const getTokenIdByAccount = async (
    thor: Connex.Thor,
    networkType: NETWORK_TYPE,
    address: null | string,
    index: number,
): Promise<string> => {
    if (!address) return Promise.reject(new Error('Address not provided'));

    const contractAddress = getConfig(networkType).galaxyMemberContractAddress;

    const functionFragment = GalaxyMember__factory.createInterface()
        .getFunction('tokenOfOwnerByIndex')
        .format('json');
    const res = await thor
        .account(contractAddress)
        .method(JSON.parse(functionFragment))
        .call(address, index);

    if (res.vmError) return Promise.reject(new Error(res.vmError));
    return res.decoded[0];
};

export const getTokenIdByAccountQueryKey = (address: null | string) => [
    'VECHAIN_KIT',
    'TokenIdByAccount',
    'galaxyMember',
    address,
];

/**
 * Get the token ID for an address given an index
 * @param address the address to get the token ID for
 * @param index the index of the token ID
 *
 * @returns the token ID for the address
 */
export const useTokenIdByAccount = (address: null | string, index: number) => {
    const { thor } = useConnex();
    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: getTokenIdByAccountQueryKey(address),
        queryFn: () => getTokenIdByAccount(thor, network.type, address, index),
        enabled: !!address && !!network.type,
    });
};
