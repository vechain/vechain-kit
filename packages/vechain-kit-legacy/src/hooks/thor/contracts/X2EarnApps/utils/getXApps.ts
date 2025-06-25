import { getConfig } from '@/config';
import { NETWORK_TYPE } from '@/config/network';
import { X2EarnApps__factory } from '@/contracts';
import { ViewFunctionResult } from '@/utils';
import { ThorClient } from '@vechain/sdk-network';

/**
 * xApp type
 * @property id  the xApp id
 * @property teamWalletAddress  the xApp address
 * @property name  the xApp name
 * @property metadataURI  the xApp metadata URI
 * @property createdAtTimestamp timestamp when xApp was added
 */
export type XApp = {
    id: string;
    teamWalletAddress: string;
    name: string;
    metadataURI: string;
    createdAtTimestamp: string;
};

export type UnendorsedApp = XApp & {
    appAvailableForAllocationVoting: boolean;
};

/**
 * This function is here nad not coupled with the hook as we need it with SSR, and dapp-kit broke the pre-fetching
 * Returns all the available xApps in the B3TR ecosystem
 * @param thor  the thor client
 * @returns  all the available xApps in the ecosystem capped to 256 see {@link XApp}
 */

type GetAllApps = {
    active: XApp[];
    unendorsed: UnendorsedApp[];
    allApps: (XApp | UnendorsedApp)[];
    endorsed: XApp[];
};
export const getXApps = async (
    thor: ThorClient,
    networkType: NETWORK_TYPE,
): Promise<GetAllApps> => {
    const contract = thor.contracts.load(
        getConfig(networkType).x2EarnAppsContractAddress,
        X2EarnApps__factory.abi,
    );
    const clauses = [contract.clause.apps(),contract.clause.unendorsedApps()];

    const res = await thor.transactions.executeMultipleClausesCall(clauses);
    if (!res.every((r) => r.success)) throw new Error(`Failed to fetch xApps`);

    const apps = res[0]?.result.plain as
        | ViewFunctionResult<typeof X2EarnApps__factory.abi, 'apps'>[0]
        | [];

    const unendorsedApps = res[1]?.result.plain as
        | ViewFunctionResult<
              typeof X2EarnApps__factory.abi,
              'unendorsedApps'
          >[0]
        | [];

    const allApps: Record<string, XApp | UnendorsedApp> = {};

    for (const app of apps) {
        allApps[app.id] = {
            id: app.id,
            teamWalletAddress: app.teamWalletAddress,
            name: app.name,
            metadataURI: app.metadataURI,
            createdAtTimestamp: app.createdAtTimestamp.toString(),
        };
    }
    for (const app of unendorsedApps) {
        allApps[app.id] = {
            id: app.id,
            teamWalletAddress: app.teamWalletAddress,
            name: app.name,
            metadataURI: app.metadataURI,
            createdAtTimestamp: app.createdAtTimestamp.toString(),
            appAvailableForAllocationVoting:
                app.appAvailableForAllocationVoting,
        };
    }

    const unendorsedIds = new Set(unendorsedApps.map((app) => app.id));

    return {
        allApps: Object.values(allApps),
        active: apps.map((app) => ({
            ...app,
            createdAtTimestamp: app.createdAtTimestamp.toString(),
        })),
        unendorsed: unendorsedApps.map((app) => ({
            ...app,
            createdAtTimestamp: app.createdAtTimestamp.toString(),
        })),
        endorsed: apps
            .filter((app) => !unendorsedIds.has(app.id))
            .map((app) => ({
                ...app,
                createdAtTimestamp: app.createdAtTimestamp.toString(),
            })),
    };
};
