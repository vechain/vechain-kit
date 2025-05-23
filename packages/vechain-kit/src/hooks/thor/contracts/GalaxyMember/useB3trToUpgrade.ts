import { getConfig } from '@/config';
import { GalaxyMember__factory } from '@/contracts';
import { useVeChainKitConfig } from '@/providers';
import { formatEther } from 'viem';
import { useCallClause, getCallClauseQueryKey } from '@/hooks';
import { NETWORK_TYPE } from '@/config/network';

const contractAbi = GalaxyMember__factory.abi;
const method = 'getB3TRtoUpgrade';

export const getB3trToUpgradeQueryKey = (
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
 * Retrieves the amount of B3TR tokens required to upgrade a specific token.
 *
 * @param tokenId - The ID of the token.
 * @param customEnabled - Flag indicating whether the hook is enabled or not. Default is true.
 * @returns The result of the call to the contract method.
 */
export const useB3trToUpgrade = (tokenId?: string, customEnabled = true) => {
    const { network } = useVeChainKitConfig();
    const contractAddress = getConfig(network.type).galaxyMemberContractAddress;

    // Galaxy Member B3TR to upgrade result: [ 5000000000000000000000n ]
    return useCallClause({
        address: contractAddress,
        abi: contractAbi,
        method,
        args: [BigInt(tokenId || 0)],
        queryOptions: {
            enabled:
                !!tokenId &&
                customEnabled &&
                !!network.type &&
                !!contractAddress,
            select: (data) => Number(formatEther(data[0])),
        },
    });
};
