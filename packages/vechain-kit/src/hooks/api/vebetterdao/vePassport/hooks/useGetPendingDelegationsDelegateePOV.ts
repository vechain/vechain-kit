import { getCallKey, useCall } from '@/hooks';
import { getConfig } from '@/config';
import { VeBetterPassport__factory } from '@/contracts/typechain-types';
import { useVeChainKitConfig } from '@/providers';

const vePassportInterface = VeBetterPassport__factory.createInterface();
const method = 'getPendingDelegations';

/**
 * Returns the query key for fetching pending delegations.
 * @param delegatee - The delegatee address.
 * @returns The query key for fetching pending delegations.
 */
export const getPendingDelegationsQueryKeyDelegateePOV = (
    delegatee: string,
) => {
    return getCallKey({ method, keyArgs: ['incoming', delegatee] });
};

/**
 * Hook to get pending delegations from the VeBetterPassport contract.
 * @param delegatee - The delegatee address.
 * @returns An array of addresses representing delegators with pending delegations for the delegatee.
 */
export const useGetPendingDelegationsDelegateePOV = (
    delegatee?: string | null,
) => {
    const { network } = useVeChainKitConfig();
    const veBetterPassportContractAddress = getConfig(
        network.type,
    ).veBetterPassportContractAddress;

    return useCall({
        contractInterface: vePassportInterface,
        contractAddress: veBetterPassportContractAddress,
        method,
        keyArgs: ['incoming', delegatee],
        args: [delegatee],
        mapResponse: (response) => response.decoded[0] ?? [],
        enabled: !!delegatee && !!veBetterPassportContractAddress,
    });
};
