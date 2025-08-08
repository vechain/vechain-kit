import { EnhancedClause } from '@/types';
import { getConfig } from '@/config';
import { VoterRewards__factory } from '@vechain/vechain-contract-types';
import { NETWORK_TYPE } from '@/config/network';

const voterRewardsInterface = VoterRewards__factory.createInterface();

/**
 * Builds a transaction clause to claim rewards for a specific voting round.
 * This function constructs a transaction object that can be used to interact with the VoterRewards smart contract.
 *
 * @param {string} roundId - The ID of the voting round for which the rewards are to be claimed.
 * @param {string} address - The Vechain address of the user claiming the rewards.
 * @param {NETWORK_TYPE} networkType - The type of the network.
 * @returns {EnhancedClause} A transaction clause containing the necessary data for claiming the rewards, including the target contract address, the method call data, and the ABI for decoding.
 */
export const buildClaimRoundReward = (
    roundId: string,
    address: string,
    networkType: NETWORK_TYPE,
): EnhancedClause => {
    const clause: EnhancedClause = {
        to: getConfig(networkType).voterRewardsContractAddress,
        value: 0,
        data: voterRewardsInterface.encodeFunctionData('claimReward', [
            roundId,
            address,
        ]),
        comment: `Claim rewards for round ${roundId}`,
        abi: JSON.parse(
            JSON.stringify(voterRewardsInterface.getFunction('claimReward')),
        ),
    };

    return clause;
};
