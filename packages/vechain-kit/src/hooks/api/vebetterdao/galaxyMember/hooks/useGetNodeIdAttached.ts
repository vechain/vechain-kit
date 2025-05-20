import { getConfig } from '@/config';
import { GalaxyMember__factory } from '@/contracts';
import { useVeChainKitConfig } from '@/providers';
import { useCallClause, getCallClauseQueryKey } from '@/hooks';
import { NETWORK_TYPE } from '@/config/network';

const contractAbi = GalaxyMember__factory.abi;
const method = 'getNodeIdAttached';

export const getNodeIdAttachedQueryKey = (
    networkType: NETWORK_TYPE,
    tokenId: string,
) => {
    const contractAddress = getConfig(networkType).galaxyMemberContractAddress;
    return getCallClauseQueryKey({
        address: contractAddress,
        abi: contractAbi,
        method,
        args: [BigInt(tokenId || 0)],
    });
};

/**
 * Custom hook that retrieves the Vechain Node Token ID attached to the given GM Token ID.
 *
 * @param tokenId - The GM Token ID to check for attached node. (string | null)
 * @returns The Vechain Node Token ID attached to the given GM Token ID.
 */
export const useGetNodeIdAttached = (tokenId?: string) => {
    const { network } = useVeChainKitConfig();
    const contractAddress = getConfig(network.type).galaxyMemberContractAddress;

    return useCallClause({
        address: contractAddress,
        abi: contractAbi,
        method,
        args: [BigInt(tokenId || 0)],
        queryOptions: {
            enabled: !!tokenId && !!network.type && !!contractAddress,
        },
    });
};
