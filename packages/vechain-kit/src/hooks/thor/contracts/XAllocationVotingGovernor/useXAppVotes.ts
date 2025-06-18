import { getConfig } from '@/config';
import { NETWORK_TYPE } from '@/config/network';
import { XAllocationVotingGovernor__factory } from '@/contracts';
import { getCallClauseQueryKey, useCallClause } from '@/hooks';
import { useVeChainKitConfig } from '@/providers';
import { formatEther } from 'viem';

const contractAbi = XAllocationVotingGovernor__factory.abi;
const method = 'getAppVotes' as const;

/**
 *  Returns the query key for fetching the number of  votes for a given app in a roundId.
 * @param networkType  the network type
 * @param roundId  the roundId the get the votes for
 * @param appId  the xApp id (bytes32 hex string)
 */
export const getXAppVotesQueryKey = (
    networkType: NETWORK_TYPE,
    roundId: number | string,
    appId: string,
) =>
    getCallClauseQueryKey<typeof contractAbi>({
        address: getConfig(networkType).xAllocationVotingContractAddress,
        method,
        args: [BigInt(roundId || 0), appId as `0x${string}`],
    });

/**
 *  Hook to get the number of votes for a given app in a roundId
 *
 * @param roundId  the roundId the get the votes for (number or string)
 * @param appId  the xApp id (bytes32 hex string)
 * @returns  the number of votes for a given roundId
 */
export const useXAppVotes = (roundId?: number | string, appId?: string) => {
    const { network } = useVeChainKitConfig();
    const contractAddress = getConfig(
        network.type,
    ).xAllocationVotingContractAddress;

    // X Allocation Voting Governor app votes result: [ 0n ]
    return useCallClause({
        address: contractAddress,
        abi: contractAbi,
        method,
        args: [BigInt(roundId || 0), appId as `0x${string}`],
        queryOptions: {
            enabled: !!roundId && !!appId && !!network.type,
            select: (res) => formatEther(BigInt(res[0].$bigintString)),
        },
    });
};
