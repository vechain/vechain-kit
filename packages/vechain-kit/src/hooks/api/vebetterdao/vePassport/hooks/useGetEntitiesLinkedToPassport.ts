import { getCallClauseQueryKey, useCallClause } from '@/hooks';
import { getConfig } from '@/config';
import { VeBetterPassport__factory } from '@/contracts/typechain-types';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';

const contractAbi = VeBetterPassport__factory.abi;
const method = 'getEntitiesLinkedToPassport' as const;

/**
 * Returns the query key for fetching entities linked to a passport.
 * @param networkType The network type.
 * @param passport - The passport address.
 * @returns The query key for fetching entities linked to a passport.
 */
export const getEntitiesLinkedToPassportQueryKey = (
    networkType: NETWORK_TYPE,
    passport: string,
) => {
    return getCallClauseQueryKey({
        address: getConfig(networkType).veBetterPassportContractAddress,
        abi: contractAbi,
        method,
        args: [passport as `0x${string}`],
    });
};

/**
 * Hook to get the entities linked to a passport from the VeBetterPassport contract.
 * @param passportInput - The passport address.
 * @returns An array of entity addresses linked to the given passport.
 */
export const useGetEntitiesLinkedToPassport = (
    passportInput?: string | null,
) => {
    const { network } = useVeChainKitConfig();
    const veBetterPassportContractAddress = getConfig(
        network.type,
    ).veBetterPassportContractAddress;

    return useCallClause({
        address: veBetterPassportContractAddress,
        abi: contractAbi,
        method,
        args: [passportInput as `0x${string}`],
        queryOptions: {
            enabled:
                !!passportInput &&
                !!veBetterPassportContractAddress &&
                !!network.type,
            select: (res) => res[0],
        },
    });
};

/**
 * Hook to get the entities linked to the current user's passport from the VeBetterPassport contract.
 * @param address - The address of the entity (used as passport).
 * @returns An array of entity addresses linked to the current user's passport.
 */
export const useGetUserEntitiesLinkedToPassport = (address?: string) => {
    return useGetEntitiesLinkedToPassport(address);
};
