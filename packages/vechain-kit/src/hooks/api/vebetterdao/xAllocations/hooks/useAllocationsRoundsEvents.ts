import { useQuery } from '@tanstack/react-query';
import { useConnex } from '@vechain/dapp-kit-react';
import { getAllEventLogs } from '@/hooks';
import { getConfig } from '@/config';
import { XAllocationVoting__factory } from '@/contracts';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';
import { ThorClient } from '@vechain/sdk-network1.2';
import { compareAddresses } from '@/utils';

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
    const eventAbi = thor.contracts
        .load(xAllocationVotingContract, XAllocationVoting__factory.abi)
        .getEventAbi('RoundCreated');

    const events = await getAllEventLogs({
        thor,
        filterCriteria: [
            {
                criteria: {
                    address: xAllocationVotingContract,
                    // TODO: migration this is not a topic so might be removed.
                    topic0: eventAbi.signatureHash,
                },
                eventAbi,
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
        if (!event.decodedData) {
            throw new Error('Event data not decoded');
        }

        if (!compareAddresses(event.address, xAllocationVotingContract)) {
            throw new Error('Event address not valid');
        }

        const [roundId, proposer, voteStart, voteEnd, appsIds] =
            event.decodedData as [
                RoundCreated['roundId'],
                RoundCreated['proposer'],
                RoundCreated['voteStart'],
                RoundCreated['voteEnd'],
                RoundCreated['appsIds'],
            ];

        decodedCreatedAllocationEvents.push({
            roundId,
            proposer,
            voteStart,
            voteEnd,
            appsIds,
        });
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
