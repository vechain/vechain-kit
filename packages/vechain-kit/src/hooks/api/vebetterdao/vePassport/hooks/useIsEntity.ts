import { getCallKey, useCall } from '@/hooks';
import { getConfig } from '@/config';
import { VeBetterPassport__factory } from '@/contracts/typechain-types';
import { useVeChainKitConfig } from '@/providers';
import { Interface } from 'ethers';

const contractInterface =
    VeBetterPassport__factory.createInterface() as Interface & {
        abi: readonly any[];
    };
contractInterface.abi = VeBetterPassport__factory.abi;
const method = 'isEntity';

/**
 * Returns the query key for checking if an address is an entity.
 * @param address - The address to check.
 * @returns The query key for checking if an address is an entity.
 */
export const getIsEntityQueryKey = (address?: string | null) => {
    return getCallKey({ method, keyArgs: [address] });
};

/**
 * Hook to check if an address is an entity using the VeBetterPassport contract.
 * @param address - The address to check.
 * @returns A boolean indicating whether the address is an entity.
 */
export const useIsEntity = (address?: string | null) => {
    const { network } = useVeChainKitConfig();
    const veBetterPassportContractAddress = getConfig(
        network.type,
    ).veBetterPassportContractAddress;

    return useCall({
        contractInterface: contractInterface,
        contractAddress: veBetterPassportContractAddress,
        method,
        args: [address],
        enabled: !!address && !!veBetterPassportContractAddress,
    });
};

/**
 * Hook to check if the current user's address is an entity using the VeBetterPassport contract.
 * @param address - The address of the account.
 * @returns A boolean indicating whether the current user's address is an entity.
 */
export const useIsUserEntity = (address?: string) => {
    return useIsEntity(address);
};
