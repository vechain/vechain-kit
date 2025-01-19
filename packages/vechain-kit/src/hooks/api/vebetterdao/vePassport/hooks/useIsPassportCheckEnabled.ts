import { getConfig } from '@/config';
import { VeBetterPassport__factory } from '@/contracts/typechain-types';
import { getCallKey, useCall } from '@/hooks';
import { TogglePassportCheck } from '@/utils/Constants';
import { useVeChainKitConfig } from '@/providers';

const contractInterface = VeBetterPassport__factory.createInterface();
const method = 'isCheckEnabled';

export const getPassportToggleQueryKey = (checkName: TogglePassportCheck) => {
    return getCallKey({ method: method, keyArgs: [checkName] });
};
/**
 * Hook to get the status of a passport check
 * @param checkName - the function name of the check
 * @returns the status of the check as a boolean
 */
export const useIsPassportCheckEnabled = (checkName: TogglePassportCheck) => {
    const { network } = useVeChainKitConfig();
    const veBetterPassportContractAddress = getConfig(
        network.type,
    ).veBetterPassportContractAddress;

    return useCall({
        contractInterface,
        contractAddress: veBetterPassportContractAddress,
        method: method,
        args: [checkName],
        enabled: !!veBetterPassportContractAddress,
    });
};
