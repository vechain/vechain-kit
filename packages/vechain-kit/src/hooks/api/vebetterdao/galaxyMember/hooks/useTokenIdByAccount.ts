import { getConfig } from '@/config';
import { GalaxyMember__factory } from '@/contracts';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';
import { useCallClause, getCallClauseQueryKey } from '@/hooks';

const contractAbi = GalaxyMember__factory.abi;
const method = 'tokenOfOwnerByIndex';

export const getTokenIdByAccountQueryKey = (
    networkType: NETWORK_TYPE,
    owner: string,
    index: number,
) => {
    const contractAddress = getConfig(networkType).galaxyMemberContractAddress;
    return getCallClauseQueryKey({
        address: contractAddress,
        abi: contractAbi,
        method,
        args: [owner as `0x${string}`, BigInt(index || 0)],
    });
};

/**
 * Get the token ID for an address given an index
 * @param owner the address to get the token ID for
 * @param index the index of the token ID
 * @param customEnabled - Flag to enable or disable the hook. Default is true.
 * @returns the token ID for the address (as a string)
 */
export const useTokenIdByAccount = (
    owner?: string,
    index?: number,
    customEnabled = true,
) => {
    const { network } = useVeChainKitConfig();
    const contractAddress = getConfig(network.type).galaxyMemberContractAddress;

    return useCallClause({
        address: contractAddress,
        abi: contractAbi,
        method,
        args: [owner as `0x${string}`, BigInt(index || 0)],
        queryOptions: {
            enabled:
                !!owner &&
                index !== undefined &&
                customEnabled &&
                !!network.type &&
                !!contractAddress,
            select: (data) => data[0].toString(),
        },
    });
};
