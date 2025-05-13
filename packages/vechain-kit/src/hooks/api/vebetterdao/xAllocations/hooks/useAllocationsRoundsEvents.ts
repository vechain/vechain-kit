import { useQuery } from '@tanstack/react-query';
import { useConnex } from '@vechain/dapp-kit-react';
import { abi } from 'thor-devkit';
import { getAllEventLogs } from '@/hooks';
import { getConfig } from '@/config';
import { XAllocationVoting__factory } from '@/contracts';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';
import { ThorClient } from '@vechain/sdk-network1.2';
import { ABIEvent } from '@vechain/sdk-core1.2';

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
    const allocationCreatedAbi =
        XAllocationVoting__factory.createInterface().getEvent('RoundCreated');
    if (!allocationCreatedAbi) throw new Error('RoundCreated event not found');
    const allocationCreatedEvent = new abi.Event(
        allocationCreatedAbi as unknown as abi.Event.Definition,
    );

    const events = await getAllEventLogs({
        thor,
        filterCriteria: [
            {
                criteria: {
                    address: xAllocationVotingContract,
                    // TODO: migration this is not a topic so might be removed.
                    topic0: allocationCreatedEvent.signature,
                },
                eventAbi: new ABIEvent(allocationCreatedEvent.signature),
            },
        ],
        nodeUrl: getConfig(networkType).nodeUrl,
    });

    /**
     * Decode the events to get the data we are interested in (i.e the proposals)
     */
    const decodedCreatedAllocationEvents: RoundCreated[] = [];

    //   TODO: runtime validation with zod ?
    events.forEach((event: any) => {
        switch (event.topics[0]) {
            case allocationCreatedEvent.signature: {
                const decoded = allocationCreatedEvent.decode(
                    event.data,
                    event.topics,
                );
                decodedCreatedAllocationEvents.push({
                    roundId: decoded[0],
                    proposer: decoded[1],
                    voteStart: decoded[2],
                    voteEnd: decoded[3],
                    appsIds: decoded[4],
                });
                break;
            }

            default: {
                throw new Error('Unknown event');
            }
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
    const { thor } = useConnex();
    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: getAllocationsRoundsEventsQueryKey(),
        queryFn: async () =>
            await getAllocationsRoundsEvents(
                thor as unknown as ThorClient,
                network.type,
            ),
        enabled: !!thor && !!network.type,
    });
};
