import { useRoundXApps } from './useRoundXApps';
import { useXApps } from './useXApps';
import { XApp } from '../getXApps';
import { useMemo } from 'react';
import { useXAppsShares } from './useXAppsShares';

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
    // get apps from round
    const { data: roundXApps } = useRoundXApps(roundId);

    // Notice: this trick is used because when starting the project in the local environment,
    // the roundId is "0" and the roundXApps is undefined, which will cause the app to not render apps info.
    const { data: allXApps } = useXApps();
    const apps = roundId === '0' ? allXApps?.active : roundXApps;

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
