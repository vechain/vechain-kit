import { useQuery } from '@tanstack/react-query';
import { SimpleAccountFactory__factory } from '@/contracts';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';
import { getConfig } from '@/config';
import { type ThorClient } from '@vechain/sdk-network';
import { useThor } from '@vechain/dapp-kit-react';

export const getAccountAddress = async (
    thor: ThorClient,
    ownerAddress?: string,
    networkType?: NETWORK_TYPE,
): Promise<string> => {
    if (!ownerAddress) throw new Error('Owner address is required');
    if (!networkType) throw new Error('Network type is required');

    const res = await thor.contracts
        .load(
            getConfig(networkType).accountFactoryAddress,
            SimpleAccountFactory__factory.abi,
        )
        .read.getAccountAddress(ownerAddress);

    if (!res) throw new Error('Reverted');

    return res[0].toString();
};

export const getAccountAddressQueryKey = (
    ownerAddress?: string,
    networkType?: NETWORK_TYPE,
) => [
    'VECHAIN_KIT',
    'SMART_ACCOUNT',
    'FACTORY',
    'ADDRESS',
    ownerAddress,
    networkType,
];

/**
 * Get the address of a smart account
 * @param ownerAddress - The address of the owner of the smart account
 * @returns The address of the smart account
 */
export const useGetAccountAddress = (ownerAddress?: string) => {
    const thor = useThor();
    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: getAccountAddressQueryKey(ownerAddress, network.type),
        queryFn: async () =>
            getAccountAddress(thor, ownerAddress, network.type),
        enabled: !!thor && !!ownerAddress && !!network,
    });
};
