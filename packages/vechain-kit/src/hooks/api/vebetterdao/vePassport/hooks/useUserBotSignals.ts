import { getCallClauseQueryKey, useCallClause } from '@/hooks';
import { getConfig } from '@/config';
import { VeBetterPassport__factory } from '@/contracts/typechain-types';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';

const contractAbi = VeBetterPassport__factory.abi;
const method = 'signaledCounter' as const;

/**
 * Returns the query key for fetching the user bot signals.
 * @param networkType The network type.
 * @param userAddress - The user address.
 * @returns The query key for fetching the user bot signals.
 */
export const getUserBotSignalsQueryKey = (
    networkType: NETWORK_TYPE,
    userAddress: string,
) => {
    return getCallClauseQueryKey({
        address: getConfig(networkType).veBetterPassportContractAddress,
        abi: contractAbi,
        method,
        args: [userAddress as `0x${string}`],
    });
};

/**
 * Hook to get the user bot signals (signaledCounter) from the VeBetterPassport contract.
 * @param userAddressInput - The user address.
 * @returns The user bot signals
 */
export const useUserBotSignals = (userAddressInput?: string) => {
    const { network } = useVeChainKitConfig();
    const veBetterPassportContractAddress = getConfig(
        network.type,
    ).veBetterPassportContractAddress;

    return useCallClause({
        address: veBetterPassportContractAddress,
        abi: contractAbi,
        method,
        args: [userAddressInput as `0x${string}`],
        queryOptions: {
            enabled:
                !!userAddressInput &&
                !!veBetterPassportContractAddress &&
                !!network.type,
            select: (res) => Number(res[0]),
        },
    });
};
