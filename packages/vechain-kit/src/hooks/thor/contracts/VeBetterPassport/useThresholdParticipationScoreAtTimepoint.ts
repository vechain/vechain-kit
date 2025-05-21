import { getCallClauseQueryKey, useCallClause } from '@/hooks';
import { getConfig } from '@/config';
import { VeBetterPassport__factory } from '@/contracts/typechain-types';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';

const contractAbi = VeBetterPassport__factory.abi;
const method = 'thresholdPoPScoreAtTimepoint' as const;

/**
 * Returns the query key for fetching the threshold participation score at a specific timepoint.
 * @param networkType The network type.
 * @param timepoint - The timepoint (block number, uint48).
 * @returns The query key.
 */
export const getThresholdParticipationScoreAtTimepointQueryKey = (
    networkType: NETWORK_TYPE,
    timepoint: number | string,
) => {
    return getCallClauseQueryKey({
        address: getConfig(networkType).veBetterPassportContractAddress,
        abi: contractAbi,
        method,
        args: [Number(timepoint)],
    });
};

/**
 * Hook to get the threshold participation score at a specific timepoint from the VeBetterPassport contract.
 * @param timepointInput - The timepoint (block number, uint48).
 * @returns The threshold participation score
 */
export const useThresholdParticipationScoreAtTimepoint = (
    timepointInput?: number | string,
) => {
    const { network } = useVeChainKitConfig();
    const veBetterPassportContractAddress = getConfig(
        network.type,
    ).veBetterPassportContractAddress;

    return useCallClause({
        address: veBetterPassportContractAddress,
        abi: contractAbi,
        method,
        args: [Number(timepointInput!)],
        queryOptions: {
            enabled:
                timepointInput !== undefined &&
                !!veBetterPassportContractAddress &&
                !!network.type,
            select: (res) => res[0],
        },
    });
};
