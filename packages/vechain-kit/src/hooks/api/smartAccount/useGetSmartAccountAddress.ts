import { useQuery } from '@tanstack/react-query';
import { SimpleAccountFactory__factory } from '@/contracts';
import { useConnex } from '@vechain/dapp-kit-react';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';
import { getConfig } from '@/config';

const SimpleAccountFactoryInterface =
    SimpleAccountFactory__factory.createInterface();

export const getSmartAccountAddress = async (
    thor: Connex.Thor,
    ownerAddress?: string,
    networkType?: NETWORK_TYPE,
): Promise<string> => {
    if (!ownerAddress) throw new Error('Owner address is required');
    if (!networkType) throw new Error('Network type is required');

    const functionFragment =
        SimpleAccountFactoryInterface.getFunction('getAccountAddress').format(
            'json',
        );

    const res = await thor
        .account(getConfig(networkType).accountFactoryAddress)
        .method(JSON.parse(functionFragment))
        .call(ownerAddress);

    if (res.reverted) throw new Error('Reverted');

    return res.decoded[0];
};

export const getSmartAccountAddressQueryKey = (
    ownerAddress?: string,
    networkType?: NETWORK_TYPE,
) => ['VECHAIN_KIT', 'SMART_ACCOUNT', 'ADDRESS', ownerAddress, networkType];

/**
 * Get the address of a smart account
 * @param ownerAddress - The address of the owner of the smart account
 * @returns The address of the smart account
 */
export const useGetSmartAccountAddress = (ownerAddress?: string) => {
    const { thor } = useConnex();
    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: getSmartAccountAddressQueryKey(ownerAddress, network.type),
        queryFn: async () =>
            getSmartAccountAddress(thor, ownerAddress, network.type),
        enabled: !!thor && !!ownerAddress && !!network,
    });
};
