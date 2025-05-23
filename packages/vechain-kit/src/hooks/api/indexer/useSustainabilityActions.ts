import { getConfig } from '@/config';
import { useVeChainKitConfig } from '@/providers';
import { buildQueryString } from '@/utils';
import { useInfiniteQuery } from '@tanstack/react-query';
import { z } from 'zod';

export const SustainabilityActionsResponseSchema = z.object({
    pagination: z.object({
        hasNext: z.boolean(),
    }),
    data: z
        .array(
            z.object({
                blockNumber: z.number(),
                blockTimestamp: z.number(),
                appId: z.string(),
                distributor: z.string(),
                amount: z.number(),
                receiver: z.string(),

                proof: z
                    .object({
                        version: z.number(),
                        description: z.string(),
                        proof: z
                            .object({
                                image: z.string().optional(),
                                link: z.string().optional(),
                                text: z.string().optional(),
                                video: z.string().optional(),
                            })
                            .optional(),
                        impact: z
                            .object({
                                carbon: z.number().optional(),
                                water: z.number().optional(),
                                energy: z.number().optional(),
                                waste_mass: z.number().optional(),
                                waste_items: z.number().optional(),
                                waste_reduction: z.number().optional(),
                                biodiversity: z.number().optional(),
                                people: z.number().optional(),
                                timber: z.number().optional(),
                                plastic: z.number().optional(),
                                learning_time: z.number().optional(),
                            })
                            .optional(),
                    })
                    .optional(),
            }),
        )
        .default([]),
});

export type SustainabilityActionsResponse = z.infer<
    typeof SustainabilityActionsResponseSchema
>;
export type SustainabilityProof = z.infer<
    typeof SustainabilityActionsResponseSchema
>['data'][number]['proof'];

type SustainabilityActionsRequest = {
    appId?: string;
    wallet?: string;
    before?: number;
    after?: number;
    page?: number;
    size?: number;
    direction?: 'asc' | 'desc';
};

/**
 * Get the sustainability actions overview for a user or app, with the given request data
 * @param data  the request data @see SustainabilityActionsRequest
 * @param indexerUrl the indexer url
 * @returns the response data @see SustainabilityActionsResponse
 */
export const getSustainabilityActions = async (
    data: SustainabilityActionsRequest,
    indexerUrl: string,
): Promise<SustainabilityActionsResponse> => {
    if (!indexerUrl) throw new Error('Indexer URL not found');
    if (!data.appId && !data.wallet)
        throw new Error('appId or wallet is required');

    const queryString = buildQueryString(data);

    const response = await fetch(
        `${indexerUrl}/sustainability/actions?${queryString}`,
        {
            method: 'GET',
        },
    );

    if (!response.ok) {
        throw new Error(
            `Failed to fetch sustainability actions: ${response.statusText}`,
        );
    }

    let result;

    try {
        result = await response.json();

        return SustainabilityActionsResponseSchema.parse(result);
    } catch (e) {
        throw new Error(`Failed to parse sustainability actions: ${e}`);
    }
};

export const getSustainabilitActionsQueryKey = (
    data: Omit<SustainabilityActionsRequest, 'page' | 'size'>,
) => [
    'VECHAIN_KIT',
    'SUSTAINABILITY',
    'ACTIONS',
    data.appId,
    data.wallet,
    ...(data.before ? ['BEFORE', data.before] : []),
    ...(data.after ? ['AFTER', data.after] : []),
    data.direction,
];

/**
 * Get the sustainability actions overview for a user or app, with the given request data
 * @param data the request data @see SustainabilityUserOverviewRequest
 * @returns the query object with the data @see SustainabilityActionsResponse
 */
export const useSustainabilityActions = (
    data: Omit<SustainabilityActionsRequest, 'page' | 'size'>,
) => {
    const { network } = useVeChainKitConfig();
    const indexerUrl = getConfig(network.type).b3trIndexerUrl;

    if (!indexerUrl) throw new Error('Indexer URL not found');

    return useInfiniteQuery({
        queryKey: getSustainabilitActionsQueryKey(data),
        queryFn: ({ pageParam = 0 }) =>
            getSustainabilityActions({ page: pageParam, ...data }, indexerUrl),
        initialPageParam: 0,
        getNextPageParam: (lastPage, _pages, lastPageParam) =>
            lastPage.pagination.hasNext ? lastPageParam + 1 : undefined,
    });
};
