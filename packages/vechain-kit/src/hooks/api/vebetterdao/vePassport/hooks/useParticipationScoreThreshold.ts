import { getConfig } from '@/config';
import { VeBetterPassport__factory } from '@/contracts/typechain-types';
import { getCallKey, useCall } from '@/hooks';
import { useVeChainKitConfig } from '@/providers';
import { Interface } from 'ethers';

const contractInterface =
    VeBetterPassport__factory.createInterface() as Interface & {
        abi: readonly any[];
    };
contractInterface.abi = VeBetterPassport__factory.abi;
const method = 'thresholdPoPScore';

export const getParticipationScoreThresholdQueryKey = () => {
    return getCallKey({ method, keyArgs: [] });
};

/**
 * Hook to get the participation score threshold from the VeBetterPassport contract
 * @returns the participation score threshold as a number
 */
export const useParticipationScoreThreshold = () => {
    const { network } = useVeChainKitConfig();
    const veBetterPassportContractAddress = getConfig(
        network.type,
    ).veBetterPassportContractAddress;

    return useCall({
        contractInterface,
        contractAddress: veBetterPassportContractAddress,
        method,
        args: [],
        enabled: !!veBetterPassportContractAddress,
    });
};
