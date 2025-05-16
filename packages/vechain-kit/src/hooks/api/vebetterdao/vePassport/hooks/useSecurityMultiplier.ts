import { getConfig } from '@/config';
import { VeBetterPassport__factory } from '@/contracts/typechain-types';
import { useVeChainKitConfig } from '@/providers';
import { useCallClause, getCallClauseQueryKey } from '@/hooks';
import { NETWORK_TYPE } from '@/config/network';

const contractAbi = VeBetterPassport__factory.abi;
const method = 'securityMultiplier' as const;

export enum SecurityLevel {
    NONE = 0,
    LOW = 1,
    MEDIUM = 2,
    HIGH = 3,
}

export const getSecurityMultiplierQueryKey = (
    networkType: NETWORK_TYPE,
    securityLevel: SecurityLevel,
) => {
    const veBetterPassportContractAddress =
        getConfig(networkType).veBetterPassportContractAddress;
    return getCallClauseQueryKey({
        address: veBetterPassportContractAddress,
        abi: contractAbi,
        method,
        args: [securityLevel],
    });
};

/**
 * Hook to get the security multiplier of an app
 * @param securityLevel - the security level of the app
 * @param customEnabled - Flag to enable or disable the hook. Default is true.
 * @returns the security multiplier of the app as a number
 */
export const useSecurityMultiplier = (
    securityLevel?: SecurityLevel,
    customEnabled = true,
) => {
    const { network } = useVeChainKitConfig();
    const veBetterPassportContractAddress = getConfig(
        network.type,
    ).veBetterPassportContractAddress;

    return useCallClause({
        abi: contractAbi,
        address: veBetterPassportContractAddress,
        method,
        args: [securityLevel ?? SecurityLevel.NONE], // Default to NONE if undefined
        queryOptions: {
            enabled:
                securityLevel !== undefined &&
                customEnabled &&
                !!veBetterPassportContractAddress &&
                !!network.type,
            // Assuming the multiplier is a direct number or small enough bigint
            select: (data: readonly [bigint]) => Number(data[0]),
        },
    });
};
