import { useQuery } from '@tanstack/react-query';
import { useConnex } from '@vechain/dapp-kit-react';
import { getConfig } from '@/config';
import { XAllocationVoting__factory } from '@vechain/vechain-contract-types';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';

const xAllocationVotingInterface = XAllocationVoting__factory.createInterface();

/**
 *
 * Returns the current roundId of allocations voting
 * @param thor  the thor client
 * @param networkType the network type
 * @returns the current roundId of allocations voting
 */
export const getCurrentAllocationsRoundId = async (
    thor: Connex.Thor,
    networkType: NETWORK_TYPE,
): Promise<string> => {
    const currentRoundAbi =
        xAllocationVotingInterface.getFunction('currentRoundId');
    if (!currentRoundAbi) throw new Error('currentRoundId function not found');
    const res = await thor
        .account(getConfig(networkType).xAllocationVotingContractAddress)
        .method(currentRoundAbi)
        .call();

    if (res.vmError) return Promise.reject(new Error(res.vmError));

    return res.decoded[0];
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
    const { thor } = useConnex();
    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: getCurrentAllocationsRoundIdQueryKey(),
        queryFn: async () =>
            await getCurrentAllocationsRoundId(thor, network.type),
        enabled: !!thor && !!network.type,
    });
};
