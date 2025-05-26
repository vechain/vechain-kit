import { getConfig } from '@/config';
import { GalaxyMember__factory } from '@/contracts';
import { useVeChainKitConfig } from '@/providers';
import { useCallClause, getCallClauseQueryKey } from '@/hooks';
import { NETWORK_TYPE } from '@/config/network';

const contractAbi = GalaxyMember__factory.abi;
const method = 'participatedInGovernance';

export const getParticipatedInGovernanceQueryKey = (
    networkType: NETWORK_TYPE,
    user: string,
) => {
    const contractAddress = getConfig(networkType).galaxyMemberContractAddress;
    return getCallClauseQueryKey<typeof contractAbi>({
        address: contractAddress,
        method,
        args: [user],
    });
};

/**
 * Get whether an address has participated in governance
 *
 * @param user the address to know if they have participated in governance
 * @param customEnabled - Flag to enable or disable the hook. Default is true.
 * @returns whether the address has participated in governance
 */
export const useParticipatedInGovernance = (
    user: string | null,
    customEnabled = true,
) => {
    const { network } = useVeChainKitConfig();
    const contractAddress = getConfig(network.type).galaxyMemberContractAddress;

    // Galaxy Member participated in governance result: [ false ]
    return useCallClause({
        address: contractAddress,
        abi: contractAbi,
        method,
        args: [user!],
        queryOptions: {
            select: (data) => data[0],
            enabled:
                !!user && customEnabled && !!network.type && !!contractAddress,
        },
    });
};
