import { getConfig } from '@/config';
import { XAllocationVoting__factory } from '@/contracts';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';
import { getCallClauseQueryKey, useCallClause } from '@/hooks';

const abi = XAllocationVoting__factory.abi;
const method = 'currentRoundId' as const;

export const getCurrentAllocationsRoundIdQueryKey = (network: NETWORK_TYPE) =>
    getCallClauseQueryKey({
        abi,
        method,
        address: getConfig(network).xAllocationVotingContractAddress,
        args: [],
    });

/**
 * Hook to get the current roundId of allocations voting
 * @returns  the current roundId of allocations voting
 */
export const useCurrentAllocationsRoundId = () => {
    const { network } = useVeChainKitConfig();

    // X Allocation Voting current round ID result: [ 47n ]
    return useCallClause({
        abi,
        address: getConfig(network.type).xAllocationVotingContractAddress,
        method,
        args: [],
        queryOptions: {
            enabled: !!network.type,
            select: (data) => data[0].toString(),
        },
    });
};
