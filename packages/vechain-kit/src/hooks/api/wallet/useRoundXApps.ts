import { getConfig } from '../../../config';
import { NETWORK_TYPE } from '../../../config/network';
import { XAllocationVoting__factory } from '@vechain/vechain-contract-types';
import { useVeChainKitConfig } from '../../../providers/VeChainKitProvider';
import { getCallClauseQueryKeyWithArgs, useCallClause } from '../../';

const abi = XAllocationVoting__factory.abi;
const method = 'getAppsOfRound' as const;

export const getRoundXAppsQueryKey = (
    roundId: string,
    networkType: NETWORK_TYPE,
) =>
    getCallClauseQueryKeyWithArgs({
        abi,
        address: getConfig(networkType)
            .xAllocationVotingContractAddress as `0x${string}`,
        method,
        args: [BigInt(roundId ?? 0)],
    });

export const useRoundXApps = (roundId?: string) => {
    const { network } = useVeChainKitConfig();

    const address = getConfig(network.type)
        .xAllocationVotingContractAddress as `0x${string}`;

    return useCallClause({
        abi,
        address,
        method,
        args: [BigInt(roundId ?? 0)],
        queryOptions: {
            enabled: !!roundId,
            select: (data) =>
                data[0].map((app) => ({
                    id: app.id.toString(),
                    teamWalletAddress: app.teamWalletAddress,
                    name: app.name,
                    metadataURI: app.metadataURI,
                    createdAtTimestamp: app.createdAtTimestamp.toString(),
                })),
        },
    });
};
