import { useQuery } from '@tanstack/react-query';
import { useThor } from '@vechain/dapp-kit-react';
import { getConfig } from '@/config';
import { XAllocationVoting__factory } from '@/contracts';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';
import { type ThorClient } from '@vechain/sdk-network';

export const RoundState = {
    0: 'Active',
    1: 'Failed',
    2: 'Succeeded',
} as const;

/**
 * Returns the state of a given roundId
 * @param thor the thor client
 * @param networkType the network type
 * @param roundId the roundId to get state for
 * @returns the state of a given roundId
 */
export const getAllocationsRoundState = async (
    thor: ThorClient,
    networkType: NETWORK_TYPE,
    roundId?: string,
): Promise<keyof typeof RoundState> => {
    if (!roundId) return Promise.reject(new Error('roundId is required'));

    const xAllocationVotingContract =
        getConfig(networkType).xAllocationVotingContractAddress;

    const res = await thor.contracts
        .load(xAllocationVotingContract, XAllocationVoting__factory.abi)
        .read.state(roundId);

    if (!res) return Promise.reject(new Error('Round not found'));

    return Number(res) as keyof typeof RoundState;
};

export const getAllocationsRoundStateQueryKey = (roundId?: string) => [
    'VECHAIN_KIT',
    'allocationsRoundState',
    roundId,
];

/**
 * Hook to get the state of a given roundId
 * @param roundId the roundId to get state for
 * @returns the state of a given roundId
 */
export const useAllocationsRoundState = (roundId?: string) => {
    const thor = useThor();
    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: getAllocationsRoundStateQueryKey(roundId),
        queryFn: async () =>
            await getAllocationsRoundState(thor, network.type, roundId),
        enabled: !!thor && !!network.type && !!roundId,
    });
};
