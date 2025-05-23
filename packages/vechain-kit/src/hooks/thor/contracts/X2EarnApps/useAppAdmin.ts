import { getConfig } from '@/config';
import { X2EarnApps__factory as X2EarnApps } from '@/contracts';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';
import { getCallClauseQueryKey, useCallClause } from '@/hooks';

export const getAppAdminQueryKey = (appId: string, networkType: NETWORK_TYPE) =>
    getCallClauseQueryKey({
        address: getConfig(networkType).x2EarnAppsContractAddress,
        abi: X2EarnApps.abi,
        method: 'appAdmin',
        args: [appId as `0x${string}`],
    });

/**
 *  Get the admin of the app
 * @param appId  the id of the app
 * @returns the admin of the app
 */
export const useAppAdmin = (appId: string) => {
    const { network } = useVeChainKitConfig();

    // X2Earn Apps app admin result: [ '0xeFc7B2bd05DF22561D927D8Aa61c252BCF1b5dFA' ]
    return useCallClause({
        address: getConfig(network.type).x2EarnAppsContractAddress,
        abi: X2EarnApps.abi,
        method: 'appAdmin',
        args: [appId as `0x${string}`],
        queryOptions: {
            select: (data) => data[0],
            enabled: !!appId && !!network.type,
        },
    });
};
