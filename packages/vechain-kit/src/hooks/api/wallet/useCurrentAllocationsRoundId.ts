import { getConfig } from '@/config';
import { XAllocationVoting__factory } from '@vechain/vechain-contract-types';
import { useCallClause, getCallClauseQueryKey } from '@/hooks';
import { useVeChainKitConfig } from '@/providers';

const abi = XAllocationVoting__factory.abi;
const method = 'currentRoundId' as const;

/**
 * Returns the query key for fetching the current allocations round ID.
 * @returns The query key for fetching the current allocations round ID.
 */
export const getCurrentAllocationsRoundIdQueryKey = (address: string) =>
    getCallClauseQueryKey({ abi, address, method });

/**
 * Hook to get the current roundId of allocations voting
 * @returns the current roundId of allocations voting
 */
export const useCurrentAllocationsRoundId = () => {
    const { network } = useVeChainKitConfig();

    const address = getConfig(network.type)
        .xAllocationVotingContractAddress as `0x${string}`;

    return useCallClause({
        abi,
        address,
        method,
        args: [],
        queryOptions: {
            select: (data) => data[0].toString(),
        },
    });
};
