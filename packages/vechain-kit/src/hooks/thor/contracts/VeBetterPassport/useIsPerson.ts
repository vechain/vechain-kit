import { getConfig } from '@/config';
import { VeBetterPassport__factory } from '@/contracts/typechain-types';
import { useVeChainKitConfig } from '@/providers';
import { useCallClause, getCallClauseQueryKey } from '@/hooks';
import { NETWORK_TYPE } from '@/config/network';
import { ZERO_ADDRESS } from '@vechain/sdk-core';

const contractAbi = VeBetterPassport__factory.abi;
const method = 'isPerson' as const;

/**
 * Returns the query key for fetching the isPerson status.
 * @param networkType - The network type.
 * @param user - The user address.
 * @returns The query key for fetching the isPerson status.
 */
export const getIsPersonQueryKey = (
    networkType: NETWORK_TYPE,
    user: string,
) => {
    const veBetterPassportContractAddress =
        getConfig(networkType).veBetterPassportContractAddress;
    return getCallClauseQueryKey({
        address: veBetterPassportContractAddress,
        abi: contractAbi,
        method,
        args: [user],
    });
};

/**
 * Hook to get the isPerson status from the VeBetterPassport contract.
 * @param user - The user address.
 * @param customEnabled - Flag to enable or disable the hook. Default is true.
 * @returns The isPerson status (boolean).
 */
export const useIsPerson = (user?: string, customEnabled = true) => {
    const { network } = useVeChainKitConfig();
    const veBetterPassportContractAddress = getConfig(
        network.type,
    ).veBetterPassportContractAddress;

    // VeBetter Passport is person result: [ false, 'User has been signaled too many times' ]
    return useCallClause({
        abi: contractAbi,
        address: veBetterPassportContractAddress,
        method,
        args: [user ?? ZERO_ADDRESS],
        queryOptions: {
            enabled:
                !!user &&
                customEnabled &&
                !!veBetterPassportContractAddress &&
                !!network.type,
            select: (data) => data[0],
        },
    });
};

/**
 * Hook to get the isPerson status from the VeBetterPassport contract for the current user.
 * @param address - The address of the account.
 * @returns The isPerson status.
 */
export const useIsUserPerson = (address?: string) => {
    return useIsPerson(address);
};
