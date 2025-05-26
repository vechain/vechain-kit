import { getCallClauseQueryKey, useCallClause } from '@/hooks';
import { getConfig } from '@/config';
import { VeBetterPassport__factory } from '@/contracts/typechain-types';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';

const contractAbi = VeBetterPassport__factory.abi;
const method = 'getPendingLinkings' as const;

export type PendingLinkings = {
    incoming: string[];
    outgoing: string | null;
};

/**
 * Returns the query key for fetching pending linkings for a user.
 * @param networkType The network type.
 * @param user - The user address.
 * @returns The query key.
 */
export const getPendingLinkingsQueryKey = (
    networkType: NETWORK_TYPE,
    user: string,
) => {
    return getCallClauseQueryKey<typeof contractAbi>({
        address: getConfig(networkType).veBetterPassportContractAddress,
        method,
        args: [user as `0x${string}`],
    });
};

/**
 * Hook to get pending linkings from the VeBetterPassport contract.
 * @param userInput - The user address.
 * @returns An object containing incoming and outgoing pending linkings for the user.
 */
export const useGetPendingLinkings = (userInput?: string | null) => {
    const { network } = useVeChainKitConfig();
    const veBetterPassportContractAddress = getConfig(
        network.type,
    ).veBetterPassportContractAddress;

    // VeBetter Passport get pending linkings result: [ [], '0x0000000000000000000000000000000000000000' ]
    return useCallClause({
        address: veBetterPassportContractAddress,
        abi: contractAbi,
        method,
        args: [userInput as `0x${string}`],
        queryOptions: {
            enabled:
                !!userInput &&
                !!veBetterPassportContractAddress &&
                !!network.type,
            select: (response) => ({
                incoming: response[0] ?? [],
                outgoing: response[1] ?? null,
            }),
        },
    });
};

/**
 * Hook to get pending linkings from the VeBetterPassport contract for the current user.
 * @param address - The address of the account.
 * @returns An object containing incoming and outgoing pending linkings for the current user.
 */
export const useGetUserPendingLinkings = (address?: string) => {
    return useGetPendingLinkings(address);
};
