import { getCallClauseQueryKey, useCallClause } from '@/hooks';
import { getConfig } from '@/config';
import { NodeManagement__factory } from '@/contracts';
import { UseQueryResult } from '@tanstack/react-query';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';

const contractAbi = NodeManagement__factory.abi;
const method = 'getUserNodes' as const;

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
 * @param networkType the network type
 * @param user - The address of the user to check (non-optional)
 */
export const getUserNodesQueryKey = (networkType: NETWORK_TYPE, user: string) =>
    getCallClauseQueryKey<typeof contractAbi>({
        address: getConfig(networkType).nodeManagementContractAddress,
        method,
        args: [user as `0x${string}`],
    });

/**
 * Hook to get delegation details for all nodes associated with a user
 * @param userInput - The address of the user to check
 * @returns An array of objects containing user node details
 */
export const useGetUserNodes = (
    userInput?: string,
): UseQueryResult<UserNode[], unknown> => {
    const { network } = useVeChainKitConfig();
    const contractAddress = getConfig(
        network.type,
    ).nodeManagementContractAddress;

    // Node Management get user nodes result: [
    //   [
    //     {
    //       nodeId: 2330n,
    //       nodeLevel: 2,
    //       xNodeOwner: '0x987b68E1B71D87B82ffce7539aE95b1B11aC7Eb0',
    //       isXNodeHolder: true,
    //       isXNodeDelegated: false,
    //       isXNodeDelegator: false,
    //       isXNodeDelegatee: false,
    //       delegatee: '0x0000000000000000000000000000000000000000'
    //     }
    //   ]
    // ]
    return useCallClause({
        address: contractAddress,
        abi: contractAbi,
        method,
        args: [userInput as `0x${string}`],
        queryOptions: {
            enabled: !!userInput && !!network.type && !!contractAddress,
            select: (response) => {
                return response[0].map((node) => ({
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
        },
    });
};

// For backward compatibility (if needed)
export const useGetUserNode = useGetUserNodes;
