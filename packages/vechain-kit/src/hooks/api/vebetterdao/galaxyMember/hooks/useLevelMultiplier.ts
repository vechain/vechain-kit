import { getConfig } from '@/config';
import { VoterRewards__factory } from '@/contracts';
import { useVeChainKitConfig } from '@/providers';
import { useCallClause, getCallClauseQueryKey } from '@/hooks';
import { NETWORK_TYPE } from '@/config/network';

const contractAbi = VoterRewards__factory.abi;
const method = 'levelToMultiplier';

export const getLevelMultiplierQueryKey = (
    networkType: NETWORK_TYPE,
    level: string,
) => {
    const contractAddress = getConfig(networkType).voterRewardsContractAddress;
    return getCallClauseQueryKey({
        address: contractAddress,
        abi: contractAbi,
        method,
        args: [BigInt(level)],
    });
};

const percentageToMultiplier = (percentage: number) => 1 + percentage / 100;

export const useLevelMultiplier = (level?: string, customEnabled = true) => {
    const { network } = useVeChainKitConfig();
    const contractAddress = getConfig(network.type).voterRewardsContractAddress;

    return useCallClause({
        address: contractAddress,
        abi: contractAbi,
        method,
        args: [BigInt(level!)],
        queryOptions: {
            enabled:
                !!level && customEnabled && !!network.type && !!contractAddress,
            select: (data: readonly [bigint]) =>
                percentageToMultiplier(Number(data[0])),
        },
    });
};
