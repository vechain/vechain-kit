import { useQuery } from '@tanstack/react-query';
import { useThor } from '@vechain/dapp-kit-react';
import { getConfig } from '@/config';
import { X2EarnApps__factory as X2EarnApps } from '@/contracts';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';
import { type ThorClient } from '@vechain/sdk-network';

/**
 * Returns all apps that will be eligible in the next allocation round
 * @param thor  the thor client
 * @param networkType  the network type
 * @returns the ids of eligible apps
 */
export const getAppsEligibleInNextRound = async (
    thor: ThorClient,
    networkType: NETWORK_TYPE,
): Promise<string[]> => {
    const X2EARNAPPS_CONTRACT =
        getConfig(networkType).x2EarnAppsContractAddress;
    const res = await thor.contracts
        .load(X2EARNAPPS_CONTRACT, X2EarnApps.abi)
        .read.allEligibleApps();

    if (!res) return Promise.reject(new Error('Apps not found'));

    return res.map((app: any) => app[0].toString());
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
    const thor = useThor();
    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: getAppsEligibleInNextRoundQueryKey(),
        queryFn: async () =>
            await getAppsEligibleInNextRound(thor, network.type),
        enabled: !!thor && !!network.type,
    });
};
