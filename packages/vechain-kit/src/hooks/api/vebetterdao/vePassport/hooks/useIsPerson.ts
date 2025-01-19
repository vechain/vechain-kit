import { getCallKey, useCall } from '@/hooks';
import { getConfig } from '@/config';
import { VeBetterPassport__factory } from '@/contracts/typechain-types';
import { useWallet } from '@/hooks';
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
 * @returns The isPerson status.
 */
export const useIsUserPerson = () => {
    const { account } = useWallet();
    return useIsPerson(account.address);
};
