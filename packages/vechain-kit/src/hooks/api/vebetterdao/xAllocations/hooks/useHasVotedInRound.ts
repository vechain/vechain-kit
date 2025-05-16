import { getConfig } from '@/config';
import { XAllocationVoting__factory } from '@/contracts';
import { useVeChainKitConfig } from '@/providers';
import { getCallClauseQueryKey, useCallClause } from '@/hooks/utils';
import { NETWORK_TYPE } from '@/config/network';

const method = 'hasVoted' as const;
const abi = XAllocationVoting__factory.abi;

export const getHasVotedInRoundQueryKey = (
    roundId: string,
    address: string,
    networkType: NETWORK_TYPE,
) =>
    getCallClauseQueryKey({
        abi,
        address: getConfig(networkType).xAllocationVotingContractAddress,
        method,
        args: [BigInt(roundId!), address as `0x${string}`],
    });

/**
 *  Hook to get if a user has voted in a given roundId
 * @param roundId  the roundId the get the votes for
 * @param address  the address to check if they have voted
 * @returns  if a user has voted in a given roundId
 */
export const useHasVotedInRound = (roundId?: string, address?: string) => {
    const { network } = useVeChainKitConfig();

    return useCallClause({
        abi,
        address: getConfig(network.type).xAllocationVotingContractAddress,
        method,
        args: [BigInt(roundId!), address as `0x${string}`],
        queryOptions: {
            enabled: !!roundId && !!address,
        },
    });
};
