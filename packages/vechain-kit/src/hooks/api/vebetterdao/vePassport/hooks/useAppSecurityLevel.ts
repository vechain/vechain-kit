import { getConfig } from '@/config';
import { VeBetterPassport__factory } from '@vechain/vechain-contract-types';
import { getCallKey, useCall } from '@/hooks';
import { useVeChainKitConfig } from '@/providers';

const contractInterface = VeBetterPassport__factory.createInterface();
const method = 'appSecurity';

export const APP_SECURITY_LEVELS = ['NONE', 'LOW', 'MEDIUM', 'HIGH'];

export const getAppSecurityLevelQueryKey = (appId: string) => {
    return getCallKey({ method, keyArgs: [appId] });
};

/**
 * Hook to get the security level of an app
 * @param appId - the app id
 * @returns the security level of the app as a number
 */
export const useAppSecurityLevel = (appId: string) => {
    const { network } = useVeChainKitConfig();
    const contractAddress = getConfig(
        network.type,
    ).veBetterPassportContractAddress;
    return useCall({
        contractInterface,
        contractAddress,
        method,
        args: [appId],
        enabled: !!appId && !!contractAddress,
    });
};
