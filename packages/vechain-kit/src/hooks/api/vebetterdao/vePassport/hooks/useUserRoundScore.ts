import { getCallKey, useCall, useWallet } from '@/hooks';
import { getConfig } from '@/config';
import { VeBetterPassport__factory } from '@/contracts/typechain-types';
import { useCurrentAllocationsRoundId } from '../../xAllocations';
import { useVeChainKitConfig } from '@/providers';

const vePassportInterface = VeBetterPassport__factory.createInterface();

/**
 * Returns the query key for fetching the user round score.
 * @param user - The user address.
 * @param round - The round number.
 * @returns The query key for fetching the user round score.
 */
export const getUserRoundScoreQueryKey = (user: string, round: number) => {
    return getCallKey({ method: 'userRoundScore', keyArgs: [user, round] });
};

/**
 * Hook to get the user round score from the VeBetterPassport contract.
 * @param user - The user address.
 * @param round - The round number.
 * @returns The user round score.
 */
export const useUserRoundScore = (user?: string | null, round?: number) => {
    const { network } = useVeChainKitConfig();
    const veBetterPassportContractAddress = getConfig(
        network.type,
    ).veBetterPassportContractAddress;

    return useCall({
        contractInterface: vePassportInterface,
        contractAddress: veBetterPassportContractAddress,
        method: 'userRoundScore',
        args: [user, round],
        enabled: !!user && !!round && !!veBetterPassportContractAddress,
    });
};

/**
 * Hook to get the user current round score from the VeBetterPassport contract.
 * @returns The user current round score.
 */
export const useUserCurrentRoundScore = () => {
    const { account } = useWallet();
    const { data: roundId, isLoading: isRoundIdLoading } =
        useCurrentAllocationsRoundId();
    const { data: userRoundScore, isLoading: isUserRoundScoreLoading } =
        useUserRoundScore(account.address, Number(roundId));
    return {
        data: userRoundScore,
        isLoading: isUserRoundScoreLoading || isRoundIdLoading,
    };
};
