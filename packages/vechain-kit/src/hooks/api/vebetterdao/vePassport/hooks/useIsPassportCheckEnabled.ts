import { getConfig } from '@/config';
import { VeBetterPassport__factory } from '@/contracts/typechain-types';
import { getCallKey, useCall } from '@/hooks';
import { TogglePassportCheck } from '@/utils/Constants';
import { useVeChainKitConfig } from '@/providers';
import { Interface } from 'ethers';

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

    const contractInterface =
        VeBetterPassport__factory.createInterface() as Interface & {
            abi: readonly any[];
        };
    contractInterface.abi = VeBetterPassport__factory.abi;

    return useCall({
        contractInterface,
        contractAddress: veBetterPassportContractAddress,
        method: method,
        args: [checkName],
        enabled: !!veBetterPassportContractAddress,
    });
};
