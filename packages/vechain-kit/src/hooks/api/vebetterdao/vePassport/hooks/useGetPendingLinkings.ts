import { getCallKey, useCall } from '@/hooks';
import { getConfig } from '@/config';
import { VeBetterPassport__factory } from '@vechain/vechain-contract-types';
import { useVeChainKitConfig } from '@/providers';

const vePassportInterface = VeBetterPassport__factory.createInterface();
const method = 'getPendingLinkings';

/**
 * Returns the query key for fetching pending linkings.
 * @param user - The user address.
 * @returns The query key for fetching pending linkings.
 */
export const getPendingLinkingsQueryKey = (user?: string | null) => {
    return getCallKey({ method, keyArgs: [user] });
};

/**
 * Hook to get pending linkings from the VeBetterPassport contract.
 * @param user - The user address.
 * @returns An object containing incoming and outgoing pending linkings for the user.
 */
export const useGetPendingLinkings = (user?: string | null) => {
    const { network } = useVeChainKitConfig();
    const veBetterPassportContractAddress = getConfig(
        network.type,
    ).veBetterPassportContractAddress;

    return useCall({
        contractInterface: vePassportInterface,
        contractAddress: veBetterPassportContractAddress,
        method,
        args: [user],
        mapResponse: (response) => ({
            incoming: response.decoded[0] ?? [],
            outgoing: response.decoded[1] ?? null,
        }),
        enabled: !!user && !!veBetterPassportContractAddress,
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
