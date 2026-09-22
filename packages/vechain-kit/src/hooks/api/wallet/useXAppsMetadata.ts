import { useCallback } from 'react';
import { useQueries, UseQueryResult } from '@tanstack/react-query';
import { X2EarnApps__factory } from '@vechain/vechain-contract-types';
import { getConfig } from '@/config';
import { useVeChainKitConfig } from '@/providers';
import { useCallClause } from '@/hooks';
import {
    getXAppMetadata,
    getXAppMetadataQueryKey,
    XAppMetadata,
} from './useXAppMetadata';

const abi = X2EarnApps__factory.abi;
const baseUriMethod = 'baseURI' as const;

/**
 * The minimum an xApp has to expose for its metadata document to be resolvable.
 * `getAppsOfRound` already returns both fields, so no extra contract call per
 * app is needed.
 */
export type XAppMetadataRef = {
    id: string;
    metadataURI: string;
};

/** Stable identity so an absent app list doesn't invalidate the memos below. */
const NO_APPS: XAppMetadataRef[] = [];

export type XAppsMetadataReturnType = {
    /** Resolved metadata per xApp id. Missing while loading or on failure. */
    metadataByAppId: Record<string, XAppMetadata | undefined>;
    isLoading: boolean;
};

/**
 * Resolve the IPFS metadata documents of many xApps in parallel.
 *
 * `baseURI()` is identical for every app, so it is read once per network and
 * never refetched. Each document is then fetched under the same query key as
 * {@link useXAppMetadata}, so a list and the per-app cards share one cache
 * entry rather than fetching the same document twice.
 *
 * @param apps - The xApps to resolve, as returned by `useRoundXApps`
 * @returns The metadata keyed by xApp id, see {@link XAppsMetadataReturnType}
 */
export const useXAppsMetadata = (
    apps: XAppMetadataRef[] = NO_APPS,
): XAppsMetadataReturnType => {
    const { network } = useVeChainKitConfig();

    const address = getConfig(network.type)
        .x2EarnAppsContractAddress as `0x${string}`;

    // baseURI() is the same for every app in the round: fetch it once.
    const { data: baseUri } = useCallClause({
        abi,
        address,
        method: baseUriMethod,
        args: [],
        queryOptions: {
            select: (data) => data[0],
            staleTime: Infinity,
        },
    });

    // react-query re-runs `combine` whenever its identity changes, so keep it
    // stable to keep the returned map stable too.
    const combine = useCallback(
        (results: UseQueryResult<XAppMetadata | undefined>[]) => ({
            metadataByAppId: Object.fromEntries(
                results.map((result, index) => [
                    apps[index]?.id ?? '',
                    result.data,
                ]),
            ),
            isLoading: results.some((result) => result.isLoading),
        }),
        [apps],
    );

    return useQueries({
        queries: apps.map((app) => ({
            queryKey: getXAppMetadataQueryKey(app.id),
            queryFn: () =>
                getXAppMetadata(`${baseUri}${app.metadataURI}`, network.type),
            enabled: !!baseUri && !!app.id && !!app.metadataURI,
            retry: (failureCount: number, error: Error) => {
                // Don't retry on cancellation or validation errors
                if (error instanceof Error) {
                    const errorMessage = error.message.toLowerCase();
                    if (
                        errorMessage.includes('cancel') ||
                        errorMessage.includes('abort')
                    ) {
                        return false;
                    }
                }
                // Retry network errors up to 2 times
                return failureCount < 2;
            },
            staleTime: Infinity,
        })),
        combine,
    });
};
