import { ethers } from 'ethers';
import { useMemo } from 'react';
import { useUserVotesInAllRounds } from './useUserVotesInAllRounds';
import { useXApps } from './useXApps';

export type AppVotesGiven = {
    appId: string;
    votes: number;
    appName?: string;
};

/**
 * Custom hook that retrieves the top voted apps of a specific user.
 * @param user - The address of the user.
 * @returns An array containing the top voted apps.
 */
export const useUserTopVotedApps = (user?: string) => {
    const userRoundVotes = useUserVotesInAllRounds(user);
    const { data: xApps } = useXApps();

    const topVotedAppIds = useMemo(() => {
        const appIdToVotes: Record<string, number> = {};

        userRoundVotes.data?.forEach((voteEvent) => {
            const appIds = voteEvent.appsIds;

            if (appIds && appIds.length > 0) {
                const voteWeights = voteEvent.voteWeights;

                if (!voteWeights || voteWeights.length !== appIds.length) {
                    return;
                }

                appIds.forEach((appId, i) => {
                    appIdToVotes[appId] =
                        (appIdToVotes[appId] || 0) +
                        Number(ethers.formatEther(voteWeights[i] ?? '0'));
                });
            }
        });

        return Object.entries(appIdToVotes)
            .sort(([, aVotes], [, bVotes]) => Number(bVotes) - Number(aVotes))
            .map(([appId, votes]) => ({ appId, votes }));
    }, [userRoundVotes]);

    const topVotedApps: AppVotesGiven[] = useMemo(() => {
        return topVotedAppIds.map((app) => {
            const appFound = xApps?.allApps.find(
                (xApp) => xApp.id === app.appId,
            );

            return {
                appName: appFound?.name,
                ...app,
            };
        });
    }, [topVotedAppIds, xApps]);

    return topVotedApps;
};
