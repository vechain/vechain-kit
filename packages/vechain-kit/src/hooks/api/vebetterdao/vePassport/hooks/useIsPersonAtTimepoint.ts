import { getConfig } from '@/config';
import { VeBetterPassport__factory } from '@/contracts/typechain-types';
import { useVeChainKitConfig } from '@/providers';
import { useCallClause, getCallClauseQueryKey } from '@/hooks';
import { NETWORK_TYPE } from '@/config/network';
import { Address } from 'viem';
import { ZERO_ADDRESS } from '@vechain/sdk-core1.2';

const contractAbi = VeBetterPassport__factory.abi;
const method = 'isPersonAtTimepoint' as const;

/**
 * Returns the query key for fetching the isPerson status at a given block number.
 * @param networkType - The network type.
 * @param user - The user address.
 * @param timepoint - The block number (as a string or number).
 * @returns The query key for fetching the isPerson status at a given block number.
 */
export const getIsPersonAtTimepointQueryKey = (
    networkType: NETWORK_TYPE,
    user: Address,
    timepoint: string, // Will be converted to Number for args
) => {
    const veBetterPassportContractAddress =
        getConfig(networkType).veBetterPassportContractAddress;
    return getCallClauseQueryKey({
        address: veBetterPassportContractAddress,
        abi: contractAbi,
        method,
        args: [user, Number(timepoint)],
    });
};

/**
 * Hook to get the isPerson status from the VeBetterPassport contract at a specific timepoint.
 * @param user - The user address.
 * @param timepoint - The block number (as a string or number).
 * @param customEnabled - Flag to enable or disable the hook. Default is true.
 * @returns The isPerson status (boolean) at a given block number.
 */
export const useIsPersonAtTimepoint = (
    user?: Address,
    timepoint?: string,
    customEnabled = true,
) => {
    const { network } = useVeChainKitConfig();
    const veBetterPassportContractAddress = getConfig(
        network.type,
    ).veBetterPassportContractAddress;

    return useCallClause({
        abi: contractAbi,
        address: veBetterPassportContractAddress,
        method,
        args: [user ?? ZERO_ADDRESS, timepoint ? Number(timepoint) : 0],
        queryOptions: {
            enabled:
                !!user &&
                timepoint !== undefined &&
                customEnabled &&
                !!veBetterPassportContractAddress &&
                !!network.type,
            // Assuming it returns [boolean, string] like isPerson based on typical patterns
            select: (data: readonly [boolean, string]) => data[0],
        },
    });
};
