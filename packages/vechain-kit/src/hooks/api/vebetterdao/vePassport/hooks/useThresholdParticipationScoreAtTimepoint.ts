import { getCallKey, useCall } from '@/hooks';
import { getConfig } from '@/config';
import { VeBetterPassport__factory } from '@/contracts/typechain-types';
import { useVeChainKitConfig } from '@/providers';
import { Interface } from 'ethers';

const method = 'thresholdPoPScoreAtTimepoint';

/**
 * Returns the query key for fetching the threshold participation score at a specific timepoint.
 * @param blockNumber - The block number at which to get the threshold participation score.
 * @returns The query key for fetching the threshold participation score at a specific timepoint.
 */
export const getThresholdParticipationScoreAtTimepointQueryKey = (
    blockNumber: string,
) => {
    return getCallKey({ method, keyArgs: [blockNumber] });
};

/**
 * Hook to get the threshold participation score at a specific timepoint from the VeBetterPassport contract.
 * @param blockNumber - The block number at which to get the threshold participation score.
 * @returns The threshold participation score at a specific timepoint.
 */
export const useThresholdParticipationScoreAtTimepoint = (
    blockNumber: string,
) => {
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
        method: 'thresholdPoPScoreAtTimepoint',
        args: [blockNumber],
        enabled: !!blockNumber && !!veBetterPassportContractAddress,
    });
};
