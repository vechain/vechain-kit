import { getConfig } from '@/config';
import { NodeManagement__factory } from '@/contracts';
import { useVeChainKitConfig } from '@/providers';
import { useCallClause } from '@/hooks';

const abi = NodeManagement__factory.abi;
const method = 'isNodeHolder' as const;

/**
 * Get the query key for checking if an address is a node holder.
 * @param address - The address to check.
 */
export const getIsNodeHolderQueryKey = (address: string) => [
    'VECHAIN_KIT',
    'isNodeHolder',
    address,
];

/**
 * Custom hook that checks if a user is a node holder (either directly or through delegation).
 *
 * @param address - The address to check.
 * @returns UseQueryResult containing a boolean indicating if the address is a node holder.
 */
export const useIsNodeHolder = (address: string) => {
    const { network } = useVeChainKitConfig();

    // Node Management isNodeHolder result: [ false ]
    return useCallClause({
        address: getConfig(network.type).nodeManagementContractAddress,
        abi,
        method,
        args: [address as `0x${string}`],
        queryOptions: {
            enabled: !!address && !!network.type,
            select: (res) => res[0],
        },
    });
};
