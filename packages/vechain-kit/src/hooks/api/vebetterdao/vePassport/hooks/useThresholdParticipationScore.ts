import { getCallKey, useCall } from '@/hooks';
import { getConfig } from '@/config';
import { VeBetterPassport__factory } from '@/contracts/typechain-types';
import { useVeChainKitConfig } from '@/providers';
import { Interface } from 'ethers';

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

    const contractInterface =
        VeBetterPassport__factory.createInterface() as Interface & {
            abi: readonly any[];
        };
    contractInterface.abi = VeBetterPassport__factory.abi;

    return useCall({
        contractInterface,
        contractAddress: veBetterPassportContractAddress,
        method: 'thresholdPoPScore',
        args: [],
        enabled: !!veBetterPassportContractAddress,
    });
};
