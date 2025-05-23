import { getCallClauseQueryKey, useCallClause } from '@/hooks';
import { getConfig } from '@/config';
import { VeBetterPassport__factory } from '@/contracts/typechain-types';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';

const contractAbi = VeBetterPassport__factory.abi;
const method = 'getPendingDelegations' as const;

/**
 * Returns the query key for fetching the outgoing pending delegation for a delegator.
 * @param networkType The network type.
 * @param delegator - The delegator address.
 * @returns The query key.
 */
export const getPendingDelegationsQueryKeyDelegatorPOV = (
    networkType: NETWORK_TYPE,
    delegator: string,
) => {
    return getCallClauseQueryKey({
        address: getConfig(networkType).veBetterPassportContractAddress,
        abi: contractAbi,
        method,
        args: [delegator as `0x${string}`],
    });
};

/**
 * Hook to get pending delegations from the VeBetterPassport contract.
 * @param delegator - The delegator address.
 * @returns An array of addresses representing delegators with pending delegations for the delegator.
 */
export const useGetPendingDelegationsDelegatorPOV = (
    delegator?: string | null,
) => {
    const { network } = useVeChainKitConfig();
    const veBetterPassportContractAddress = getConfig(
        network.type,
    ).veBetterPassportContractAddress;

    // VeBetter Passport get pending delegations delegator POV result: [ [], '0x0000000000000000000000000000000000000000' ]
    return useCallClause({
        address: veBetterPassportContractAddress,
        abi: contractAbi,
        method,
        args: [delegator as `0x${string}`],
        queryOptions: {
            enabled:
                !!delegator &&
                !!veBetterPassportContractAddress &&
                !!network.type,
            select: (response) => response[1] ?? null,
        },
    });
};
