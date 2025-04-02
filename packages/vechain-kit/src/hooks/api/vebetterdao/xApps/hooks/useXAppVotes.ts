import { getConfig } from '@/config';
import { NETWORK_TYPE } from '@/config/network';
import { XAllocationVotingGovernor__factory } from '@/contracts';
import { getCallKey, useCall } from '@/hooks';
import { useVeChainKitConfig } from '@/providers';
import { formatEther } from 'viem';
import { ThorClient } from '@vechain/sdk-network';
import { Interface } from 'ethers';

/**
 *  Get the number of votes for a xApp in an allocation round
 * @param thor  the connex instance
 * @param networkType  the network type
 * @param xAppId  the xApp id to get the votes for
 * @param roundId  the round id to get the votes for
 * @returns  the number of votes for the xApp in the round
 */
export const getXAppVotes = async (
    thor: ThorClient,
    networkType: NETWORK_TYPE,
    roundId: string,
    xAppId: string,
): Promise<string> => {
    const ALLOCATION_VOTING_CONTRACT =
        getConfig(networkType).xAllocationVotingContractAddress;
    const contract = thor.contracts.load(
        ALLOCATION_VOTING_CONTRACT,
        XAllocationVotingGovernor__factory.abi,
    );
    const res = await contract.read.getAppVotes(roundId, xAppId);

    if (!res) return Promise.reject(new Error('Failed to get app votes'));

    return formatEther(res[0] as bigint);
};

/**
 *  Returns the query key for fetching the number of  votes for a given app in a roundId.
 * @param roundId  the roundId the get the votes for
 */
export const getXAppVotesQueryKey = (
    roundId: number | string,
    appId?: string,
) =>
    getCallKey({
        method: 'getAppVotes',
        keyArgs: [roundId, ...(appId ? [appId] : [])],
    });

/**
 *  Hook to get the number of votes for a given app in a roundId
 *
 * @param roundId  the roundId the get the votes for
 * @returns  the number of votes for a given roundId
 */
export const useXAppVotes = (roundId?: number | string, appId?: string) => {
    const { network } = useVeChainKitConfig();

    const contractInterface =
        XAllocationVotingGovernor__factory.createInterface() as Interface & {
            abi: readonly any[];
        };
    contractInterface.abi = XAllocationVotingGovernor__factory.abi;

    return useCall({
        contractInterface: contractInterface,
        contractAddress: getConfig(network.type)
            .xAllocationVotingContractAddress,
        method: 'getAppVotes',
        args: [roundId, appId],
        enabled: !!roundId && !!appId && !!network.type,
        // mapResponse: res => formatEther(res.decoded[0]),
    });
};
