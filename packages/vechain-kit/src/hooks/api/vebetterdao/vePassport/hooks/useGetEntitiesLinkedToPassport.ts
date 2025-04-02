import { getCallKey, useCall } from '@/hooks';
import { getConfig } from '@/config';
import { VeBetterPassport__factory } from '@/contracts/typechain-types';
import { useVeChainKitConfig } from '@/providers';
import { Interface } from 'ethers';

const method = 'getEntitiesLinkedToPassport';

/**
 * Returns the query key for fetching entities linked to a passport.
 * @param passport - The passport address.
 * @returns The query key for fetching entities linked to a passport.
 */
export const getEntitiesLinkedToPassportQueryKey = (
    passport?: string | null,
) => {
    return getCallKey({ method, keyArgs: [passport] });
};

/**
 * Hook to get the entities linked to a passport from the VeBetterPassport contract.
 * @param passport - The passport address.
 * @returns An array of entity addresses linked to the given passport.
 */
export const useGetEntitiesLinkedToPassport = (passport?: string | null) => {
    const { network } = useVeChainKitConfig();
    const veBetterPassportContractAddress = getConfig(
        network.type,
    ).veBetterPassportContractAddress;

    const contractInterface =
        VeBetterPassport__factory.createInterface() as Interface & {
            abi: readonly any[];
        };
    contractInterface.abi = VeBetterPassport__factory.abi;

    return useCall({
        contractInterface,
        contractAddress: veBetterPassportContractAddress,
        method,
        args: [passport],
        enabled: !!passport && !!veBetterPassportContractAddress,
    });
};

/**
 * Hook to get the entities linked to the current user's passport from the VeBetterPassport contract.
 * @param address - The address of the entity.
 * @returns An array of entity addresses linked to the current user's passport.
 */
export const useGetUserEntitiesLinkedToPassport = (address?: string) => {
    return useGetEntitiesLinkedToPassport(address ?? '');
};
