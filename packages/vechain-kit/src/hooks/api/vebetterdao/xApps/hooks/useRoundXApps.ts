import { useQuery } from '@tanstack/react-query';
import { useConnex } from '@vechain/dapp-kit-react';
import { getConfig } from '@/config';
import { XAllocationVoting__factory as XAllocationVoting } from '@/contracts';
import { XApp } from '../getXApps';
import { NETWORK_TYPE } from '@/config/network';
import { useVeChainKitConfig } from '@/providers';

/**
 * Returns all the available xApps (apps that can be voted on for allocation)
 * @param thor  the thor client
 * @param networkType  the network type
 * @param roundId  the id of the round the get state for
 * @returns  all the available xApps (apps that can be voted on for allocation) capped to 256 see {@link XApp}
 */
export const getRoundXApps = async (
    thor: Connex.Thor,
    networkType: NETWORK_TYPE,
    roundId?: string,
): Promise<XApp[]> => {
    if (!roundId) return [];

    const xAllocationVotingContract =
        getConfig(networkType).xAllocationVotingContractAddress;
    const functionFragment = XAllocationVoting.createInterface()
        .getFunction('getAppsOfRound')
        .format('json');
    const res = await thor
        .account(xAllocationVotingContract)
        .method(JSON.parse(functionFragment))
        .call(roundId);

    if (res.vmError) return Promise.reject(new Error(res.vmError));

    const apps = res.decoded[0];
    return apps.map((app: any) => ({
        id: app[0],
        teamWalletAddress: app[1],
        name: app[2],
        metadataURI: app[3],
        createdAtTimestamp: app[4],
    }));
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
    const { thor } = useConnex();

    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: getRoundXAppsQueryKey(roundId),
        queryFn: async () => await getRoundXApps(thor, network.type, roundId),
        enabled: !!thor && !!roundId && !!network.type,
    });
};
