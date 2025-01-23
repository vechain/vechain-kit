import { getCallKey, useCall } from '@/hooks';
import { getConfig } from '@/config';
import { VeBetterPassport__factory } from '@/contracts/typechain-types';
import { zeroAddress } from 'viem';
import { useVeChainKitConfig } from '@/providers';

const vePassportInterface = VeBetterPassport__factory.createInterface();

/**
 * Returns the query key for fetching the delegatee.
 * @param delegator - The delegator address.
 * @returns The query key for fetching the delegatee.
 */
export const getDelegateeQueryKey = (delegator: string) => {
    return getCallKey({ method: 'getDelegatee', keyArgs: [delegator] });
};

/**
 * Hook to get the delegatee from the VeBetterPassport contract.
 * @param delegator - The delegator address.
 * @returns The address of the delegatee for the given delegator, or null if the delegator has no delegatee.
 */
export const useGetDelegatee = (delegator?: string | null) => {
    const { network } = useVeChainKitConfig();
    const veBetterPassportContractAddress = getConfig(
        network.type,
    ).veBetterPassportContractAddress;
    return useCall({
        contractInterface: vePassportInterface,
        contractAddress: veBetterPassportContractAddress,
        method: 'getDelegatee',
        args: [delegator],
        enabled: !!delegator && !!veBetterPassportContractAddress,
        mapResponse: (response) => {
            const delegatee = response.decoded[0];
            if (delegatee === zeroAddress) return null;
            return delegatee;
        },
    });
};
