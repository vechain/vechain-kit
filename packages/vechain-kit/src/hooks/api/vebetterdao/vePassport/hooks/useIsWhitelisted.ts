import { getCallKey, useCall } from '@/hooks';
import { getConfig } from '@/config';
import { VeBetterPassport__factory } from '@vechain/vechain-contract-types';
import { useVeChainKitConfig } from '@/providers';

const vePassportInterface = VeBetterPassport__factory.createInterface();
const method = 'isWhitelisted';

/**
 * Returns the query key for fetching the isWhitelisted status.
 * @returns The query key for fetching the isWhitelisted status.
 */
export const getIsWhitelistedQueryKey = (address?: string) => {
    return getCallKey({ method, keyArgs: [address] });
};

/**
 * Hook to get the isWhitelisted status from the VeBetterPassport contract.
 * @param address - The user address.
 * @returns The isWhitelisted status.
 */
export const useIsWhitelisted = (address?: string) => {
    const { network } = useVeChainKitConfig();
    const veBetterPassportContractAddress = getConfig(
        network.type,
    ).veBetterPassportContractAddress;

    return useCall({
        contractInterface: vePassportInterface,
        contractAddress: veBetterPassportContractAddress,
        method,
        args: [address ?? ''],
        enabled: !!address && !!veBetterPassportContractAddress,
    });
};
