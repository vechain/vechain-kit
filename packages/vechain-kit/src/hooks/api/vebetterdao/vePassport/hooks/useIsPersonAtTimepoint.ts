import { getCallKey, useCall } from '@/hooks';
import { getConfig } from '@/config';
import { VeBetterPassport__factory } from '@/contracts/typechain-types';
import { useVeChainKitConfig } from '@/providers';
import { Interface } from 'ethers';

/**
 * Returns the query key for fetching the isPerson status at a given block number.
 * @param user - The user address.
 * @param blockNumber - The block number.
 * @returns The query key for fetching the isPerson status at a given block number.
 */
export const getIsPersonAtTimepointQueryKey = (
    user: string,
    blockNumber: string,
) => {
    return getCallKey({
        method: 'isPersonAtTimepoint',
        keyArgs: [user, blockNumber],
    });
};

/**
 * Hook to get the isPerson status from the VeBetterPassport contract.
 * @param user - The user address.
 * @param blockNumber - The block number.
 * @returns The isPerson status at a given block number.
 */
export const useIsPersonAtTimepoint = (
    user?: string | null,
    blockNumber?: string | null,
) => {
    const { network } = useVeChainKitConfig();
    const veBetterPassportContractAddress = getConfig(
        network.type,
    ).veBetterPassportContractAddress;

    const contractInterface =
        VeBetterPassport__factory.createInterface() as Interface & {
            abi: readonly any[];
        };
    contractInterface.abi = VeBetterPassport__factory.abi;

    return useCall({
        contractInterface,
        contractAddress: veBetterPassportContractAddress,
        method: 'isPersonAtTimepoint',
        args: [user, blockNumber],
        enabled: !!user && !!blockNumber && !!veBetterPassportContractAddress,
    });
};
