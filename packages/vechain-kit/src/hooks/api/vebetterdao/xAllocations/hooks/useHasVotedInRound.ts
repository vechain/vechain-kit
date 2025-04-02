import { useQuery } from '@tanstack/react-query';
import { useThor } from '@vechain/dapp-kit-react';
import { getConfig } from '@/config';
import { XAllocationVoting__factory } from '@/contracts';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';
import { type ThorClient } from '@vechain/sdk-network';

/**
 *
 * Returns if a user has voted in a given roundId
 * @param thor  the thor client
 * @param networkType  the network type
 * @param roundId  the roundId the get state for
 * @param address  the address to check if they have voted
 * @returns if a user has voted in a given roundId
 */
export const getHasVotedInRound = async (
    thor: ThorClient,
    networkType: NETWORK_TYPE,
    roundId?: string,
    address?: string,
): Promise<boolean> => {
    const xAllocationVotingContract =
        getConfig(networkType).xAllocationVotingContractAddress;
    const res = await thor.contracts
        .load(xAllocationVotingContract, XAllocationVoting__factory.abi)
        .read.hasVoted(roundId, address);

    if (!res) return Promise.reject(new Error('Round not found'));

    return res[0].toString() === '1';
};

export const getHasVotedInRoundQueryKey = (
    roundId?: string,
    address?: string,
) => ['VECHAIN_KIT', 'allocationsRound', roundId, 'hasVoted', address];

/**
 *  Hook to get if a user has voted in a given roundId
 * @param roundId  the roundId the get the votes for
 * @param address  the address to check if they have voted
 * @returns  if a user has voted in a given roundId
 */
export const useHasVotedInRound = (roundId?: string, address?: string) => {
    const thor = useThor();
    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: getHasVotedInRoundQueryKey(roundId, address),
        queryFn: async () =>
            await getHasVotedInRound(thor, network.type, roundId, address),
        enabled: !!thor && !!roundId && !!address,
    });
};
