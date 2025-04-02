import { getCallKey, useCall } from '@/hooks';
import { getConfig } from '@/config';
import { VeBetterPassport__factory } from '@/contracts/typechain-types';
import { useVeChainKitConfig } from '@/providers';
import { Interface } from 'ethers';

// const method = "getPendingDelegationsDelegatorPOV"
const method = 'getPendingDelegations';

/**
 * Returns the query key for fetching pending delegations.
 * @param delegator - The delegator address.
 * @returns The query key for fetching pending delegations.
 */
export const getPendingDelegationsQueryKeyDelegatorPOV = (
    delegator: string,
) => {
    return getCallKey({ method, keyArgs: ['outgoing', delegator] });
};

/**
 * Hook to get pending delegations from the VeBetterPassport contract.
 * @param delegator - The delegator address.
 * @returns An array of addresses representing delegators with pending delegations for the delegator.
 */
export const useGetPendingDelegationsDelegatorPOV = (
    delegator?: string | null,
) => {
    const { network } = useVeChainKitConfig();
    const veBetterPassportContractAddress = getConfig(
        network.type,
    ).veBetterPassportContractAddress;

    const contractInterface =
        VeBetterPassport__factory.createInterface() as Interface & {
            abi: readonly any[];
        };
    contractInterface.abi = VeBetterPassport__factory.abi;

    // TODO: remove mocked data
    return useCall({
        contractInterface,
        contractAddress: veBetterPassportContractAddress,
        method,
        keyArgs: ['outgoing', delegator],
        args: [delegator],
        mapResponse: (response) => response.decoded[1] ?? null,
        enabled: !!delegator && !!veBetterPassportContractAddress,
    });
};
