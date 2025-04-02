import { EnhancedClause } from '@/types';
import { buildClaimRoundReward } from './buildClaimRoundReward';
import { NETWORK_TYPE } from '@/config/network';
import { Clause } from '@vechain/sdk-core';

/**
 * Interface for the reward for a round.
 */
export interface RoundReward {
    roundId: string;
    rewards: string;
}

/**
 * Builds a transaction to claim rewards for a given set of rounds.
 *
 * @param {RoundReward[]} roundRewards - An array of RoundReward objects representing the rewards for each round.
 * @param {string} address - The address of the voter.
 * @param {NETWORK_TYPE} networkType - The type of the network.
 * @returns {Clause[]} An array of clauses representing the transaction.
 */
export const buildClaimRewardsTx = (
    roundRewards: RoundReward[],
    address: string,
    networkType: NETWORK_TYPE,
): Clause[] => {
    const clauses = [];

    for (const round of roundRewards) {
        if (!round.rewards || Number(round.rewards) <= 0) continue;

        const clause: EnhancedClause = buildClaimRoundReward(
            round.roundId,
            address,
            networkType,
        );

        clauses.push(clause);
    }

    return clauses;
};
