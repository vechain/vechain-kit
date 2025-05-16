import { getConfig } from '@/config';
import { VoterRewards__factory } from '@/contracts';
import { useVeChainKitConfig } from '@/providers';
import { formatEther } from 'viem';
import { useCallClause } from '@/hooks';

/**
 * Generates a query key for the getRoundReward query.
 *
 * @param {string} roundId - The id of the round.
 * @param {string} address - The address of the voter.
 * @returns {Array<string>} An array of strings that forms the query key.
 */
export const getRoundRewardQueryKey = (roundId?: string, address?: string) => [
    'VECHAIN_KIT',
    'roundReward',
    roundId,
    'voter',
    address,
];

/**
 * useRoundReward is a custom hook that fetches the reward for a given round and voter.
 *
 * @param {string} address - The address of the voter.
 * @param {string} roundId - The id of the round.
 * @returns {object} An object containing the status and data of the query. Refer to the react-query documentation for more details.
 */
export const useRoundReward = (address: string, roundId: string) => {
    const { network } = useVeChainKitConfig();

    return useCallClause({
        address: getConfig(network.type).voterRewardsContractAddress,
        abi: VoterRewards__factory.abi,
        method: 'getReward',
        args: [BigInt(roundId), address as `0x${string}`],
        queryOptions: {
            enabled: !!address && !!roundId && !!network.type,
            select: (data) => ({
                roundId,
                rewards: formatEther(data[0]),
            }),
        },
    });
};
