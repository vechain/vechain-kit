import { useQuery } from '@tanstack/react-query';
import { SimpleAccountFactory__factory } from '@/contracts';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';
import { getConfig } from '@/config';
import { type ThorClient } from '@vechain/sdk-network';
import { useThor } from '@vechain/dapp-kit-react';

export const getAccountImplementationAddress = async (
    thor: ThorClient,
    version?: number,
    networkType?: NETWORK_TYPE,
): Promise<string> => {
    if (!networkType) throw new Error('Network type is required');
    if (!version) throw new Error('Version is required');

    const contract = thor.contracts.load(
        getConfig(networkType).accountFactoryAddress,
        SimpleAccountFactory__factory.abi,
    );

    let res;

    switch (version) {
        case 1:
            res = await contract.read.accountImplementationV1();
            break;
        case 2:
            res = await contract.read.accountImplementationV1();
            break;
        case 3:
            res = await contract.read.accountImplementationV3();
            break;
        default:
            throw new Error('Invalid version, must be between 1 and 3');
    }

    if (!res) throw new Error('Reverted');

    return res[0].toString();
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
    const thor = useThor();
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
