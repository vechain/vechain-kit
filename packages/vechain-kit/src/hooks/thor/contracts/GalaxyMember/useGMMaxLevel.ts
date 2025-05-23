import { getConfig } from '@/config';
import { GalaxyMember__factory } from '@/contracts';
import { useVeChainKitConfig } from '@/providers';
import { useCallClause, getCallClauseQueryKey } from '@/hooks';
import { NETWORK_TYPE } from '@/config/network';

const contractAbi = GalaxyMember__factory.abi;
const method = 'MAX_LEVEL';

export const getGMMaxLevelQueryKey = (networkType: NETWORK_TYPE) => {
    const contractAddress = getConfig(networkType).galaxyMemberContractAddress;
    return getCallClauseQueryKey({
        address: contractAddress,
        abi: contractAbi,
        method,
        args: [],
    });
};

/**
 * Custom hook that retrieves the maximum level of the Galaxy Member NFT.
 *
 * @param enabled - Determines whether the hook is enabled or not. Default is true.
 * @returns The maximum level of the Galaxy Member NFT.
 */
export const useGMMaxLevel = (enabled = true) => {
    const { network } = useVeChainKitConfig();
    const contractAddress = getConfig(network.type).galaxyMemberContractAddress;

    // Galaxy Member GM max level result: [ 6n ]
    return useCallClause({
        address: contractAddress,
        abi: contractAbi,
        method,
        args: [],
        queryOptions: {
            enabled: enabled && !!network.type && !!contractAddress,
        },
    });
};
