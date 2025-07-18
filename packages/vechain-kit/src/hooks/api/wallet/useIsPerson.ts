import { getConfig } from '@/config';
import { NETWORK_TYPE } from '@/config/network';
import { VeBetterPassport__factory } from '@vechain/vechain-contracts';
import { useCallClause, getCallClauseQueryKeyWithArgs } from '@/hooks';
import { useVeChainKitConfig } from '@/providers';

const abi = VeBetterPassport__factory.abi;
const method = 'isPerson' as const;

/**
 * Returns the query key for fetching the isPerson status.
 * @param user - The user address.
 * @returns The query key for fetching the isPerson status.
 */
export const getIsPersonQueryKey = (user: string, network: NETWORK_TYPE) => {
    const address = getConfig(network)
        .veBetterPassportContractAddress as `0x${string}`;

    return getCallClauseQueryKeyWithArgs({
        abi,
        address,
        method,
        args: [user as `0x${string}`],
    });
};

/**
 * Hook to get the isPerson status from the VeBetterPassport contract.
 * @param user - The user address.
 * @returns The isPerson status.
 */
export const useIsPerson = (user?: string | null) => {
    const { network } = useVeChainKitConfig();

    const address = getConfig(network.type)
        .veBetterPassportContractAddress as `0x${string}`;

    return useCallClause({
        abi,
        address,
        method,
        args: [(user ?? '0x') as `0x${string}`],
        queryOptions: {
            enabled: !!user,
            select: (data) => data[0],
        },
    });
};
