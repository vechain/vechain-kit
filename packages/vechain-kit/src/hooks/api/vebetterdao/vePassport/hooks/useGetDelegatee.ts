import { getCallClauseQueryKey, useCallClause } from '@/hooks';
import { getConfig } from '@/config';
import { VeBetterPassport__factory } from '@/contracts/typechain-types';
import { zeroAddress, Address } from 'viem';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';
import { compareAddresses } from '@/utils/addressUtils';

const contractAbi = VeBetterPassport__factory.abi;
const method = 'getDelegatee' as const;

/**
 * Returns the query key for fetching the delegatee for a given delegator.
 * @param networkType The network type.
 * @param delegator - The delegator address.
 * @returns The query key.
 */
export const getDelegateeQueryKey = (
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
 * Hook to get the delegatee from the VeBetterPassport contract.
 * @param delegatorInput - The delegator address.
 * @returns The address of the delegatee, or null if none or zeroAddress.
 */
export const useGetDelegatee = (delegatorInput?: string | null) => {
    const { network } = useVeChainKitConfig();
    const veBetterPassportContractAddress = getConfig(
        network.type,
    ).veBetterPassportContractAddress;

    return useCallClause({
        address: veBetterPassportContractAddress,
        abi: contractAbi,
        method,
        args: [delegatorInput as `0x${string}`],
        queryOptions: {
            enabled:
                !!delegatorInput &&
                !!veBetterPassportContractAddress &&
                !!network.type,
            select: (response) => {
                const delegateeAddress = response[0] as Address;
                if (compareAddresses(delegateeAddress, zeroAddress))
                    return null;
                return delegateeAddress;
            },
        },
    });
};
