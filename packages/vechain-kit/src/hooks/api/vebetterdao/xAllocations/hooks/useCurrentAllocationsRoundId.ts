import { useQuery } from '@tanstack/react-query';
import { useThor } from '@vechain/dapp-kit-react';
import { getConfig } from '@/config';
import { XAllocationVoting__factory } from '@/contracts';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';
import { type ThorClient } from '@vechain/sdk-network';

/**
 *
 * Returns the current roundId of allocations voting
 * @param thor  the thor client
 * @param networkType the network type
 * @returns the current roundId of allocations voting
 */
export const getCurrentAllocationsRoundId = async (
    thor: ThorClient,
    networkType: NETWORK_TYPE,
): Promise<string> => {
    const res = await thor.contracts
        .load(
            getConfig(networkType).xAllocationVotingContractAddress,
            XAllocationVoting__factory.abi,
        )
        .read.currentRoundId();

    if (!res) return Promise.reject(new Error('Round not found'));

    return res[0].toString();
};

export const getCurrentAllocationsRoundIdQueryKey = () => [
    'VECHAIN_KIT',
    'currentAllocationsRoundId',
];

/**
 * Hook to get the current roundId of allocations voting
 * @returns  the current roundId of allocations voting
 */
export const useCurrentAllocationsRoundId = () => {
    const thor = useThor();
    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: getCurrentAllocationsRoundIdQueryKey(),
        queryFn: async () =>
            await getCurrentAllocationsRoundId(thor, network.type),
        enabled: !!thor && !!network.type,
    });
};
