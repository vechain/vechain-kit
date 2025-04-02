import { getConfig } from '@/config';
import { X2EarnApps__factory as X2EarnApps } from '@/contracts';
import { XApp } from './getXApps';
import { NETWORK_TYPE } from '@/config/network';
import { type ThorClient } from '@vechain/sdk-network';

/**
 * Returns all xApps with their metadata base URI
 * @param thor the thor client
 * @param networkType the network type
 * @returns array of XApps with their metadata URIs
 */
export const getXAppsMetadataBaseUri = async (
    thor: ThorClient,
    networkType: NETWORK_TYPE,
): Promise<XApp[]> => {
    const X2EARNAPPS_CONTRACT =
        getConfig(networkType).x2EarnAppsContractAddress;
    const contract = thor.contracts.load(X2EARNAPPS_CONTRACT, X2EarnApps.abi);

    // Get both the base URI and apps in parallel
    const [baseUriRes, appsRes] = await Promise.all([
        contract.read.baseURI(),
        contract.read.apps(),
    ]);

    if (!baseUriRes || !appsRes)
        return Promise.reject(new Error('Failed to fetch data'));

    // Map the apps to include the base URI in their metadata
    return appsRes.map((app: any) => ({
        id: app[0],
        teamWalletAddress: app[1],
        name: app[2],
        metadataURI: `${baseUriRes}${app[3]}`, // Combine base URI with app's metadata URI
        createdAtTimestamp: app[4].toString(),
    }));
};
