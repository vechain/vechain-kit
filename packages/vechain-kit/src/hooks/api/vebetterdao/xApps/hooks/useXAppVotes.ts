import { getConfig } from '@/config';
import { NETWORK_TYPE } from '@/config/network';
import { XAllocationVotingGovernor__factory } from '@vechain/vechain-contract-types';
import { getCallKey, useCall } from '@/hooks';
import { useVeChainKitConfig } from '@/providers';
import { formatEther } from 'viem';

const allocationVotingInterface =
    XAllocationVotingGovernor__factory.createInterface();

const method = 'getAppVotes';

/**
 *  Get the number of votes for a xApp in an allocation round
 * @param thor  the connex instance
 * @param networkType  the network type
 * @param xAppId  the xApp id to get the votes for
 * @param roundId  the round id to get the votes for
 * @returns  the number of votes for the xApp in the round
 */
export const getXAppVotes = async (
    thor: Connex.Thor,
    networkType: NETWORK_TYPE,
    roundId: string,
    xAppId: string,
): Promise<string> => {
    const ALLOCATION_VOTING_CONTRACT =
        getConfig(networkType).xAllocationVotingContractAddress;
    const functionFragment = allocationVotingInterface
        .getFunction(method)
        .format('json');
    const res = await thor
        .account(ALLOCATION_VOTING_CONTRACT)
        .method(JSON.parse(functionFragment))
        .call(roundId, xAppId);

    if (res.vmError) return Promise.reject(new Error(res.vmError));

    return formatEther(res.decoded[0]);
};

/**
 *  Returns the query key for fetching the number of  votes for a given app in a roundId.
 * @param roundId  the roundId the get the votes for
 */
export const getXAppVotesQueryKey = (
    roundId: number | string,
    appId?: string,
) => getCallKey({ method, keyArgs: [roundId, ...(appId ? [appId] : [])] });

/**
 *  Hook to get the number of votes for a given app in a roundId
 *
 * @param roundId  the roundId the get the votes for
 * @returns  the number of votes for a given roundId
 */
export const useXAppVotes = (roundId?: number | string, appId?: string) => {
    const { network } = useVeChainKitConfig();

    return useCall({
        contractInterface: allocationVotingInterface,
        contractAddress: getConfig(network.type)
            .xAllocationVotingContractAddress,
        method,
        args: [roundId, appId],
        enabled: !!roundId && !!appId && !!network.type,
        // mapResponse: res => formatEther(res.decoded[0]),
    });
};
