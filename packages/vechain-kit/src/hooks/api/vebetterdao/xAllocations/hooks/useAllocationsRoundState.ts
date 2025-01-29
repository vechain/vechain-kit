import { useQuery } from '@tanstack/react-query';
import { useConnex } from '@vechain/dapp-kit-react';
import { getConfig } from '@/config';
import { XAllocationVoting__factory } from '@/contracts';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';

const xAllocationVotingInterface = XAllocationVoting__factory.createInterface();

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
    thor: Connex.Thor,
    networkType: NETWORK_TYPE,
    roundId?: string,
): Promise<keyof typeof RoundState> => {
    if (!roundId) return Promise.reject(new Error('roundId is required'));

    const xAllocationVotingContract =
        getConfig(networkType).xAllocationVotingContractAddress;
    const functionFragment = xAllocationVotingInterface
        .getFunction('state')
        .format('json');

    const res = await thor
        .account(xAllocationVotingContract)
        .method(JSON.parse(functionFragment))
        .call(roundId);

    if (res.vmError) return Promise.reject(new Error(res.vmError));

    return Number(res.decoded[0]) as keyof typeof RoundState;
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
    const { thor } = useConnex();
    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: getAllocationsRoundStateQueryKey(roundId),
        queryFn: async () =>
            await getAllocationsRoundState(thor, network.type, roundId),
        enabled: !!thor && !!network.type && !!roundId,
    });
};
