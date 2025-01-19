import { getConfig } from '@/config';
import { NETWORK_TYPE } from '@/config/network';
import { XAllocationVotingGovernor__factory } from '@/contracts';
import { getCallKey, useCall } from '@/hooks';
import { useVeChainKitConfig } from '@/providers';

const allocationVotingInterface =
    XAllocationVotingGovernor__factory.createInterface();

/**
 *  Get the number of qf votes for a xApp in an allocation round
 * @param thor  the connex instance
 * @param xAppId  the xApp id to get the votes for
 * @param roundId  the round id to get the votes for
 * @returns  the number of votes for the xApp in the round
 */
export const getXAppVotesQf = async (
    thor: Connex.Thor,
    networkType: NETWORK_TYPE,
    roundId: string,
    xAppId: string,
): Promise<string> => {
    const ALLOCATION_VOTING_CONTRACT =
        getConfig(networkType).xAllocationVotingContractAddress;
    const functionFragment = allocationVotingInterface
        .getFunction('getAppVotesQF')
        .format('json');
    const res = await thor
        .account(ALLOCATION_VOTING_CONTRACT)
        .method(JSON.parse(functionFragment))
        .call(roundId, xAppId);

    if (res.vmError) return Promise.reject(new Error(res.vmError));

    return (res.decoded[0] ** 2).toString();
    //   return ethers.parseEther(res.decoded[0]).toString()
};

/**
 *  Returns the query key for fetching the number of quadratic funding votes for a given app in a roundId.
 * @param roundId  the roundId the get the votes for
 */
export const getXAppVotesQfQueryKey = (
    roundId: number | string,
    appId?: string,
) =>
    getCallKey({
        method: 'getAppVotesQF',
        keyArgs: [roundId, ...(appId ? [appId] : [])],
    });

/**
 *  Hook to get the number of quadratic funding votes for a given app in a roundId
 *
 * @param roundId  the roundId the get the votes for
 * @returns  the number of votes for a given roundId
 */
export const useXAppVotesQf = (roundId?: number | string, appId?: string) => {
    const { network } = useVeChainKitConfig();

    return useCall({
        contractInterface: allocationVotingInterface,
        contractAddress: getConfig(network.type)
            .xAllocationVotingContractAddress,
        method: 'getAppVotesQF',
        args: [roundId, appId],
        enabled: !!roundId && !!appId && !!network.type,
        // mapResponse: res => ethers.formatEther(res.decoded[0]),
    });
};
