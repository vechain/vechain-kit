import { useQuery } from '@tanstack/react-query';
import { useThor } from '@vechain/dapp-kit-react';
import { getAllEvents } from '@/hooks/api/blockchain';
import { XAllocationVoting__factory } from '@/contracts';
import { getConfig } from '@/config';
import { NETWORK_TYPE } from '@/config/network';
import { useVeChainKitConfig } from '@/providers';
import { type ThorClient } from '@vechain/sdk-network';

export type AllocationVoteCastEvent = {
    voter: string;
    roundId: string;
    appsIds: string[];
    voteWeights: string[];
};

export const getUserVotesInRound = async (
    thor: ThorClient,
    network: NETWORK_TYPE,
    roundId?: string,
    address?: string,
): Promise<AllocationVoteCastEvent[]> => {
    const xAllocationVotingContract =
        getConfig(network).xAllocationVotingContractAddress;

    const allocationVoteCast = thor.contracts
        .load(xAllocationVotingContract, XAllocationVoting__factory.abi)
        .getEventAbi('AllocationVoteCast');

    const topics = allocationVoteCast.encodeFilterTopics({
        ...(address ? { voter: address } : {}),
        ...(roundId ? { roundId } : {}),
    });
    /**
     * Filter criteria to get the events from the governor contract that we are interested in
     * This way we can get all of them in one call
     */
    const filterCriteria = [
        {
            address: xAllocationVotingContract,
            topic0: topics[0] ?? undefined,
            topic1: topics[1] ?? undefined,
            topic2: topics[2] ?? undefined,
            topic3: topics[3] ?? undefined,
            topic4: topics[4] ?? undefined,
        },
    ];

    const events = await getAllEvents({
        thor,
        filterCriteria,
    });

    /**
     * Decode the events to get the data we are interested in (i.e the proposals)
     */
    const decodedAllocatedVoteEvents: AllocationVoteCastEvent[] = [];

    events.forEach((event: any) => {
        if (event.topics[0] === event.signature) {
            const decoded = event.decodedData || event.decoded;
            decodedAllocatedVoteEvents.push({
                voter: decoded[0],
                roundId: decoded[1],
                appsIds: decoded[2],
                voteWeights: decoded[3],
            });
        } else {
            throw new Error('Unknown event');
        }
    });

    return decodedAllocatedVoteEvents;
};

export const getUserVotesInRoundQueryKey = (
    roundId?: string,
    address?: string,
) => [
    'VECHAIN_KIT',
    'allocationsRound',
    roundId,
    'userVotes',
    ...(address ? [address] : []),
];

/**
 *  Hook to get the user votes in a given round from the xAllocationVoting contract
 * @returns the user votes in a given round from the xAllocationVoting contract
 */
export const useUserVotesInRound = (roundId?: string, address?: string) => {
    const thor = useThor();
    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: getUserVotesInRoundQueryKey(roundId, address),
        queryFn: async () => {
            const votes = await getUserVotesInRound(
                thor,
                network.type,
                roundId,
                address,
            );
            if (votes.length > 1) throw new Error('More than one event found');
            if (votes.length === 0) throw new Error('No event found');
            return votes[0];
        },
        enabled: !!thor && !!roundId && !!address && !!network.type,
    });
};

export const getVotesInRoundQueryKey = (roundId?: string) => [
    'VECHAIN_KIT',
    'allocationsRound',
    roundId,
    'totalVotes',
];

/**
 *  Hook to get the allocation rounds events from the xAllocationVoting contract (i.e the proposals created)
 * @returns  the allocation rounds events (i.e the proposals created)
 */
export const useVotesInRound = (roundId?: string, enabled = true) => {
    const thor = useThor();
    const { network } = useVeChainKitConfig();
    return useQuery({
        queryKey: getVotesInRoundQueryKey(roundId),
        queryFn: async () =>
            await getUserVotesInRound(thor, network.type, roundId),

        enabled: !!thor && !!roundId && enabled && !!network.type,
    });
};
