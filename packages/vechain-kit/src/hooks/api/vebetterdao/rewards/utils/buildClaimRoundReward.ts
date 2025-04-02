import { getConfig } from '@/config';
import { VoterRewards__factory } from '@/contracts';
import { NETWORK_TYPE } from '@/config/network';
import { ContractClause } from '@vechain/sdk-network';
import { useThor } from '@vechain/dapp-kit-react';

/**
 * Builds a transaction clause to claim rewards for a specific voting round.
 * This function constructs a transaction object that can be used to interact with the VoterRewards smart contract.
 *
 * @param {string} roundId - The ID of the voting round for which the rewards are to be claimed.
 * @param {string} address - The Vechain address of the user claiming the rewards.
 * @param {NETWORK_TYPE} networkType - The type of the network.
 * @returns {Clause} A transaction clause containing the necessary data for claiming the rewards, including the target contract address, the method call data, and the ABI for decoding.
 */
export const buildClaimRoundReward = (
    roundId: string,
    address: string,
    networkType: NETWORK_TYPE,
): ContractClause => {
    const thor = useThor();
    const contract = thor.contracts.load(
        getConfig(networkType).voterRewardsContractAddress,
        VoterRewards__factory.abi,
    );
    const clause: ContractClause = contract.clause.claimReward(
        roundId,
        address,
        {
            comment: `Claim rewards for round ${roundId}`,
        },
    );

    return clause;
};
