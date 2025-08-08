import { useQuery } from '@tanstack/react-query';
import { useConnex } from '@vechain/dapp-kit-react';
import { getConfig } from '@/config';
import { X2EarnApps__factory as X2EarnApps } from '@vechain/vechain-contract-types';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';

/**
 * Returns all apps that will be eligible in the next allocation round
 * @param thor  the thor client
 * @param networkType  the network type
 * @returns the ids of eligible apps
 */
export const getAppsEligibleInNextRound = async (
    thor: Connex.Thor,
    networkType: NETWORK_TYPE,
): Promise<string[]> => {
    const X2EARNAPPS_CONTRACT =
        getConfig(networkType).x2EarnAppsContractAddress;
    const functionFragment = X2EarnApps.createInterface()
        .getFunction('allEligibleApps')
        .format('json');
    const res = await thor
        .account(X2EARNAPPS_CONTRACT)
        .method(JSON.parse(functionFragment))
        .call();

    if (res.vmError) return Promise.reject(new Error(res.vmError));

    return res.decoded[0];
};

export const getAppsEligibleInNextRoundQueryKey = () => [
    'VECHAIN_KIT',
    'AppsEligibleInNextRound',
];

/**
 *  Hook to get all apps that will be eligible in the next allocation round
 * @returns the ids of eligible apps
 */
export const useAppsEligibleInNextRound = () => {
    const { thor } = useConnex();
    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: getAppsEligibleInNextRoundQueryKey(),
        queryFn: async () =>
            await getAppsEligibleInNextRound(thor, network.type),
        enabled: !!thor && !!network.type,
    });
};
