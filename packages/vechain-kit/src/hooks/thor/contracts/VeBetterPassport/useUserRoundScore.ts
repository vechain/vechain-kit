import { getCallClauseQueryKey, useCallClause } from '@/hooks';
import { getConfig } from '@/config';
import { VeBetterPassport__factory } from '@/contracts/typechain-types';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';

const contractAbi = VeBetterPassport__factory.abi;
const method = 'userRoundScore' as const;

/**
 * Returns the query key for fetching the user round score.
 * @param networkType The network type.
 * @param userAddress - The user address.
 * @param round - The round number.
 * @returns The query key.
 */
export const getUserRoundScoreQueryKey = (
    networkType: NETWORK_TYPE,
    userAddress: string,
    round: number | string,
) => {
    return getCallClauseQueryKey<typeof contractAbi>({
        address: getConfig(networkType).veBetterPassportContractAddress,
        method,
        args: [userAddress as `0x${string}`, BigInt(round || 0)],
    });
};

/**
 * Hook to get the user round score from the VeBetterPassport contract.
 * @param userAddressInput - The address of the account.
 * @param roundInput - The round number.
 * @returns The user round score
 */
export const useUserRoundScore = (
    userAddressInput?: string,
    roundInput?: number | string,
) => {
    const { network } = useVeChainKitConfig();
    const veBetterPassportContractAddress = getConfig(
        network.type,
    ).veBetterPassportContractAddress;

    // VeBetter Passport user round score result: [ 0n ]
    return useCallClause({
        address: veBetterPassportContractAddress,
        abi: contractAbi,
        method,
        args: [userAddressInput as `0x${string}`, BigInt(roundInput || 0)],
        queryOptions: {
            enabled:
                !!userAddressInput &&
                roundInput !== undefined &&
                !!veBetterPassportContractAddress &&
                !!network.type,
            select: (res) => Number(res[0]),
        },
    });
};
