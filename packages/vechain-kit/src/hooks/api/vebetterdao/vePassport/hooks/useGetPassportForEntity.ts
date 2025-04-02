import { getCallKey, useCall } from '@/hooks';
import { getConfig } from '@/config';
import { VeBetterPassport__factory } from '@/contracts/typechain-types';
import { useVeChainKitConfig } from '@/providers';
import { Interface } from 'ethers';

const method = 'getPassportForEntity';

/**
 * Returns the query key for fetching the passport for an entity.
 * @param entity - The entity address.
 * @returns The query key for fetching the passport for an entity.
 */
export const getPassportForEntityQueryKey = (entity?: string | null) => {
    return getCallKey({ method, keyArgs: [entity] });
};

/**
 * Hook to get the passport for an entity from the VeBetterPassport contract.
 * @param entity - The entity address.
 * @returns The passport address for the given entity.
 */
export const useGetPassportForEntity = (entity?: string | null) => {
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
        keyArgs: [entity],
        args: [entity],
        enabled: !!entity && !!veBetterPassportContractAddress,
    });
};

/**
 * Hook to get the passport for the current user's entity from the VeBetterPassport contract.
 * @param address - The address of the entity.
 * @returns The passport address for the current user's entity.
 */
export const useGetUserPassportForEntity = (address?: string) => {
    return useGetPassportForEntity(address ?? '');
};
