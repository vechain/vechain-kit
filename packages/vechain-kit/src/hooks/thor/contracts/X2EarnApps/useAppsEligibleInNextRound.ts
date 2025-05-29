import { getConfig } from '@/config';
import { X2EarnApps__factory as X2EarnApps } from '@/contracts';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';
import { getCallClauseQueryKey, useCallClause } from '@/hooks';

const abi = X2EarnApps.abi;
const method = 'allEligibleApps' as const;

export const getAppsEligibleInNextRoundQueryKey = (network: NETWORK_TYPE) =>
    getCallClauseQueryKey<typeof abi>({
        method,
        address: getConfig(network).x2EarnAppsContractAddress,
        args: [],
    });

/**
 *  Hook to get all apps that will be eligible in the next allocation round
 * @returns the ids of eligible apps
 */
export const useAppsEligibleInNextRound = () => {
    const { network } = useVeChainKitConfig();

    // X2Earn Apps eligible in next round result: [[0x,0x,0x]]
    return useCallClause({
        abi,
        address: getConfig(network.type).x2EarnAppsContractAddress,
        method,
        args: [],
        queryOptions: {
            select: (data) => data[0],
            enabled: !!network.type,
        },
    });
};
