import { getConfig } from '@/config';
import { VeBetterPassport__factory } from '@/contracts/typechain-types';
import { getCallClauseQueryKey, useCallClause } from '@/hooks';
import { TogglePassportCheck } from '@/utils/constants';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';

const contractAbi = VeBetterPassport__factory.abi;
const method = 'isCheckEnabled' as const;

/**
 * Get the query key for the status of a passport check
 * @param networkType The network type
 * @param checkName - the enum value of the check (uint8)
 * @returns the query key
 */
export const getPassportCheckEnabledQueryKey = (
    networkType: NETWORK_TYPE,
    checkName: TogglePassportCheck,
) => {
    return getCallClauseQueryKey({
        address: getConfig(networkType).veBetterPassportContractAddress,
        abi: contractAbi,
        method,
        args: [checkName],
    });
};

/**
 * Hook to get the status of a passport check
 * @param checkNameInput - the enum value of the check (uint8)
 * @returns the status of the check as a boolean
 */
export const useIsPassportCheckEnabled = (
    checkNameInput?: TogglePassportCheck,
) => {
    const { network } = useVeChainKitConfig();
    const veBetterPassportContractAddress = getConfig(
        network.type,
    ).veBetterPassportContractAddress;

    // VeBetter Passport is passport check enabled result: [ false ]
    return useCallClause({
        address: veBetterPassportContractAddress,
        abi: contractAbi,
        method,
        args: [checkNameInput!],
        queryOptions: {
            enabled:
                checkNameInput !== undefined &&
                !!veBetterPassportContractAddress &&
                !!network.type,
            select: (res) => res[0],
        },
    });
};
