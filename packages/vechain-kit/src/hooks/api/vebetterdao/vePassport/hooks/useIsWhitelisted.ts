import { getConfig } from '@/config';
import { VeBetterPassport__factory } from '@/contracts/typechain-types';
import { useVeChainKitConfig } from '@/providers';
import { useCallClause, getCallClauseQueryKey } from '@/hooks';
import { NETWORK_TYPE } from '@/config/network';

const contractAbi = VeBetterPassport__factory.abi;
const method = 'isWhitelisted' as const;

/**
 * Returns the query key for fetching the isWhitelisted status.
 * @param networkType - The network type.
 * @param account - The account address.
 * @returns The query key for fetching the isWhitelisted status.
 */
export const getIsWhitelistedQueryKey = (
    networkType: NETWORK_TYPE,
    account: string,
) => {
    const veBetterPassportContractAddress =
        getConfig(networkType).veBetterPassportContractAddress;
    return getCallClauseQueryKey({
        address: veBetterPassportContractAddress,
        abi: contractAbi,
        method,
        args: [account as `0x${string}`],
    });
};

/**
 * Hook to get the isWhitelisted status from the VeBetterPassport contract.
 * @param account - The account address.
 * @param customEnabled - Flag to enable or disable the hook. Default is true.
 * @returns The isWhitelisted status (boolean).
 */
export const useIsWhitelisted = (account?: string, customEnabled = true) => {
    const { network } = useVeChainKitConfig();
    const veBetterPassportContractAddress = getConfig(
        network.type,
    ).veBetterPassportContractAddress;

    return useCallClause({
        abi: contractAbi,
        address: veBetterPassportContractAddress,
        method,
        args: [account as `0x${string}`],
        queryOptions: {
            enabled:
                !!account &&
                customEnabled &&
                !!veBetterPassportContractAddress &&
                !!network.type,
            select: (data: readonly [boolean]) => data[0],
        },
    });
};
