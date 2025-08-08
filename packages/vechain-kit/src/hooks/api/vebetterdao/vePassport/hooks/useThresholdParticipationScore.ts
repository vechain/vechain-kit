import { getCallKey, useCall } from '@/hooks';
import { getConfig } from '@/config';
import { VeBetterPassport__factory } from '@vechain/vechain-contract-types';
import { useVeChainKitConfig } from '@/providers';

const vePassportInterface = VeBetterPassport__factory.createInterface();
const method = 'thresholdPoPScore';

/**
 * Returns the query key for fetching the threshold participation score.
 * @returns The query key for fetching the threshold participation score.
 */
export const getThresholdParticipationScoreQueryKey = () => {
    return getCallKey({ method, keyArgs: [] });
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

    return useCall({
        contractInterface: vePassportInterface,
        contractAddress: veBetterPassportContractAddress,
        method: 'thresholdPoPScore',
        args: [],
        enabled: !!veBetterPassportContractAddress,
    });
};
