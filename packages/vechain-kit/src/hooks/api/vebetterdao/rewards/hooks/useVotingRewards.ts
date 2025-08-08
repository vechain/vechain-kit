import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useConnex } from '@vechain/dapp-kit-react';
import { useMemo } from 'react';
import { getRoundRewardQueryKey } from './useVotingRoundReward';
import { VoterRewards__factory } from '@vechain/vechain-contract-types';
import { abi } from 'thor-devkit';
import { getConfig } from '@/config';
import { BigNumber } from 'bignumber.js';
import { useVeChainKitConfig } from '@/providers';
import { formatEther } from 'viem';

const voterRewardsInterface = VoterRewards__factory.createInterface();
const voteRewardFragment = voterRewardsInterface
    .getFunction('getReward')
    .format('json');
const getReward = new abi.Function(JSON.parse(voteRewardFragment));

/**
 * useVotingRewards is a custom hook that fetches the voting rewards for a given round and voter.
 * It uses the mutli-clause reading to fetch the data in parallel for all rounds up to the current one.
 *
 * @param {string} currentRoundId - The id of the current round. If not provided, no queries will be made.
 * @param {string} voter - The address of the voter. If not provided, the rewards for all voters will be fetched.
 * @returns {object} An object containing the status and data of the queries. Refer to the react-query documentation for more details.
 */
export const useVotingRewards = (currentRoundId?: string, voter?: string) => {
    const { thor } = useConnex();
    const queryClient = useQueryClient();
    const { network } = useVeChainKitConfig();
    const contractAddress = getConfig(network.type).voterRewardsContractAddress;

    // Get array from 1 to currentRoundId - 1 (if currentRoundId is still active)
    const rounds = useMemo(() => {
        return Array.from(
            { length: parseInt(currentRoundId ?? '0') - 1 },
            (_, i) => (i + 1).toString(),
        );
    }, [currentRoundId]);

    return useQuery({
        queryKey: getRoundRewardQueryKey('ALL', voter),
        enabled:
            !!thor &&
            !!voter &&
            !!currentRoundId &&
            !!rounds.length &&
            !!network.type,
        queryFn: async () => {
            const clauses = rounds.map((roundId) => ({
                to: contractAddress,
                value: '0x0',
                data: getReward.encode(roundId, voter),
            }));

            const res = await thor.explain(clauses).execute();

            let total = new BigNumber(0);
            const roundsRewards = res.map((r, index) => {
                const decoded = getReward.decode(r.data);
                if (r.reverted)
                    throw new Error(
                        `Clause ${index + 1} reverted with reason ${
                            r.revertReason
                        }`,
                    );
                const roundId = rounds[index] as string;
                const rewards = decoded[0] as string;
                const formattedRewards = formatEther(BigInt(rewards));

                total = total.plus(rewards);

                queryClient.setQueryData(
                    getRoundRewardQueryKey(roundId, voter),
                    {
                        roundId,
                        rewards: formattedRewards,
                    },
                );
                return {
                    roundId,
                    rewards,
                    formattedRewards,
                };
            });

            const totalFormatted = formatEther(BigInt(total.toFixed()));

            return {
                total: total.toFixed(),
                totalFormatted,
                roundsRewards,
            };
        },
    });
};
