import { useQuery } from '@tanstack/react-query';
import { useThor } from '@vechain/dapp-kit-react';
import { getAllEvents } from '@/hooks';
import { getConfig } from '@/config';
import { XAllocationVoting__factory } from '@/contracts';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';
import { type ThorClient } from '@vechain/sdk-network';

export type RoundCreated = {
    roundId: string;
    proposer: string;
    voteStart: string;
    voteEnd: string;
    appsIds: string[];
};

/**
 * Returns all allocation rounds events
 * @param thor the thor client
 * @param networkType the network type
 * @returns the allocation rounds events
 */
export const getAllocationsRoundsEvents = async (
    thor: ThorClient,
    networkType: NETWORK_TYPE,
) => {
    const xAllocationVotingContract =
        getConfig(networkType).xAllocationVotingContractAddress;

    const allocationCreatedEvent = thor.contracts
        .load(xAllocationVotingContract, XAllocationVoting__factory.abi)
        .getEventAbi('RoundCreated');

    /**
     * Filter criteria to get the events from the governor contract that we are interested in
     * This way we can get all of them in one call
     */
    const filterCriteria = [
        {
            address: xAllocationVotingContract,
            topic0: allocationCreatedEvent.signature,
        },
    ];

    const events = await getAllEvents({
        thor,
        filterCriteria,
    });

    /**
     * Decode the events to get the data we are interested in (i.e the proposals)
     */
    const decodedCreatedAllocationEvents: RoundCreated[] = [];

    events.forEach((event: any) => {
        if (event.topics[0] === event.signature) {
            const decoded = event.decodedData || event.decoded;
            decodedCreatedAllocationEvents.push({
                roundId: decoded[0],
                proposer: decoded[1],
                voteStart: decoded[2],
                voteEnd: decoded[3],
                appsIds: decoded[4],
            });
        } else {
            throw new Error('Unknown event');
        }
    });

    return {
        created: decodedCreatedAllocationEvents,
    };
};

export const getAllocationsRoundsEventsQueryKey = () => [
    'VECHAIN_KIT',
    'allocationRoundsEvents',
];

/**
 * Hook to get the allocation rounds events from the xAllocationVoting contract
 * @returns the allocation rounds events
 */
export const useAllocationsRoundsEvents = () => {
    const thor = useThor();
    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: getAllocationsRoundsEventsQueryKey(),
        queryFn: async () =>
            await getAllocationsRoundsEvents(thor, network.type),
        enabled: !!thor && !!network.type,
    });
};
