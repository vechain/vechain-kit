import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useThor } from '@vechain/dapp-kit-react';
import { useMemo } from 'react';
import { getRoundRewardQueryKey } from '@/hooks';
import { VoterRewards__factory } from '@/contracts';
import { getConfig } from '@/config';
import { BigNumber } from 'bignumber.js';
import { useVeChainKitConfig } from '@/providers';
import { formatEther } from 'viem';

/**
 * useVotingRewards is a custom hook that fetches the voting rewards for a given round and voter.
 * It uses the mutli-clause reading to fetch the data in parallel for all rounds up to the current one.
 *
 * @param {string} currentRoundId - The id of the current round. If not provided, no queries will be made.
 * @param {string} voter - The address of the voter. If not provided, the rewards for all voters will be fetched.
 * @returns {object} An object containing the status and data of the queries. Refer to the react-query documentation for more details.
 */
export const useVotingRewards = (currentRoundId?: string, voter?: string) => {
    const thor = useThor();
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
            const contract = thor.contracts.load(
                contractAddress,
                VoterRewards__factory.abi,
            );
            const clauses = rounds.map((roundId) =>
                // Voter Rewards getReward result type: [ 0n ]
                contract.clause.getReward(roundId, voter),
            );
            const res = await thor.transactions.executeMultipleClausesCall(
                clauses,
            );

            if (!res.every((r) => r.success))
                throw new Error('Failed to fetch voting rewards');

            let total = new BigNumber(0);
            const roundsRewards = res.map((r, index) => {
                const roundId = rounds[index] as string;
                const rewards = r.result.plain as bigint;
                const formattedRewards = formatEther(rewards);

                total = total.plus(BigNumber(rewards.toString()));

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
