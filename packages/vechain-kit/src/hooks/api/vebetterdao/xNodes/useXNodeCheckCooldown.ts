import { getConfig } from '@/config';
import { X2EarnApps__factory } from '@/contracts';
import { getCallClauseQueryKey, useCallClause } from '@/hooks';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';

const contractAbi = X2EarnApps__factory.abi;
const method = 'checkCooldown' as const;

/**
 * Get the query key for checking X-Node cooldown status.
 * @param networkType The network type.
 * @param nodeId - The ID of the X-Node (uint256).
 */
export const getNodeCheckCooldownQueryKey = (
    networkType: NETWORK_TYPE,
    nodeId: string | number,
) =>
    getCallClauseQueryKey({
        address: getConfig(networkType).x2EarnAppsContractAddress,
        abi: contractAbi,
        method,
        args: [BigInt(nodeId || 0)],
    });

/**
 * Hook to check the cooldown status of an X-Node.
 * @param nodeIdInput - The ID of the X-Node (string or number for BigInt conversion).
 * @returns The cooldown status of the X-Node (boolean).
 */
export const useXNodeCheckCooldown = (nodeIdInput?: string | number) => {
    const { network } = useVeChainKitConfig();
    const contractAddress = getConfig(network.type).x2EarnAppsContractAddress;

    return useCallClause({
        address: contractAddress,
        abi: contractAbi,
        method,
        args: [BigInt(nodeIdInput || 0)],
        queryOptions: {
            enabled: !!nodeIdInput && !!network.type && !!contractAddress,
            select: (res) => res[0],
        },
    });
};
