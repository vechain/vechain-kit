import { getConfig } from '@/config';
import { B3TR__factory } from '@/contracts';
import { useVeChainKitConfig } from '@/providers';
import { formatEther } from 'viem';
import { useCallClause, getCallClauseQueryKey } from '@/hooks';
import { NETWORK_TYPE } from '@/config/network';

const contractAbi = B3TR__factory.abi;
const method = 'totalSupply';

export const getB3trTotalSupplyQueryKey = (networkType: NETWORK_TYPE) => {
    const contractAddress = getConfig(networkType).b3trContractAddress;
    return getCallClauseQueryKey({
        address: contractAddress,
        abi: contractAbi,
        method,
        args: [],
    });
};

/**
 * Hook to get the total supply of B3TR tokens
 *
 * @param customEnabled - Flag indicating whether the hook is enabled or not. Default is true.
 * @returns The total supply of B3TR tokens in wei, formatted as ether
 */
export const useGetB3trTotalSupply = (customEnabled = true) => {
    const { network } = useVeChainKitConfig();
    const contractAddress = getConfig(network.type).b3trContractAddress;

    // B3TR totalSupply result: [totalSupplyInWei]
    return useCallClause({
        address: contractAddress,
        abi: contractAbi,
        method,
        args: [],
        queryOptions: {
            enabled: customEnabled && !!network.type && !!contractAddress,
            select: (data) => formatEther(data[0]),
        },
    });
};
