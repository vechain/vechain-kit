import { useQuery } from '@tanstack/react-query';
import { useThor } from '@vechain/dapp-kit-react';
import { getConfig } from '@/config';
import { XAllocationVoting__factory } from '@/contracts';
import { executeCallClause, XApp } from '@/hooks';
import { NETWORK_TYPE } from '@/config/network';
import { useVeChainKitConfig } from '@/providers';
import { ThorClient } from '@vechain/sdk-network';

const abi = XAllocationVoting__factory.abi;
const method = 'getAppsOfRound' as const;

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

    const [xApps] = await executeCallClause({
        thor,
        contractAddress:
            getConfig(networkType).xAllocationVotingContractAddress,
        abi,
        method,
        args: [BigInt(roundId)],
    });

    return xApps.map((app) => ({
        id: app.id.toString(),
        teamWalletAddress: app.teamWalletAddress,
        name: app.name,
        metadataURI: app.metadataURI,
        createdAtTimestamp: app.createdAtTimestamp.toString(),
        appAvailableForAllocationVoting: app.appAvailableForAllocationVoting,
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
    const thor = useThor();

    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: getRoundXAppsQueryKey(roundId),
        queryFn: async () => await getRoundXApps(thor, network.type, roundId),
        enabled: !!thor && !!roundId && !!network.type,
    });
};
