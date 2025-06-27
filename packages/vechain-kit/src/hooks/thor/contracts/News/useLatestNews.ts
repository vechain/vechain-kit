import { getConfig } from '@/config';
import { NETWORK_TYPE } from '@/config/network';
import { News__factory } from '@/contracts/typechain-types/factories/contracts';
import { getCallClauseQueryKeyWithArgs, useCallClause } from '@/hooks/utils';
import { useVeChainKitConfig } from '@/providers';
import { ethers } from 'ethers';

const method = 'latestNewsPaginated' as const;
const abi = News__factory.abi;

export const getLatestNewsQueryKey = (
    networkType: NETWORK_TYPE,
    resultsPerPage: number,
    page: number,
) =>
    getCallClauseQueryKeyWithArgs<typeof abi, typeof method>({
        abi,
        address: getConfig(networkType).newsContractAddress,
        method,
        args: [ethers.toBigInt(resultsPerPage), ethers.toBigInt(page)],
    });

/**
 *  Hook to get the latest news
 * @param resultsPerPage - the number of results per page
 * @param page - the page number
 * @returns - the latest news
 */
export const useLatestNews = (resultsPerPage: number, page: number) => {
    const { network } = useVeChainKitConfig();
    const contractAddress = getConfig(network.type).newsContractAddress;

    return useCallClause({
        abi,
        address: contractAddress,
        method,
        args: [ethers.toBigInt(resultsPerPage), ethers.toBigInt(page)],
        queryOptions: {
            enabled: !!resultsPerPage && !!network.type && !!contractAddress,
            select: (data) => data[0],
        },
    });
};
