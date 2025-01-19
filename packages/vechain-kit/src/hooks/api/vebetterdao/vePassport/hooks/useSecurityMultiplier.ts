import { getConfig } from '@/config';
import { VeBetterPassport__factory } from '@/contracts/typechain-types';
import { getCallKey, useCall } from '@/hooks';
import { useVeChainKitConfig } from '@/providers';

const contractInterface = VeBetterPassport__factory.createInterface();
const method = 'securityMultiplier';

export enum SecurityLevel {
    NONE = 0,
    LOW = 1,
    MEDIUM = 2,
    HIGH = 3,
}

export const getSecurityMultiplierQueryKey = (securityLevel: SecurityLevel) => {
    return getCallKey({ method, keyArgs: [securityLevel] });
};

/**
 * Hook to get the security multiplier of an app
 * @param securityLevel - the security level of the app
 * @returns the security multiplier of the app as a number
 */
export const useSecurityMultiplier = (securityLevel: SecurityLevel) => {
    const { network } = useVeChainKitConfig();
    const veBetterPassportContractAddress = getConfig(
        network.type,
    ).veBetterPassportContractAddress;

    return useCall({
        contractInterface,
        contractAddress: veBetterPassportContractAddress,
        method,
        args: [securityLevel],
        enabled: !!securityLevel && !!veBetterPassportContractAddress,
    });
};
