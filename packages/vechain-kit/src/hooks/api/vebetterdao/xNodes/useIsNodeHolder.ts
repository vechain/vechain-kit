import { useQuery } from '@tanstack/react-query';
import { useThor } from '@vechain/dapp-kit-react';
import { getConfig } from '@/config';
import { NodeManagement__factory } from '@/contracts';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';
import { type ThorClient } from '@vechain/sdk-network';

/**
 * Get the query key for checking if an address is a node holder.
 * @param address - The address to check.
 */
export const getIsNodeHolderQueryKey = (address: string) => [
    'VECHAIN_KIT',
    'isNodeHolder',
    address,
];

/**
 * Get the node holder status of an address from the contract
 *
 * @param thor  The thor instance
 * @param networkType The network type
 * @param address The address to check
 * @returns Boolean indicating if the address is a node holder
 */
export const getIsNodeHolder = async (
    thor: ThorClient,
    networkType: NETWORK_TYPE,
    address: string,
): Promise<boolean> => {
    if (!address) return Promise.reject(new Error('Address not provided'));

    const contractAddress =
        getConfig(networkType).nodeManagementContractAddress;
    const contract = thor.contracts.load(
        contractAddress,
        NodeManagement__factory.abi,
    );
    const res = await contract.read.isNodeHolder(address);

    if (!res) return Promise.reject(new Error('Node not found'));

    return res[0].toString() === '1';
};

/**
 * Custom hook that checks if a user is a node holder (either directly or through delegation).
 *
 * @param address - The address to check.
 * @returns UseQueryResult containing a boolean indicating if the address is a node holder.
 */
export const useIsNodeHolder = (address: string) => {
    const { network } = useVeChainKitConfig();
    const thor = useThor();

    return useQuery({
        queryKey: getIsNodeHolderQueryKey(address),
        queryFn: () => getIsNodeHolder(thor, network.type, address),
        enabled: !!address && !!network.type,
    });
};
