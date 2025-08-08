import { getCallKey, useCall } from '@/hooks';
import { getConfig } from '@/config';
import { VeBetterPassport__factory } from '@vechain/vechain-contract-types';
import { compareAddresses } from '@/utils/AddressUtils';
import { zeroAddress } from 'viem';
import { useVeChainKitConfig } from '@/providers';

const vePassportInterface = VeBetterPassport__factory.createInterface();

/**
 * Returns the query key for fetching the delegator.
 * @param delegator - The delegator address.
 * @returns The query key for fetching the delegator.
 */
export const getDelegatorQueryKey = (delegator: string) => {
    return getCallKey({ method: 'getDelegator', keyArgs: [delegator] });
};

/**
 * Hook to get the delegator from the VeBetterPassport contract.
 * @param delegator - The delegator address.
 * @returns The address of the delegator for the given delegator address, or null if the delegator has no delegator.
 */
export const useGetDelegator = (delegator?: string | null) => {
    const { network } = useVeChainKitConfig();
    const veBetterPassportContractAddress = getConfig(
        network.type,
    ).veBetterPassportContractAddress;
    return useCall({
        contractInterface: vePassportInterface,
        contractAddress: veBetterPassportContractAddress,
        method: 'getDelegator',
        args: [delegator],
        mapResponse: (response) => {
            const delegator = response.decoded[0];
            if (compareAddresses(delegator, zeroAddress)) return null;
            return delegator;
        },
        enabled: !!delegator,
    });
};
