import { useQuery } from '@tanstack/react-query';
import { SimpleAccountFactory__factory } from '@/contracts';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';
import { getConfig } from '@/config';
import { type ThorClient } from '@vechain/sdk-network';
import { useThor } from '@vechain/dapp-kit-react';

export const getHasV1SmartAccount = async (
    thor: ThorClient,
    ownerAddress?: string,
    networkType?: NETWORK_TYPE,
): Promise<boolean> => {
    if (!ownerAddress) throw new Error('Owner address is required');
    if (!networkType) throw new Error('Network type is required');

    const res = await thor.contracts
        .load(
            getConfig(networkType).accountFactoryAddress,
            SimpleAccountFactory__factory.abi,
        )
        .read.hasLegacyAccount(ownerAddress);

    if (!res) throw new Error('Reverted');

    return res[0] === true;
};

export const getHasV1SmartAccountQueryKey = (
    ownerAddress?: string,
    networkType?: NETWORK_TYPE,
) => [
    'VECHAIN_KIT',
    'SMART_ACCOUNT',
    'HAS_V1_SMART_ACCOUNT',
    ownerAddress,
    networkType,
];

/**
 * Check if a smart account has a v1 smart account
 * @param ownerAddress - The address of the owner of the smart account
 * @returns True if the smart account has a v1 smart account, false otherwise
 */
export const useHasV1SmartAccount = (ownerAddress?: string) => {
    const thor = useThor();
    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: getHasV1SmartAccountQueryKey(ownerAddress, network.type),
        queryFn: async () =>
            getHasV1SmartAccount(thor, ownerAddress, network.type),
        enabled: !!thor && !!ownerAddress && !!network,
    });
};
