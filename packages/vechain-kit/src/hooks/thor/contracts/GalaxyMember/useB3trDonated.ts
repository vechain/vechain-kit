import { getConfig } from '@/config';
import { GalaxyMember__factory } from '@/contracts';
import { useVeChainKitConfig } from '@/providers';
import { formatEther } from 'viem';
import { useCallClause, getCallClauseQueryKey } from '@/hooks';
import { NETWORK_TYPE } from '@/config/network';

const contractAbi = GalaxyMember__factory.abi;
const method = 'getB3TRdonated';

export const getB3trDonatedQueryKey = (
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
 * Custom hook to fetch the amount of B3TR tokens donated for a given token ID.
 *
 * @param {string} [tokenId] - The ID of the token to fetch the donation amount for.
 * @param {boolean} [customEnabled=true] - Flag to enable or disable the hook.
 * @returns The result of the useCall hook, with the donation amount formatted in Ether.
 */
export const useB3trDonated = (tokenId?: string, customEnabled = true) => {
    const { network } = useVeChainKitConfig();
    const contractAddress = getConfig(network.type).galaxyMemberContractAddress;

    // Galaxy Member B3TR donated result: [ 10000000000000000000000n ]
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
            select: (data) => formatEther(data[0]),
        },
    });
};
