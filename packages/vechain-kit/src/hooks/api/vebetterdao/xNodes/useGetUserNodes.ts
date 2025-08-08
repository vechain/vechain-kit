import { getCallKey, useCall } from '@/hooks';
import { getConfig } from '@/config';
import { NodeManagement__factory } from '@vechain/vechain-contract-types';
import { UseQueryResult } from '@tanstack/react-query';
import { useVeChainKitConfig } from '@/providers';

const contractInterface = NodeManagement__factory.createInterface();
const method = 'getUserNodes';

export type UserNode = {
    nodeId: string;
    nodeLevel: number;
    xNodeOwner: string;
    isXNodeHolder: boolean;
    isXNodeDelegated: boolean;
    isXNodeDelegator: boolean;
    isXNodeDelegatee: boolean;
    delegatee: string;
};

/**
 * Get the query key for fetching user nodes
 * @param user - The address of the user to check
 */
export const getUserNodesQueryKey = (user?: string) =>
    getCallKey({ method, keyArgs: [user] });

/**
 * Hook to get delegation details for all nodes associated with a user
 * @param user - The address of the user to check
 * @returns An array of objects containing user node details
 */
export const useGetUserNodes = (
    user?: string,
): UseQueryResult<UserNode[], Error> => {
    const { network } = useVeChainKitConfig();
    const contractAddress = getConfig(
        network.type,
    ).nodeManagementContractAddress;
    return useCall({
        contractInterface,
        contractAddress,
        method,
        args: [user],
        mapResponse: (response) => {
            // Response will be an array of node structs
            return response.decoded[0].map((node: any) => ({
                nodeId: node.nodeId.toString(),
                nodeLevel: Number(node.nodeLevel),
                xNodeOwner: node.xNodeOwner,
                isXNodeHolder: node.isXNodeHolder,
                isXNodeDelegated: node.isXNodeDelegated,
                isXNodeDelegator: node.isXNodeDelegator,
                isXNodeDelegatee: node.isXNodeDelegatee,
                delegatee: node.delegatee,
            }));
        },
        enabled: !!user && !!network.type,
    });
};

// For backward compatibility (if needed)
export const useGetUserNode = useGetUserNodes;
