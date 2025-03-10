import { useQuery } from '@tanstack/react-query';
import { SimpleAccountFactory__factory } from '@/contracts';
import { useConnex } from '@vechain/dapp-kit-react';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';
import { getConfig } from '@/config';

const SimpleAccountFactoryInterface =
    SimpleAccountFactory__factory.createInterface();

export const getHasV1SmartAccount = async (
    thor: Connex.Thor,
    ownerAddress?: string,
    networkType?: NETWORK_TYPE,
): Promise<boolean> => {
    if (!ownerAddress) throw new Error('Owner address is required');
    if (!networkType) throw new Error('Network type is required');

    const functionFragment =
        SimpleAccountFactoryInterface.getFunction('hasLegacyAccount').format(
            'json',
        );

    const res = await thor
        .account(getConfig(networkType).accountFactoryAddress)
        .method(JSON.parse(functionFragment))
        .call(ownerAddress);

    if (res.reverted) throw new Error('Reverted');

    return res.decoded[0];
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
    const { thor } = useConnex();
    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: getHasV1SmartAccountQueryKey(ownerAddress, network.type),
        queryFn: async () =>
            getHasV1SmartAccount(thor, ownerAddress, network.type),
        enabled: !!thor && !!ownerAddress && !!network,
    });
};
