import { getConfig } from '@/config';
import { NETWORK_TYPE } from '@/config/network';
import { VeBetterPassport__factory } from '@/contracts';
import { getCallClauseQueryKey, useCallClause } from '@/hooks';
import { useVeChainKitConfig } from '@/providers';
import { Address } from 'viem';
import { ZERO_ADDRESS } from '@vechain/sdk-core1.2'; // For placeholder if needed

const contractAbi = VeBetterPassport__factory.abi; // Changed from abi to contractAbi for consistency
const method = 'appSecurity' as const;

// TODO: migration check if necessary, otherwise remove
export const APP_SECURITY_LEVELS = ['NONE', 'LOW', 'MEDIUM', 'HIGH'];

export const getAppSecurityLevelQueryKey = (
    networkType: NETWORK_TYPE,
    appId: Address,
) => {
    const contractAddress =
        getConfig(networkType).veBetterPassportContractAddress;
    return getCallClauseQueryKey({
        address: contractAddress,
        abi: contractAbi,
        method,
        args: [appId],
    });
};

/**
 * Hook to get the security level of an app
 * @param appId - the app id (Address)
 * @param customEnabled - Flag to enable or disable the hook. Default is true.
 * @returns the security level of the app as a number corresponding to APP_SECURITY_LEVELS index
 */
export const useAppSecurityLevel = (appId?: Address, customEnabled = true) => {
    const { network } = useVeChainKitConfig();
    const contractAddress = getConfig(
        network.type,
    ).veBetterPassportContractAddress;

    return useCallClause({
        abi: contractAbi,
        address: contractAddress,
        method,
        args: [appId ?? ZERO_ADDRESS], // Use placeholder if appId is undefined
        queryOptions: {
            enabled:
                !!appId && customEnabled && !!contractAddress && !!network.type,
            // Assuming appSecurity returns a uint8 or similar, decoded as a number by ethers
            select: (data: readonly [number]) => data[0],
        },
    });
};
