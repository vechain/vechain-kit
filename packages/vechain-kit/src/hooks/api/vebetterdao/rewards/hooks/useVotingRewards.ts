import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { getRoundRewardQueryKey } from './useVotingRoundReward';
import { VoterRewards__factory } from '@/contracts';
import { getConfig } from '@/config';
import { BigNumber } from 'bignumber.js';
import { useVeChainKitConfig } from '@/providers';
import { formatEther } from 'viem';
import { useThor } from '@vechain/dapp-kit-react';

/**
 * useVotingRewards is a custom hook that fetches the voting rewards for a given round and voter.
 * It uses the mutli-clause reading to fetch the data in parallel for all rounds up to the current one.
 *
 * @param {string} currentRoundId - The id of the current round. If not provided, no queries will be made.
 * @param {string} voter - The address of the voter. If not provided, the rewards for all voters will be fetched.
 * @returns {object} An object containing the status and data of the queries. Refer to the react-query documentation for more details.
 */
export const useVotingRewards = (currentRoundId?: string, voter?: string) => {
    const { network } = useVeChainKitConfig();
    const thor = useThor();
    const contract = thor.contracts.load(
        getConfig(network.type).voterRewardsContractAddress,
        VoterRewards__factory.abi,
    );
    const queryClient = useQueryClient();

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
            const clauses = rounds.map((roundId) =>
                contract.clause.getReward(roundId, voter),
            );

            const res = await thor.contracts.executeMultipleClausesCall(
                clauses,
            );

            let total = new BigNumber(0);
            const roundsRewards = res.map((r, index) => {
                const decoded = r.result.array;
                if (!decoded) throw new Error(`Clause ${index + 1} reverted`);
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
