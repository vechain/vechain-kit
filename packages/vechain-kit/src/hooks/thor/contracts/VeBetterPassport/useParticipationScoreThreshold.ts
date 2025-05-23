import { getConfig } from '@/config';
import { VeBetterPassport__factory } from '@/contracts/typechain-types';
import { useVeChainKitConfig } from '@/providers';
import { useCallClause, getCallClauseQueryKey } from '@/hooks';
import { NETWORK_TYPE } from '@/config/network';

const contractAbi = VeBetterPassport__factory.abi;
const method = 'thresholdPoPScore' as const;

export const getParticipationScoreThresholdQueryKey = (
    networkType: NETWORK_TYPE,
) => {
    const veBetterPassportContractAddress =
        getConfig(networkType).veBetterPassportContractAddress;
    return getCallClauseQueryKey({
        address: veBetterPassportContractAddress,
        abi: contractAbi,
        method,
        args: [],
    });
};

/**
 * Hook to get the participation score threshold from the VeBetterPassport contract
 * @param customEnabled - Flag to enable or disable the hook. Default is true.
 * @returns the participation score threshold as a number
 */
export const useParticipationScoreThreshold = (customEnabled = true) => {
    const { network } = useVeChainKitConfig();
    const veBetterPassportContractAddress = getConfig(
        network.type,
    ).veBetterPassportContractAddress;

    // VeBetter Passport participation score threshold result: [ 300n ]
    return useCallClause({
        abi: contractAbi,
        address: veBetterPassportContractAddress,
        method,
        args: [],
        queryOptions: {
            enabled:
                customEnabled &&
                !!veBetterPassportContractAddress &&
                !!network.type,
            select: (data) => Number(data[0]),
        },
    });
};
