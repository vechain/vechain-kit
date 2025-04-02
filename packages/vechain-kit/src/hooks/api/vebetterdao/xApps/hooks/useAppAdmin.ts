import { useQuery } from '@tanstack/react-query';
import { useThor } from '@vechain/dapp-kit-react';
import { getConfig } from '@/config';
import { X2EarnApps__factory as X2EarnApps } from '@/contracts';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';
import { type ThorClient } from '@vechain/sdk-network';
/**
 *  Get the admin of the app
 * @param thor  the thor connection
 * @param appId  the id of the app
 * @param networkType  the network type
 * @returns  the admin of the app
 */
export const getAppAdmin = async (
    thor: ThorClient,
    appId: string,
    networkType: NETWORK_TYPE,
): Promise<string> => {
    const X2EARNAPPS_CONTRACT =
        getConfig(networkType).x2EarnAppsContractAddress;
    const res = await thor.contracts
        .load(X2EARNAPPS_CONTRACT, X2EarnApps.abi)
        .read.appAdmin(appId);

    if (!res) return Promise.reject(new Error('App not found'));

    return res[0].toString();
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
    const thor = useThor();
    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: getAppAdminQueryKey(appId),
        queryFn: async () => await getAppAdmin(thor, appId, network.type),
        enabled: !!thor && !!network.type,
    });
};
