import { useQuery } from '@tanstack/react-query';
import { useConnex } from '@vechain/dapp-kit-react';
import { getConfig } from '@/config';
import { XAllocationVoting__factory } from '@/contracts';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';

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
    thor: Connex.Thor,
    networkType: NETWORK_TYPE,
    roundId?: string,
    address?: string,
): Promise<boolean> => {
    const xAllocationVotingContract =
        getConfig(networkType).xAllocationVotingContractAddress;
    const functionFragment = XAllocationVoting__factory.createInterface()
        .getFunction('hasVoted')
        .format('json');
    const res = await thor
        .account(xAllocationVotingContract)
        .method(JSON.parse(functionFragment))
        .call(roundId, address);

    if (res.vmError) return Promise.reject(new Error(res.vmError));

    return res.decoded[0];
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
    const { thor } = useConnex();
    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: getHasVotedInRoundQueryKey(roundId, address),
        queryFn: async () =>
            await getHasVotedInRound(thor, network.type, roundId, address),
        enabled: !!thor && !!roundId && !!address,
    });
};
