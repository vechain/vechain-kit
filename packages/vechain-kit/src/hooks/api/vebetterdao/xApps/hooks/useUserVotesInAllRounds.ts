import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getUserVotesInRound, getUserVotesInRoundQueryKey } from '.';
import { useConnex } from '@vechain/dapp-kit-react';
import { useVeChainKitConfig } from '@/providers';

/**
 * useUserVotes is a custom hook that fetches the votes of a user for all rounds up to the current one.
 * @param currentRound - The id of the current round.
 * @param address - The address of the user.
 * @returns An object containing the status and data of the queries for each round.
 */
export const useUserVotesInAllRounds = (address?: string) => {
    const { thor } = useConnex();
    const { network } = useVeChainKitConfig();
    const queryClient = useQueryClient();

    return useQuery({
        queryKey: getUserVotesInRoundQueryKey('ALL', address),
        queryFn: async () => {
            const votesEvents = await getUserVotesInRound(
                thor,
                network.type,
                undefined,
                address,
            );
            const foundRounds: (number | string)[] = [];

            votesEvents.forEach((voteEvent) => {
                if (foundRounds.includes(voteEvent.roundId))
                    throw new Error(
                        `Duplicate votes for round ${voteEvent.roundId}`,
                    );
                foundRounds.push(voteEvent.roundId);

                queryClient.setQueryData(
                    getUserVotesInRoundQueryKey(voteEvent.roundId, address),
                    voteEvent,
                );
            });
            return votesEvents;
        },
        enabled:
            !!thor && !!thor.status.head.number && !!address && !!network.type,
    });
};
