import { getConfig } from '@/config';
import { NETWORK_TYPE } from '@/config/network';
import { X2EarnApps__factory as X2EarnApps } from '@/contracts';
import { ContractClause, ThorClient } from '@vechain/sdk-network';

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
 * This function is here and not coupled with the hook as we need it with SSR, and dapp-kit broke the pre-fetching
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
    const x2EarnAppsContract = getConfig(networkType).x2EarnAppsContractAddress;
    const contract = thor.contracts.load(x2EarnAppsContract, X2EarnApps.abi);
    const clauses: ContractClause[] = [
        contract.clause.apps(),
        contract.clause.unendorsedApps(),
    ];

    const res = await thor.contracts.executeMultipleClausesCall(clauses);

    const error = res.find((r) => !r.success);

    if (error) throw new Error('Error fetching xApps');

    let apps: XApp[] = [];
    let unendorsedApps: UnendorsedApp[] = [];

    if (res[0]?.result.array) {
        const appsDecoded = res[0].result.array;
        if (appsDecoded.length) {
            apps = appsDecoded.map((app: any) => ({
                id: app[0],
                teamWalletAddress: app[1],
                name: app[2],
                metadataURI: app[3],
                createdAtTimestamp: app[4].toString(),
            }));
        }
    }
    if (res[1]?.result.array) {
        const unendorsedAppsDecoded = res[1].result.array;
        if (unendorsedAppsDecoded.length) {
            unendorsedApps = unendorsedAppsDecoded.map((app: any) => ({
                id: app[0],
                teamWalletAddress: app[1],
                name: app[2],
                metadataURI: app[3],
                createdAtTimestamp: app[4].toString(),
                appAvailableForAllocationVoting: app[5],
            }));
        }
    }

    const allApps = [...apps, ...unendorsedApps].filter(
        (app, index, self) => self.findIndex((a) => a.id === app.id) === index,
    ); // all apps is a union of active and unendorsed apps with deduplication

    return {
        allApps: allApps,
        active: apps,
        unendorsed: unendorsedApps,
        endorsed: apps.filter(
            (app) =>
                !unendorsedApps.some(
                    (unendorsedApp) => unendorsedApp.id === app.id,
                ),
        ),
    };
};
