import { getCallKey, useCall } from '@/hooks';
import { getConfig } from '@/config';
import { VeBetterPassport__factory } from '@vechain/vechain-contract-types';
import { useVeChainKitConfig } from '@/providers';

const vePassportInterface = VeBetterPassport__factory.createInterface();

/**
 * Returns the query key for fetching the cumulative score with decay.
 * @param user - The user address.
 * @param round - The round number.
 * @returns The query key for fetching the cumulative score with decay.
 */
export const getGetCumulativeScoreWithDecayQueryKey = (
    user: string,
    round: number,
) => {
    return getCallKey({
        method: 'getCumulativeScoreWithDecay',
        keyArgs: [user, round],
    });
};

/**
 * Hook to get the cumulative score with decay from the VeBetterPassport contract.
 * @param user - The user address.
 * @param round - The round number.
 * @returns The cumulative score with decay.
 */
export const useGetCumulativeScoreWithDecay = (
    user?: string | null,
    round?: number,
) => {
    const { network } = useVeChainKitConfig();
    const veBetterPassportContractAddress = getConfig(
        network.type,
    ).veBetterPassportContractAddress;
    return useCall({
        contractInterface: vePassportInterface,
        contractAddress: veBetterPassportContractAddress,
        method: 'getCumulativeScoreWithDecay',
        args: [user, round],
        enabled: !!user && !!round && !!veBetterPassportContractAddress,
    });
};
