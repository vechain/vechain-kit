import { useQuery } from '@tanstack/react-query';
import { useConnex } from '@vechain/dapp-kit-react';
import { getConfig } from '@/config';
import { X2EarnApps__factory as X2EarnApps } from '@/contracts';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';

/**
 *  Get the admin of the app
 * @param thor  the thor connection
 * @param appId  the id of the app
 * @param networkType  the network type
 * @returns  the admin of the app
 */
export const getAppAdmin = async (
    thor: Connex.Thor,
    appId: string,
    networkType: NETWORK_TYPE,
): Promise<string> => {
    const X2EARNAPPS_CONTRACT =
        getConfig(networkType).x2EarnAppsContractAddress;
    const functionFragment = X2EarnApps.createInterface()
        .getFunction('appAdmin')
        .format('json');
    const res = await thor
        .account(X2EARNAPPS_CONTRACT)
        .method(JSON.parse(functionFragment))
        .call(appId);

    if (res.vmError) return Promise.reject(new Error(res.vmError));

    return res.decoded[0];
};

export const getAppAdminQueryKey = (appId: string) => [
    'VECHAIN_KIT',
    'xApps',
    appId,
    'admin',
];

/**
 *  Get the admin of the app
 * @param appId  the id of the app
 * @returns the admin of the app
 */
export const useAppAdmin = (appId: string) => {
    const { thor } = useConnex();
    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: getAppAdminQueryKey(appId),
        queryFn: async () => await getAppAdmin(thor, appId, network.type),
        enabled: !!thor && !!network.type,
    });
};
