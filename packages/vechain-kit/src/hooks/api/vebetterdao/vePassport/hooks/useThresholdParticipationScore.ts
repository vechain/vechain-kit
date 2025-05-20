import { getCallClauseQueryKey, useCallClause } from '@/hooks';
import { getConfig } from '@/config';
import { VeBetterPassport__factory } from '@/contracts/typechain-types';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';

const contractAbi = VeBetterPassport__factory.abi;
const method = 'thresholdPoPScore' as const;

/**
 * Returns the query key for fetching the threshold participation score.
 * @param networkType The network type.
 * @returns The query key for fetching the threshold participation score.
 */
export const getThresholdParticipationScoreQueryKey = (
    networkType: NETWORK_TYPE,
) => {
    return getCallClauseQueryKey({
        address: getConfig(networkType).veBetterPassportContractAddress,
        abi: contractAbi,
        method,
        args: [],
    });
};

/**
 * Hook to get the threshold participation score from the VeBetterPassport contract.
 * @returns The threshold participation score.
 */
export const useThresholdParticipationScore = () => {
    const { network } = useVeChainKitConfig();
    const veBetterPassportContractAddress = getConfig(
        network.type,
    ).veBetterPassportContractAddress;

    return useCallClause({
        address: veBetterPassportContractAddress,
        abi: contractAbi,
        method,
        args: [],
        queryOptions: {
            enabled: !!veBetterPassportContractAddress && !!network.type,
            select: (res) => Number(res[0]),
        },
    });
};
