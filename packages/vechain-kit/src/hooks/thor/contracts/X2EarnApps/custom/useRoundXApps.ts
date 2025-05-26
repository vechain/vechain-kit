import { useQuery } from '@tanstack/react-query';
import { useThor } from '@vechain/dapp-kit-react';
import { getConfig } from '@/config';
import { XAllocationVoting__factory } from '@/contracts';
import { XApp } from '@/hooks';
import { NETWORK_TYPE } from '@/config/network';
import { useVeChainKitConfig } from '@/providers';
import { ThorClient } from '@vechain/sdk-network';
/**
 * Returns all the available xApps (apps that can be voted on for allocation)
 * @param thor  the thor client
 * @param networkType  the network type
 * @param roundId  the id of the round the get state for
 * @returns  all the available xApps (apps that can be voted on for allocation) capped to 256 see {@link XApp}
 */
export const getRoundXApps = async (
    thor: ThorClient,
    networkType: NETWORK_TYPE,
    roundId?: string,
): Promise<XApp[]> => {
    if (!roundId) return [];

    const res = await thor.contracts
        .load(
            getConfig(networkType).xAllocationVotingContractAddress,
            XAllocationVoting__factory.abi,
        )
        .read.getAppsOfRound(roundId);

    if (!res) throw new Error(`Failed to get apps of round ${roundId}`);

    // TODO: migration check if it is in correct format
    return res as unknown as XApp[];
};

export const getRoundXAppsQueryKey = (roundId?: string) => [
    'VECHAIN_KIT',
    'round',
    roundId,
    'getXApps',
];

/**
 *  Hook to get all the available xApps (apps that can be voted on for allocation)
 *
 *  @param roundId  the id of the round the get state for
 *
 *  @returns all the available xApps (apps that can be voted on for allocation) capped to 256
 */
export const useRoundXApps = (roundId?: string) => {
    const thor = useThor();

    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: getRoundXAppsQueryKey(roundId),
        queryFn: async () =>
            await getRoundXApps(
                thor as unknown as ThorClient,
                network.type,
                roundId,
            ),
        enabled: !!thor && !!roundId && !!network.type,
    });
};
