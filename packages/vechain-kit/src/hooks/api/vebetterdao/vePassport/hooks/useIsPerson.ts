import { getCallKey, useCall } from '@/hooks';
import { getConfig } from '@/config';
import { VeBetterPassport__factory } from '@vechain/vechain-contract-types';
import { useVeChainKitConfig } from '@/providers';

const vePassportInterface = VeBetterPassport__factory.createInterface();

/**
 * Returns the query key for fetching the isPerson status.
 * @param user - The user address.
 * @returns The query key for fetching the isPerson status.
 */
export const getIsPersonQueryKey = (user: string) => {
    return getCallKey({ method: 'isPerson', keyArgs: [user] });
};

/**
 * Hook to get the isPerson status from the VeBetterPassport contract.
 * @param user - The user address.
 * @returns The isPerson status.
 */
export const useIsPerson = (user?: string | null) => {
    const { network } = useVeChainKitConfig();
    const veBetterPassportContractAddress = getConfig(
        network.type,
    ).veBetterPassportContractAddress;

    return useCall({
        contractInterface: vePassportInterface,
        contractAddress: veBetterPassportContractAddress,
        method: 'isPerson',
        args: [user],
        enabled: !!user && !!veBetterPassportContractAddress,
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
