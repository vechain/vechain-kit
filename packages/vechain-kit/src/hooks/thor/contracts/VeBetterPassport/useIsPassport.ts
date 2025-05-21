import { getCallClauseQueryKey, useCallClause } from '@/hooks';
import { getConfig } from '@/config';
import { VeBetterPassport__factory } from '@/contracts/typechain-types';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';

const contractAbi = VeBetterPassport__factory.abi;
const method = 'isPassport' as const;

/**
 * Returns the query key for checking if an address is a passport.
 * @param networkType The network type.
 * @param userAddress - The address to check.
 * @returns The query key for checking if an address is a passport.
 */
export const getIsPassportQueryKey = (
    networkType: NETWORK_TYPE,
    userAddress?: string | null,
) => {
    return getCallClauseQueryKey({
        address: getConfig(networkType).veBetterPassportContractAddress,
        abi: contractAbi,
        method,
        args: [userAddress as `0x${string}`],
    });
};

/**
 * Hook to check if an address is a passport using the VeBetterPassport contract.
 * @param userAddress - The address to check.
 * @returns A boolean indicating whether the address is a passport.
 */
export const useIsPassport = (address?: string | null) => {
    const { network } = useVeChainKitConfig();
    const veBetterPassportContractAddress = getConfig(
        network.type,
    ).veBetterPassportContractAddress;

    return useCallClause({
        address: veBetterPassportContractAddress,
        abi: contractAbi,
        method,
        args: [address as `0x${string}`],
        queryOptions: {
            enabled:
                !!address &&
                !!veBetterPassportContractAddress &&
                !!network.type,
            select: (data) => data[0],
        },
    });
};

/**
 * Hook to check if the current user's address is a passport using the VeBetterPassport contract.
 * @param address - The address of the account.
 * @returns A boolean indicating whether the current user's address is a passport.
 */
export const useIsUserPassport = (address?: string) => {
    return useIsPassport(address);
};
