import { useMemo } from 'react';
import { getConfig } from '@/config';
import { NETWORK_TYPE } from '@/config/network';
import { XAllocationVoting__factory } from '@vechain/vechain-contract-types';
import { useVeChainKitConfig } from '@/providers';
import { getCallClauseQueryKeyWithArgs, useCallClause } from '@/hooks';
import { useXAppsMetadata } from './useXAppsMetadata';

const abi = XAllocationVoting__factory.abi;
const method = 'getAppsOfRound' as const;

/**
 * An xApp taking part in an allocation round.
 *
 * @property id - The id of the xApp (keccak256 of its submission name)
 * @property teamWalletAddress - The wallet receiving the app's allocation
 * @property name - The name to display. Resolved from the app's IPFS metadata
 * document when available, falling back to {@link XApp.onchainName}
 * @property onchainName - The immutable name the app was submitted with. The
 * X2EarnApps contract writes it once at submission and offers no setter, so a
 * rebrand never reaches it — it only ever lands in the IPFS metadata
 * @property metadataURI - The app's metadata document, relative to `baseURI()`
 * @property createdAtTimestamp - When the app was submitted
 */
export type XApp = {
    id: string;
    teamWalletAddress: string;
    name: string;
    onchainName: string;
    metadataURI: string;
    createdAtTimestamp: string;
};

export const getRoundXAppsQueryKey = (
    roundId: string,
    networkType: NETWORK_TYPE,
) =>
    getCallClauseQueryKeyWithArgs({
        abi,
        address: getConfig(networkType)
            .xAllocationVotingContractAddress as `0x${string}`,
        method,
        args: [BigInt(roundId ?? 0)],
    });

/**
 * Get the xApps taking part in an allocation round, straight from the contract.
 *
 * Both `name` and `onchainName` carry the immutable on-chain name here. Use
 * {@link useRoundXAppsWithMetadata} to get the rebrandable display name.
 *
 * @param roundId the id of the round to get the apps for
 */
export const useRoundXApps = (roundId?: string) => {
    const { network } = useVeChainKitConfig();

    const address = getConfig(network.type)
        .xAllocationVotingContractAddress as `0x${string}`;

    return useCallClause({
        abi,
        address,
        method,
        args: [BigInt(roundId ?? 0)],
        queryOptions: {
            enabled: !!roundId,
            select: (data): XApp[] =>
                data[0].map((app) => ({
                    id: app.id.toString(),
                    teamWalletAddress: app.teamWalletAddress,
                    name: app.name,
                    onchainName: app.name,
                    metadataURI: app.metadataURI,
                    createdAtTimestamp: app.createdAtTimestamp.toString(),
                })),
        },
    });
};

/**
 * Get the xApps of an allocation round with their display name resolved.
 *
 * The on-chain `App.name` is written once at submission and can never change,
 * so an app that rebrands keeps its original name on chain forever. The new
 * name only ever lands in the app's IPFS metadata document. This hook prefers
 * that metadata name and falls back to the on-chain one whenever the metadata
 * is missing, still loading or fails to fetch, so a name is always rendered.
 *
 * @param roundId the id of the round to get the apps for
 */
export const useRoundXAppsWithMetadata = (roundId?: string) => {
    const roundXApps = useRoundXApps(roundId);
    const apps = roundXApps.data;

    const { metadataByAppId, isLoading: isMetadataLoading } =
        useXAppsMetadata(apps);

    const data = useMemo(
        () =>
            apps?.map((app) => ({
                ...app,
                // Trim first: a whitespace-only metadata name is truthy and
                // would otherwise render an empty label instead of falling back.
                name: metadataByAppId[app.id]?.name?.trim() || app.onchainName,
            })),
        [apps, metadataByAppId],
    );

    return {
        ...roundXApps,
        data,
        // Deliberately not folded into `isLoading`: the list renders on-chain
        // names right away and upgrades them as each document resolves, rather
        // than waiting on one gateway request per app.
        isMetadataLoading,
    };
};
