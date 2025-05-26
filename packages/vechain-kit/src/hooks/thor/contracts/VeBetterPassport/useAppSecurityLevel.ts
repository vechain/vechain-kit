import { getConfig } from '@/config';
import { NETWORK_TYPE } from '@/config/network';
import { VeBetterPassport__factory } from '@/contracts';
import { getCallClauseQueryKey, useCallClause } from '@/hooks';
import { useVeChainKitConfig } from '@/providers';

const contractAbi = VeBetterPassport__factory.abi;
const method = 'appSecurity' as const;

// TODO: migration check if necessary, otherwise remove
export const APP_SECURITY_LEVELS = ['NONE', 'LOW', 'MEDIUM', 'HIGH'];

export const getAppSecurityLevelQueryKey = (
    networkType: NETWORK_TYPE,
    appId: string,
) => {
    const contractAddress =
        getConfig(networkType).veBetterPassportContractAddress;
    return getCallClauseQueryKey<typeof contractAbi>({
        address: contractAddress,
        method,
        args: [appId as `0x${string}`],
    });
};

/**
 * Hook to get the security level of an app
 * @param appId - the app id (Address)
 * @param customEnabled - Flag to enable or disable the hook. Default is true.
 * @returns the security level of the app as a number corresponding to APP_SECURITY_LEVELS index
 */
export const useAppSecurityLevel = (appId?: string, customEnabled = true) => {
    const { network } = useVeChainKitConfig();
    const contractAddress = getConfig(
        network.type,
    ).veBetterPassportContractAddress;

    // VeBetter Passport app security level result: [ 0 ]
    return useCallClause({
        abi: contractAbi,
        address: contractAddress,
        method,
        args: [appId as `0x${string}`],
        queryOptions: {
            enabled:
                !!appId && customEnabled && !!contractAddress && !!network.type,
            select: (data) => data[0],
        },
    });
};
