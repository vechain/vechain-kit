import { getConfig } from '@/config';
import { X2EarnApps__factory as X2EarnApps } from '@vechain/vechain-contract-types';
import { XApp } from './getXApps';
import { NETWORK_TYPE } from '@/config/network';

/**
 *  Returns the baseUri of the xApps metadata
 * @param thor  the thor client
 * @param networkType  the network type
 * @returns  the baseUri of the xApps metadata
 */
export const getXAppsMetadataBaseUri = async (
    thor: Connex.Thor,
    networkType: NETWORK_TYPE,
): Promise<XApp[]> => {
    const X2EARNAPPS_CONTRACT =
        getConfig(networkType).x2EarnAppsContractAddress;
    const functionFragment = X2EarnApps.createInterface()
        .getFunction('baseURI')
        .format('json');
    const res = await thor
        .account(X2EARNAPPS_CONTRACT)
        .method(JSON.parse(functionFragment))
        .call();

    if (res.vmError) return Promise.reject(new Error(res.vmError));

    return res.decoded[0];
};
