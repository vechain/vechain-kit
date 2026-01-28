import { getConfig } from '../../../config';
import { NETWORK_TYPE } from '../../../config/network';
import { useVeChainKitConfig } from '@/providers';
import { SocialLoginSmartAccountFactory__factory } from '@vechain/vechain-contract-types';
import { useQuery } from '@tanstack/react-query';
import { useThor } from '@vechain/dapp-kit-react';
import { ThorClient } from '@vechain/sdk-network';

export const getAccountImplementationAddress = async (
    thor: ThorClient,
    version?: number,
    networkType?: NETWORK_TYPE,
): Promise<string> => {
    if (!networkType) throw new Error('Network type is required');
    if (!version) throw new Error('Version is required');

    const contract = thor.contracts.load(
        getConfig(networkType).accountFactoryAddress,
        SocialLoginSmartAccountFactory__factory.abi,
    );

    let implementationAddressPromise:
        | ReturnType<typeof contract.read.accountImplementationV1>
        | ReturnType<typeof contract.read.accountImplementationV3>;

    switch (version) {
        case 1:
        case 2:
            implementationAddressPromise =
                contract.read.accountImplementationV1();
            break;

        case 3:
            implementationAddressPromise =
                contract.read.accountImplementationV3();
            break;
        default:
            throw new Error('Invalid version, must be between 1 and 3');
    }

    const res = await implementationAddressPromise;

    if (!res) throw new Error('Failed to get account implementation address');

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
