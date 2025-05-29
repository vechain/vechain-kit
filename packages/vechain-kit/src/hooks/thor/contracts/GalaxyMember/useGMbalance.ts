import { useVeChainKitConfig } from '@/providers';
import { getConfig } from '@/config';
import { GalaxyMember__factory } from '@/contracts';
import { NETWORK_TYPE } from '@/config/network';
import { useCallClause, getCallClauseQueryKey } from '@/hooks';
import { ZERO_ADDRESS } from '@vechain/sdk-core';

const contractAbi = GalaxyMember__factory.abi;
const method = 'balanceOf';

export const getGMbalanceQueryKey = (
    networkType: NETWORK_TYPE,
    owner: string,
) => {
    const contractAddress = getConfig(networkType).galaxyMemberContractAddress;
    return getCallClauseQueryKey<typeof contractAbi>({
        address: contractAddress,
        method,
        args: [owner],
    });
};

/**
 * Get the number of GM NFTs for an address
 * @param owner the address to get the number of GM NFTs owned
 * @param customEnabled - Flag to enable or disable the hook. Default is true.
 * @returns the number of GM NFTs for the address
 */
export const useGMbalance = (owner: string | null, customEnabled = true) => {
    const { network } = useVeChainKitConfig();
    const contractAddress = getConfig(network.type).galaxyMemberContractAddress;

    // Galaxy Member GM balance result: [ 0n ]
    return useCallClause({
        address: contractAddress,
        abi: contractAbi,
        method,
        args: [owner ?? ZERO_ADDRESS],
        queryOptions: {
            enabled:
                !!owner && customEnabled && !!network.type && !!contractAddress,
            select: (data) => Number(data[0]),
        },
    });
};
