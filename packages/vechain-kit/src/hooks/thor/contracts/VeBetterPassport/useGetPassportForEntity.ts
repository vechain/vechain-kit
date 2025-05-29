import { getCallClauseQueryKey, useCallClause } from '@/hooks';
import { getConfig } from '@/config';
import { VeBetterPassport__factory } from '@/contracts';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';

const contractAbi = VeBetterPassport__factory.abi;
const method = 'getPassportForEntity' as const;

/**
 * Returns the query key for fetching the passport for an entity.
 * @param networkType The network type.
 * @param entity - The entity address.
 * @returns The query key for fetching the passport for an entity.
 */
export const getPassportForEntityQueryKey = (
    networkType: NETWORK_TYPE,
    entity: string,
) => {
    return getCallClauseQueryKey<typeof contractAbi>({
        address: getConfig(networkType).veBetterPassportContractAddress,
        method,
        args: [entity as `0x${string}`],
    });
};

/**
 * Hook to get the passport for an entity from the VeBetterPassport contract.
 * @param entityInput - The entity address.
 * @returns The passport address for the given entity.
 */
export const useGetPassportForEntity = (entityInput?: string | null) => {
    const { network } = useVeChainKitConfig();
    const veBetterPassportContractAddress = getConfig(
        network.type,
    ).veBetterPassportContractAddress;

    // VeBetter Passport get passport for entity result: [ '0xf077b491b355E64048cE21E3A6Fc4751eEeA77fa' ]
    return useCallClause({
        address: veBetterPassportContractAddress,
        abi: contractAbi,
        method,
        args: [entityInput as `0x${string}`],
        queryOptions: {
            enabled:
                !!entityInput &&
                !!veBetterPassportContractAddress &&
                !!network.type,
            select: (res) => res[0],
        },
    });
};

/**
 * Hook to get the passport for the current user's entity from the VeBetterPassport contract.
 * @param address - The address of the entity.
 * @returns The passport address for the current user's entity.
 */
export const useGetUserPassportForEntity = (address?: string) => {
    return useGetPassportForEntity(address);
};
