import { getConfig } from '@/config';
import { NETWORK_TYPE } from '@/config/network';
import { XAllocationVotingGovernor__factory } from '@/contracts';
import { getCallKey, useCall } from '@/hooks';
import { useVeChainKitConfig } from '@/providers';
import { ThorClient } from '@vechain/sdk-network';
import { Interface } from 'ethers';

const contractInterface =
    XAllocationVotingGovernor__factory.createInterface() as Interface & {
        abi: readonly any[];
    };
contractInterface.abi = XAllocationVotingGovernor__factory.abi;
const method = 'getAppVotesQF';

/**
 *  Get the number of qf votes for a xApp in an allocation round
 * @param thor  the connex instance
 * @param xAppId  the xApp id to get the votes for
 * @param roundId  the round id to get the votes for
 * @returns  the number of votes for the xApp in the round
 */
export const getXAppVotesQf = async (
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
    const res = await contract.read.getAppVotesQF(roundId, xAppId);

    if (!res) return Promise.reject('Error fetching xApp votes');

    return (Number(res[0]) ** 2).toString();
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
        method,
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
        contractInterface,
        contractAddress: getConfig(network.type)
            .xAllocationVotingContractAddress,
        method,
        args: [roundId, appId],
        enabled: !!roundId && !!appId && !!network.type,
        // mapResponse: res => formatEther(res.decoded[0]),
    });
};
