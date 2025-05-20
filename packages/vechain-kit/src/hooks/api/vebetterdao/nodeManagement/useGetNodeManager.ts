import { getCallClauseQueryKey, useCallClause } from '@/hooks';
import { getConfig } from '@/config';
import { NodeManagement__factory } from '@/contracts';
import { UseQueryResult } from '@tanstack/react-query';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';

const contractAbi = NodeManagement__factory.abi;
const method = 'getNodeManager' as const;

/**
 * Get the query key for the address of the user managing the node ID (endorsement)
 * @param nodeId The ID of the node for which the manager address is being retrieved
 */
export const getNodeManagerQueryKey = (
    nodeId: string,
    networkType: NETWORK_TYPE,
) =>
    getCallClauseQueryKey({
        abi: contractAbi,
        address: getConfig(networkType).nodeManagementContractAddress,
        method,
        args: [BigInt(nodeId || 0)],
    });

/**
 * Hook to get the address of the user managing the node ID (endorsement) either through ownership or delegation
 * @param nodeId The ID of the node for which the manager address is being retrieved
 * @returns address The address of the manager of the specified node
 */
export const useGetNodeManager = (
    nodeId: string,
): UseQueryResult<string, Error> => {
    const { network } = useVeChainKitConfig();
    const contractAddress = getConfig(
        network.type,
    ).nodeManagementContractAddress;

    return useCallClause({
        abi: contractAbi,
        address: contractAddress,
        method: 'getNodeManager',
        args: [BigInt(nodeId || 0)],
        queryOptions: {
            enabled: !!nodeId && !!network.type && !!contractAddress,
            select: (data) => data[0],
        },
    }) as UseQueryResult<string, Error>;
};
