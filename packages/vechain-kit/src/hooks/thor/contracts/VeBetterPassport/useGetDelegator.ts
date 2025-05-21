import { getCallClauseQueryKey, useCallClause } from '@/hooks';
import { getConfig } from '@/config';
import { VeBetterPassport__factory } from '@/contracts';
import { compareAddresses } from '@/utils/addressUtils';
import { zeroAddress, Address } from 'viem';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';

const contractAbi = VeBetterPassport__factory.abi;
const method = 'getDelegator' as const;

/**
 * Returns the query key for fetching the delegator for a given delegatee.
 * @param networkType The network type.
 * @param delegateeAddress - The delegatee address.
 * @returns The query key.
 */
export const getDelegatorQueryKey = (
    networkType: NETWORK_TYPE,
    delegateeAddress: string,
) => {
    return getCallClauseQueryKey({
        address: getConfig(networkType).veBetterPassportContractAddress,
        abi: contractAbi,
        method,
        args: [delegateeAddress as `0x${string}`],
    });
};

/**
 * Hook to get the delegator for a given delegatee from the VeBetterPassport contract.
 * @param delegateeInput - The delegatee address.
 * @returns The address of the delegator, or null if none or zeroAddress.
 */
export const useGetDelegator = (delegateeInput?: string | null) => {
    const { network } = useVeChainKitConfig();
    const veBetterPassportContractAddress = getConfig(
        network.type,
    ).veBetterPassportContractAddress;

    return useCallClause({
        address: veBetterPassportContractAddress,
        abi: contractAbi,
        method,
        args: [delegateeInput as `0x${string}`],
        queryOptions: {
            enabled:
                !!delegateeInput &&
                !!veBetterPassportContractAddress &&
                !!network.type,
            select: (response) => {
                const delegatorAddress = response[0] as Address;
                if (compareAddresses(delegatorAddress, zeroAddress))
                    return null;
                return delegatorAddress;
            },
        },
    });
};
