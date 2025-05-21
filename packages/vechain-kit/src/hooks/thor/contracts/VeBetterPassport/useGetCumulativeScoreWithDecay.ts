import { getCallClauseQueryKey, useCallClause } from '@/hooks';
import { getConfig } from '@/config';
import { VeBetterPassport__factory } from '@/contracts';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';
import { Address } from 'viem';

const contractAbi = VeBetterPassport__factory.abi;
const method = 'getCumulativeScoreWithDecay' as const;

/**
 * Returns the query key for fetching the cumulative score with decay.
 * @param networkType The network type.
 * @param user - The user address.
 * @param lastRound - The last round number (uint256).
 * @returns The query key for fetching the cumulative score with decay.
 */
export const getGetCumulativeScoreWithDecayQueryKey = (
    networkType: NETWORK_TYPE,
    user: Address,
    lastRound: number | string,
) => {
    return getCallClauseQueryKey({
        address: getConfig(networkType).veBetterPassportContractAddress,
        abi: contractAbi,
        method,
        args: [user, BigInt(lastRound || 0)],
    });
};

/**
 * Hook to get the cumulative score with decay from the VeBetterPassport contract.
 * @param userInput - The user address.
 * @param lastRoundInput - The last round number.
 * @returns The cumulative score with decay as number.
 */
export const useGetCumulativeScoreWithDecay = (
    userInput?: Address | null,
    lastRoundInput?: number | string,
) => {
    const { network } = useVeChainKitConfig();
    const veBetterPassportContractAddress = getConfig(
        network.type,
    ).veBetterPassportContractAddress;

    return useCallClause({
        address: veBetterPassportContractAddress,
        abi: contractAbi,
        method,
        args: [userInput!, BigInt(lastRoundInput || 0)],
        queryOptions: {
            enabled:
                !!userInput &&
                lastRoundInput !== undefined &&
                !!veBetterPassportContractAddress &&
                !!network.type,
            select: (res) => Number(res[0]),
        },
    });
};
