import { useMemo } from 'react';
import { useRoundXAppsWithMetadata, XApp } from './useRoundXApps';
import { useXAppsShares } from './useXAppShares';

export type { XApp };

export type MostVotedAppsInRoundReturnType = {
    percentage: number;
    id: string;
    app: XApp;
};

/**
 * Get the most voted apps in a round
 *
 * App names are resolved from each app's IPFS metadata document, falling back
 * to the immutable on-chain name, so a rebranded app shows its current name.
 * The raw on-chain name stays available on `app.onchainName`.
 *
 * @param roundId the id of the round to get the most voted apps
 * @returns a sorted array of the most voted apps in the round
 */
export const useMostVotedAppsInRound = (
    roundId?: string,
): { data: MostVotedAppsInRoundReturnType[]; isLoading: boolean } => {
    const { data: apps } = useRoundXAppsWithMetadata(roundId);

    // get shares of apps
    const xAppsShares = useXAppsShares(
        apps?.map((app) => app.id) ?? [],
        roundId,
    );

    const mostVotedApps = useMemo(
        () =>
            xAppsShares.data
                ?.flatMap((appShares) => {
                    const app = apps?.find((xa) => xa.id === appShares.app);
                    if (!app) return [];

                    return [
                        {
                            percentage:
                                appShares.share + appShares.unallocatedShare,
                            id: app.id,
                            app,
                        },
                    ];
                })
                .sort((a, b) => Number(b.percentage) - Number(a.percentage)) ??
            [],
        [xAppsShares.data, apps],
    );

    return {
        data: mostVotedApps,
        isLoading: xAppsShares.isLoading,
    };
};
