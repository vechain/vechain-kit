import { getCallKey, useCall } from '@/hooks';
import { getConfig } from '@/config';
import { X2EarnApps__factory } from '@/contracts';
import { UseQueryResult } from '@tanstack/react-query';
import { useVeChainKitConfig } from '@/providers';

const contractInterface = X2EarnApps__factory.createInterface();
const method = 'appExists';

/**
 * Get the query key for a boolean value indicating if the app exists
 * @param appId the app id
 */
export const getAppExistsQueryKey = (appId: string) =>
    getCallKey({ method, keyArgs: [appId] });

/**
 * Hook to get a boolean value indicating if the app exists
 * @param appId the app id
 * @returns a boolean value, true for apps that have been included in at least one allocation round
 */
export const useAppExists = (appId: string): UseQueryResult<boolean, Error> => {
    const { network } = useVeChainKitConfig();
    const contractAddress = getConfig(network.type).x2EarnAppsContractAddress;
    return useCall({
        contractInterface,
        contractAddress,
        method,
        args: [appId],
        enabled: !!appId && !!contractAddress,
    });
};
