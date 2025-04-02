import { getConfig } from '@/config';
import { VeBetterPassport__factory } from '@/contracts';
import { getCallKey, useCall } from '@/hooks';
import { useVeChainKitConfig } from '@/providers';
import { Interface } from 'ethers';

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

    const contractInterface =
        VeBetterPassport__factory.createInterface() as Interface & {
            abi: readonly any[];
        };
    contractInterface.abi = VeBetterPassport__factory.abi;

    return useCall({
        contractInterface,
        contractAddress,
        method,
        args: [appId],
        enabled: !!appId && !!contractAddress,
    });
};
