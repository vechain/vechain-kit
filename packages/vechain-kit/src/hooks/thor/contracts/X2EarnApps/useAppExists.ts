import { getCallClauseQueryKey, useCallClause } from '@/hooks';
import { getConfig } from '@/config';
import { X2EarnApps__factory } from '@/contracts';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';

const contractAbi = X2EarnApps__factory.abi;
const method = 'appExists' as const;

/**
 * Get the query key for a boolean value indicating if the app exists
 * @param networkType the network type
 * @param appId the app id
 */
export const getAppExistsQueryKey = (
    networkType: NETWORK_TYPE,
    appId: string,
) =>
    getCallClauseQueryKey<typeof contractAbi>({
        address: getConfig(networkType).x2EarnAppsContractAddress,
        method,
        args: [appId as `0x${string}`],
    });

/**
 * Hook to get a boolean value indicating if the app exists
 * @param appId the app id
 * @returns a boolean value, true for apps that have been included in at least one allocation round
 */
export const useAppExists = (appIdInput: string) => {
    const { network } = useVeChainKitConfig();
    const contractAddress = getConfig(network.type).x2EarnAppsContractAddress;

    // X2Earn Apps app exists result: [ false ]
    return useCallClause({
        address: contractAddress,
        abi: contractAbi,
        method,
        args: [appIdInput as `0x${string}`],
        queryOptions: {
            enabled: !!appIdInput && !!contractAddress && !!network.type,
            select: (res) => res[0],
        },
    });
};
