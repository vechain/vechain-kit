import { getConfig } from '@/config';
import { useVeChainKitConfig } from '@/providers';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

export const RoundAppVotesSchema = z.object({
    roundId: z.number(),
    appId: z.string(),
    voters: z.number(),
    totalVotes: z.string(),
});

export const RoundAppVotesResponseSchema = z.array(RoundAppVotesSchema);

export type RoundAppVotes = z.infer<typeof RoundAppVotesSchema>;
export type RoundAppVotesResponse = z.infer<typeof RoundAppVotesResponseSchema>;

type RoundAppVotesRequest = {
    roundId: number;
};

/**
 * Fetches the voting results for a specific round.
 *
 * @param data - The request data containing the round ID.
 * @param indexerUrl - The indexer URL.
 * @throws Will throw an error if the indexer URL is not found or if the round ID is not provided.
 * @throws Will throw an error if the fetch request fails.
 * @returns A promise that resolves to the voting results for the specified round.
 */
export const getRoundAppVotes = async (
    data: RoundAppVotesRequest,
    indexerUrl?: string,
): Promise<RoundAppVotesResponse> => {
    if (!indexerUrl) throw new Error('Indexer URL not found');
    if (!data.roundId) throw new Error('roundId is required');

    const response = await fetch(
        `${indexerUrl}/voting/xallocations/${data.roundId}/results`,
        {
            method: 'GET',
        },
    );

    if (!response.ok) {
        throw new Error(`Failed to fetch round votes: ${response.statusText}`);
    }

    return RoundAppVotesResponseSchema.parse(await response.json());
};

export const getRoundAppVotesQueryKey = (roundId: number) => [
    'VECHAIN_KIT',
    'ROUND',
    roundId,
    'APP_VOTES',
];

/**
 * Hook to get the voting results for a specific round.
 * @param roundId the round ID to get the votes for
 * @returns the voting results for the specified round {@link RoundAppVotes}
 */
export const useRoundAppVotes = ({ roundId }: RoundAppVotesRequest) => {
    const { network } = useVeChainKitConfig();
    const indexerUrl = getConfig(network.type).b3trIndexerUrl;

    return useQuery({
        queryKey: getRoundAppVotesQueryKey(roundId),
        queryFn: () => getRoundAppVotes({ roundId }, indexerUrl),
        enabled: !!roundId,
    });
};
