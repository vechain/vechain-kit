import { getConfig } from '@/config';
import { GalaxyMember__factory } from '@/contracts';
import { useVeChainKitConfig } from '@/providers';
import { useCallClause, getCallClauseQueryKey } from '@/hooks';
import { NETWORK_TYPE } from '@/config/network';

const contractAbi = GalaxyMember__factory.abi;
const method = 'levelOf';

export const getLevelOfTokenQueryKey = (
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
 * Custom hook that retrieves the level of the specified token.
 *
 * @param tokenId - The token ID to retrieve the level for.
 * @param customEnabled - Determines whether the hook is enabled or not. Default is true.
 * @returns The level of the specified token.
 */
export const useLevelOfToken = (tokenId?: string, customEnabled = true) => {
    const { network } = useVeChainKitConfig();
    const contractAddress = getConfig(network.type).galaxyMemberContractAddress;

    // Galaxy Member level of token result: [ 2n ]
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
            select: (data) => data[0].toString(),
        },
    });
};
