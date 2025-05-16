import { getCallClauseQueryKey, useCallClause } from '@/hooks';
import { getConfig } from '@/config';
import { VeBetterPassport__factory } from '@/contracts/typechain-types';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';
import { Address } from 'viem';

const contractAbi = VeBetterPassport__factory.abi;
const method = 'getPendingDelegations' as const;

/**
 * Returns the query key for fetching incoming pending delegations for a delegatee.
 * @param networkType The network type.
 * @param delegatee - The delegatee address.
 * @returns The query key.
 */
export const getPendingDelegationsQueryKeyDelegateePOV = (
    networkType: NETWORK_TYPE,
    delegatee: Address,
) => {
    return getCallClauseQueryKey({
        address: getConfig(networkType).veBetterPassportContractAddress,
        abi: contractAbi,
        method,
        args: [delegatee],
    });
};

/**
 * Hook to get incoming pending delegations for a delegatee from the VeBetterPassport contract.
 * @param delegateeInput - The delegatee address.
 * @returns An array of delegator addresses with pending delegations for the delegatee.
 */
export const useGetPendingDelegationsDelegateePOV = (
    delegateeInput?: Address | null,
) => {
    const { network } = useVeChainKitConfig();
    const veBetterPassportContractAddress = getConfig(
        network.type,
    ).veBetterPassportContractAddress;

    return useCallClause({
        address: veBetterPassportContractAddress,
        abi: contractAbi,
        method,
        args: [delegateeInput!],
        queryOptions: {
            enabled:
                !!delegateeInput &&
                !!veBetterPassportContractAddress &&
                !!network.type,
            select: (response) => response[0] ?? [],
        },
    });
};
