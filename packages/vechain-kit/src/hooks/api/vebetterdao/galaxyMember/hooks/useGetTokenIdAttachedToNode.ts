import { getConfig } from '@/config';
import { GalaxyMember__factory } from '@/contracts';
import { useVeChainKitConfig } from '@/providers';
import { useCallClause, getCallClauseQueryKey } from '@/hooks';
import { NETWORK_TYPE } from '@/config/network';

const contractAbi = GalaxyMember__factory.abi;
const method = 'getIdAttachedToNode';

export const getGetTokenIdAttachedToNodeQueryKey = (
    networkType: NETWORK_TYPE,
    nodeId: string,
) => {
    const contractAddress = getConfig(networkType).galaxyMemberContractAddress;
    return getCallClauseQueryKey({
        address: contractAddress,
        abi: contractAbi,
        method,
        args: [BigInt(nodeId)],
    });
};

/**
 * Custom hook that retrieves the GM Token ID attached to the given Vechain Node ID.
 *
 * @param nodeId - The Vechain Node ID to check for attached GM Token.
 * @param customEnabled - Determines whether the hook is enabled or not. Default is true.
 * @returns The GM Token ID attached to the given Vechain Node ID.
 */
export const useGetTokenIdAttachedToNode = (
    nodeId?: string,
    customEnabled = true,
) => {
    const { network } = useVeChainKitConfig();
    const contractAddress = getConfig(network.type).galaxyMemberContractAddress;

    return useCallClause({
        address: contractAddress,
        abi: contractAbi,
        method,
        args: [BigInt(nodeId!)],
        queryOptions: {
            enabled:
                !!nodeId &&
                customEnabled &&
                !!network.type &&
                !!contractAddress,
            select: (data) => data[0].toString(),
        },
    });
};
