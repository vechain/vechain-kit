import { allNodeStrengthLevelToName, NodeStrengthLevelToImage } from '@/utils';
import { getConfig } from '@/config';
import { NodeManagement__factory } from '@/contracts';
import { useQuery } from '@tanstack/react-query';
import { NETWORK_TYPE } from '@/config/network';
import { useVeChainKitConfig } from '@/providers';
import { useThor } from '@vechain/dapp-kit-react2';
import { ThorClient } from '@vechain/sdk-network1.2';
import type { ViewFunctionResult } from '@/hooks';

/**
 * UserXNode type for the xNodes owned by a user
 * @property id  the xNode id
 * @property level  the xNode level
 * @property image  the xNode image
 * @property name  the xNode name
 */
export type UserXNode = {
    id: string;
    level: number;
    image: string;
    name: string;
};

/**
 * Returns all the available (owned and delegated) xNodes from the NodeManagement contract
 * @param thor  the thor client
 * @param networkType  the network type
 * @param user  the user address
 * @returns  all the available xNodes for an user
 */
export const getUserXNodes = async (
    thor: ThorClient,
    networkType: NETWORK_TYPE,
    user?: string,
): Promise<UserXNode[]> => {
    if (!user) throw new Error('User address is required');
    const contractAddress =
        getConfig(networkType).nodeManagementContractAddress;
    const contract = thor.contracts.load(
        contractAddress,
        NodeManagement__factory.abi,
    );
    const clauses = [
        contract.clause.getNodeIds(user),
        contract.clause.getUsersNodeLevels(user),
    ];

    const res = await thor.transactions.executeMultipleClausesCall(clauses);
    if (!res.every((r) => r.success))
        throw new Error(`Failed to fetch xNodes for user ${user}`);

    const nodeIds = (res[0].result.array?.[0] || []) as ViewFunctionResult<
        typeof NodeManagement__factory.abi,
        'getNodeIds'
    >;
    const levels = (res[1].result.array?.[0] || []) as ViewFunctionResult<
        typeof NodeManagement__factory.abi,
        'getUsersNodeLevels'
    >;

    if (nodeIds.length !== levels.length)
        throw new Error('Error fetching Nodes - Data is corrupted');

    return nodeIds.map((id, index) => {
        return {
            id: id.toString(),
            level: Number(levels[index]),
            image: NodeStrengthLevelToImage[Number(levels[index])] as string,
            name: allNodeStrengthLevelToName[Number(levels[index])] as string,
        };
    });
};

export const getUserXNodesQueryKey = (user?: string) => [
    'VECHAIN_KIT',
    'XNodes',
    user,
];

/**
 *  Hook to get the owned or delegated xNodes for a user from the NodeManagement contract
 * @param user  the user address
 * @returns  the xNodes for the user
 */
export const useXNodes = (user?: string) => {
    const thor = useThor();
    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: getUserXNodesQueryKey(user),
        queryFn: async () =>
            await getUserXNodes(
                thor as unknown as ThorClient,
                network.type,
                user,
            ),
        enabled: !!thor && !!user && !!network.type,
    });
};
