import { getCallKey, useCall } from '@/hooks';
import { getConfig } from '@/config';
import { VeBetterPassport__factory } from '@/contracts/typechain-types';
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
 * @param address - The address of the account.
 * @param round - The round number.
 * @returns The user round score.
 */
export const useUserRoundScore = (address?: string, round?: number) => {
    const { network } = useVeChainKitConfig();
    const veBetterPassportContractAddress = getConfig(
        network.type,
    ).veBetterPassportContractAddress;

    return useCall({
        contractInterface: vePassportInterface,
        contractAddress: veBetterPassportContractAddress,
        method: 'userRoundScore',
        args: [address, round],
        enabled: !!address && !!round && !!veBetterPassportContractAddress,
    });
};
