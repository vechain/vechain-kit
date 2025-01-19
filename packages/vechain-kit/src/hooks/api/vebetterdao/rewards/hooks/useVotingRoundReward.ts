import { useQuery } from '@tanstack/react-query';
import { useConnex } from '@vechain/dapp-kit-react';
import { getConfig } from '@/config';
import { VoterRewards__factory } from '@/contracts';
import { ethers } from 'ethers';
import { RoundReward } from '../utils';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';

/**
 * Fetches the reward for a given round and voter from the VoterRewards contract.
 *
 * @param {Connex.Thor} thor - The Connex.Thor instance to use for interacting with the VeChain Thor blockchain.
 * @param {NETWORK_TYPE} networkType - The type of the network.
 * @param {string} address - The address of the voter.
 * @param {string} roundId - The id of the round.
 * @returns {Promise<string>} A promise that resolves to the reward for the given round and voter.
 */
export const getRoundReward = async (
    thor: Connex.Thor,
    networkType: NETWORK_TYPE,
    address: string,
    roundId: string,
): Promise<RoundReward> => {
    const functionFragment = VoterRewards__factory.createInterface()
        .getFunction('getReward')
        .format('json');

    const contractAddress = getConfig(networkType).voterRewardsContractAddress;
    const res = await thor
        .account(contractAddress)
        .method(JSON.parse(functionFragment))
        .call(roundId, address);

    if (res.vmError) return Promise.reject(new Error(res.vmError));

    const reward = ethers.formatEther(res.decoded[0]);

    return {
        roundId,
        rewards: reward,
    };
};

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
    const { thor } = useConnex();
    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: getRoundRewardQueryKey(roundId, address),
        queryFn: async () =>
            await getRoundReward(thor, network.type, address, roundId),
        enabled: !!thor && !!address && !!roundId && !!network.type,
    });
};
