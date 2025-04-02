import { getCallKey, useCall } from '@/hooks';
import { getConfig } from '@/config';
import { NodeManagement__factory } from '@/contracts';
import { UseQueryResult } from '@tanstack/react-query';
import { useVeChainKitConfig } from '@/providers';
import { Interface } from 'ethers';

const contractInterface =
    NodeManagement__factory.createInterface() as Interface & {
        abi: readonly any[];
    };
contractInterface.abi = NodeManagement__factory.abi;
const method = 'getNodeManager';

/**
 * Get the query key for the address of the user managing the node ID (endorsement)
 * @param nodeId The ID of the node for which the manager address is being retrieved
 */
export const getNodeManagerQueryKey = (nodeId: string) =>
    getCallKey({ method, keyArgs: [nodeId] });

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

    return useCall({
        contractInterface,
        contractAddress,
        method,
        args: [nodeId],
        enabled: !!nodeId && !!network.type,
    });
};
