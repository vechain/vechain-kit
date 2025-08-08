import { useQuery } from '@tanstack/react-query';
import { SimpleAccountFactory__factory } from '@vechain/vechain-contract-types';
import { useConnex } from '@vechain/dapp-kit-react';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';
import { getConfig } from '@/config';

const SimpleAccountFactoryInterface =
    SimpleAccountFactory__factory.createInterface();

export const getAccountImplementationAddress = async (
    thor: Connex.Thor,
    version?: number,
    networkType?: NETWORK_TYPE,
): Promise<string> => {
    if (!networkType) throw new Error('Network type is required');
    if (!version) throw new Error('Version is required');

    let functionFragment: string;

    switch (version) {
        case 1:
            functionFragment = SimpleAccountFactoryInterface.getFunction(
                'accountImplementationV1',
            ).format('json');
            break;
        case 2:
            functionFragment = SimpleAccountFactoryInterface.getFunction(
                'accountImplementationV1',
            ).format('json');
            break;
        case 3:
            functionFragment = SimpleAccountFactoryInterface.getFunction(
                'accountImplementationV3',
            ).format('json');
            break;
        default:
            throw new Error('Invalid version, must be between 1 and 3');
    }

    const res = await thor
        .account(getConfig(networkType).accountFactoryAddress)
        .method(JSON.parse(functionFragment))
        .call();

    if (res.reverted) throw new Error('Reverted');

    return res.decoded[0];
};

export const getAccountImplementationAddressQueryKey = (
    version?: number,
    networkType?: NETWORK_TYPE,
) => [
    'VECHAIN_KIT',
    'SMART_ACCOUNT',
    'FACTORY',
    'IMPLEMENTATION_ADDRESS',
    version,
    networkType,
];

/**
 * Get the address of a smart account implementation for a given version
 * @param version - The version of the smart account implementation
 * @returns The address of the smart account implementation
 */
export const useAccountImplementationAddress = (version?: number) => {
    const { thor } = useConnex();
    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: getAccountImplementationAddressQueryKey(
            version,
            network.type,
        ),
        queryFn: async () =>
            getAccountImplementationAddress(thor, version, network.type),
        enabled: !!thor && !!version && !!network,
    });
};
