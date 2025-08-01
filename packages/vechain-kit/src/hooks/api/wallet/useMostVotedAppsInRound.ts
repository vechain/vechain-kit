import { useMemo } from 'react';
import { useRoundXApps } from './useRoundXApps';
import { useXAppsShares } from './useXAppShares';

export type XApp = {
    id: string;
    teamWalletAddress: string;
    name: string;
    metadataURI: string;
    createdAtTimestamp: string;
};

export type MostVotedAppsInRoundReturnType = {
    percentage: number;
    id: string;
    app: XApp;
};

/**
 * Get the most voted apps in a round
 *
 * @param roundId the id of the round to get the most voted apps
 * @returns a sorted array of the most voted apps in the round
 */
export const useMostVotedAppsInRound = (
    roundId?: string,
): { data: MostVotedAppsInRoundReturnType[]; isLoading: boolean } => {
    const { data: apps } = useRoundXApps(roundId);

    // get shares of apps
    const xAppsShares = useXAppsShares(
        apps?.map((app) => app.id) ?? [],
        roundId,
    );

    const mostVotedApps = useMemo(
        () =>
            xAppsShares.data
                ?.map((appShares) => ({
                    percentage: appShares.share + appShares.unallocatedShare,
                    id: apps?.find((xa) => xa.id === appShares.app)?.id ?? '',
                    app:
                        apps?.find((xa) => xa.id === appShares.app) ??
                        ({} as XApp),
                }))
                .sort((a, b) => Number(b.percentage) - Number(a.percentage)) ??
            [],
        [xAppsShares.data, apps],
    );

    return {
        data: mostVotedApps,
        isLoading: xAppsShares.isLoading,
    };
};
