import { getConfig } from '@/config';
import { GalaxyMember__factory } from '@/contracts';
import { useVeChainKitConfig } from '@/providers';
import { useCallClause, getCallClauseQueryKey } from '@/hooks';
import { NETWORK_TYPE } from '@/config/network';

const contractAbi = GalaxyMember__factory.abi;
const method = 'getSelectedTokenId';

export const getSelectedTokenIdQueryKey = (
    networkType: NETWORK_TYPE,
    account: string,
) => {
    const contractAddress = getConfig(networkType).galaxyMemberContractAddress;
    return getCallClauseQueryKey({
        address: contractAddress,
        abi: contractAbi,
        method,
        args: [account],
    });
};

/**
 * Custom hook that retrieves the selected token ID for the selected galaxy member.
 *
 * @param account - The address of the account.
 * @param customEnabled - Determines whether the hook is enabled or not. Default is true.
 * @returns The selected token ID for the galaxy member.
 */
export const useSelectedTokenId = (account?: string, customEnabled = true) => {
    const { network } = useVeChainKitConfig();
    const contractAddress = getConfig(network.type).galaxyMemberContractAddress;

    // Galaxy Member selected token ID result: [ 0n ]
    return useCallClause({
        address: contractAddress,
        abi: contractAbi,
        method,
        args: [account!],
        queryOptions: {
            enabled:
                !!account &&
                customEnabled &&
                !!network.type &&
                !!contractAddress,
            select: (data) => data[0].toString(),
        },
    });
};
