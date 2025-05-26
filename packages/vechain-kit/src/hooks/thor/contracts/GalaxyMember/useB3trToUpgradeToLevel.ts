import { getConfig } from '@/config';
import { GalaxyMember__factory } from '@/contracts';
import { useVeChainKitConfig } from '@/providers';
import { formatEther } from 'viem';
import { useCallClause, getCallClauseQueryKey } from '@/hooks';
import { NETWORK_TYPE } from '@/config/network';

const contractAbi = GalaxyMember__factory.abi;
const method = 'getB3TRtoUpgradeToLevel';

export const getB3trToUpgradeToLevelQueryKey = (
    networkType: NETWORK_TYPE,
    level: string,
) => {
    const contractAddress = getConfig(networkType).galaxyMemberContractAddress;
    return getCallClauseQueryKey<typeof contractAbi>({
        address: contractAddress,
        method,
        args: [BigInt(level || 0)],
    });
};

/**
 * Retrieves the amount of B3TR tokens required to upgrade to a specific level for a given token ID.
 *
 * @param level - The level to upgrade to.
 * @param customEnabled - Flag indicating whether the hook is enabled or not. Default is true.
 * @returns The result of the call to the contract method.
 */
export const useB3trToUpgradeToLevel = (
    level?: string,
    customEnabled = true,
) => {
    const { network } = useVeChainKitConfig();
    const contractAddress = getConfig(network.type).galaxyMemberContractAddress;

    // Galaxy Member B3TR to upgrade to level result: [ 5000000000000000000000n ]
    return useCallClause({
        address: contractAddress,
        abi: contractAbi,
        method,
        args: [BigInt(level || 0)],
        queryOptions: {
            enabled:
                !!level && customEnabled && !!network.type && !!contractAddress,
            select: (data) => formatEther(data[0]),
        },
    });
};
