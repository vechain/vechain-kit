import { useQuery } from '@tanstack/react-query';
import { useConnex } from '@vechain/dapp-kit-react';
import { abi } from 'thor-devkit';
import { getAllEventLogs } from '@/hooks';
import { XAllocationVoting__factory } from '@/contracts';
import { getConfig } from '@/config';
import { NETWORK_TYPE } from '@/config/network';
import { useVeChainKitConfig } from '@/providers';
import { FilterCriteria, ThorClient } from '@vechain/sdk-network1.2';
import { ABIEvent } from '@vechain/sdk-core1.2';
const XAllocationVotingInterface = XAllocationVoting__factory.createInterface();

export type AllocationVoteCastEvent = {
    voter: string;
    roundId: string;
    appsIds: string[];
    voteWeights: string[];
};

export const getUserVotesInRound = async (
    thor: Connex.Thor,
    network: NETWORK_TYPE,
    roundId?: string,
    address?: string,
): Promise<AllocationVoteCastEvent[]> => {
    const xAllocationVotingContract =
        getConfig(network).xAllocationVotingContractAddress;
    const eventFragment =
        XAllocationVotingInterface.getEvent('AllocationVoteCast').format(
            'json',
        );
    const allocationVoteCast = new abi.Event(
        JSON.parse(eventFragment) as abi.Event.Definition,
    );

    const topics = allocationVoteCast.encode({
        ...(address ? { voter: address } : {}),
        ...(roundId ? { roundId } : {}),
    });
    /**
     * Filter criteria to get the events from the governor contract that we are interested in
     * This way we can get all of them in one call
     */
    const filterCriteria: FilterCriteria[] = [
        {
            criteria: {
                address: xAllocationVotingContract,
                topic0: topics[0] ?? undefined,
                topic1: topics[1] ?? undefined,
                topic2: topics[2] ?? undefined,
                topic3: topics[3] ?? undefined,
                topic4: topics[4] ?? undefined,
            },
            eventAbi: new ABIEvent(allocationVoteCast.signature),
        },
    ];

    const events = await getAllEventLogs({
        thor: thor as unknown as ThorClient,
        filterCriteria,
        nodeUrl: getConfig(network).nodeUrl,
    });

    /**
     * Decode the events to get the data we are interested in (i.e the proposals)
     */
    const decodedAllocatedVoteEvents: AllocationVoteCastEvent[] = [];

    //   TODO: runtime validation with zod ?
    events.forEach((event) => {
        switch (event.topics[0]) {
            case allocationVoteCast.signature: {
                const decoded = allocationVoteCast.decode(
                    event.data,
                    event.topics,
                );
                decodedAllocatedVoteEvents.push({
                    voter: decoded[0],
                    roundId: decoded[1],
                    appsIds: decoded[2],
                    voteWeights: decoded[3],
                });
                break;
            }

            default: {
                throw new Error('Unknown event');
            }
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
    const { thor } = useConnex();
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
        enabled:
            !!thor &&
            !!thor.status.head.number &&
            !!roundId &&
            !!address &&
            !!network.type,
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
    const { thor } = useConnex();
    const { network } = useVeChainKitConfig();
    return useQuery({
        queryKey: getVotesInRoundQueryKey(roundId),
        queryFn: async () =>
            await getUserVotesInRound(thor, network.type, roundId),

        enabled:
            !!thor &&
            !!thor.status.head.number &&
            !!roundId &&
            enabled &&
            !!network.type,
    });
};
