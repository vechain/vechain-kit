import { getCallKey, useCall } from '@/hooks';
import { getConfig } from '@/config';
import { VeBetterPassport__factory } from '@/contracts/typechain-types';
import { useVeChainKitConfig } from '@/providers';
import { Interface } from 'ethers';

const contractInterface =
    VeBetterPassport__factory.createInterface() as Interface & {
        abi: readonly any[];
    };
contractInterface.abi = VeBetterPassport__factory.abi;
const method = 'isBlacklisted';

/**
 * Returns the query key for fetching the IsBlacklisted status.
 * @returns The query key for fetching the IsBlacklisted status.
 */
export const getIsBlacklistedQueryKey = (address?: string) => {
    return getCallKey({ method, keyArgs: [address] });
};

/**
 * Hook to get the IsBlacklisted status from the VeBetterPassport contract.
 * @param address - The user address.
 * @returns The IsBlacklisted status.
 */
export const useIsBlacklisted = (address?: string) => {
    const { network } = useVeChainKitConfig();
    const veBetterPassportContractAddress = getConfig(
        network.type,
    ).veBetterPassportContractAddress;

    return useCall({
        contractInterface: contractInterface,
        contractAddress: veBetterPassportContractAddress,
        method,
        args: [address ?? ''],
        enabled: !!address && !!veBetterPassportContractAddress,
    });
};
