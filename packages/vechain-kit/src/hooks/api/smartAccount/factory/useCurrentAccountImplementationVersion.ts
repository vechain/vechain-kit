import { useQuery } from '@tanstack/react-query';
import { SimpleAccountFactory__factory } from '@/contracts';
import { useConnex } from '@vechain/dapp-kit-react';
import { getConfig } from '@/config';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';

const SimpleAccountFactoryInterface =
    SimpleAccountFactory__factory.createInterface();

export const getCurrentAccountImplementationVersion = async (
    thor: Connex.Thor,
    networkType?: NETWORK_TYPE,
): Promise<number> => {
    if (!networkType) throw new Error('Network type is required');

    const functionFragment = SimpleAccountFactoryInterface.getFunction(
        'currentAccountImplementationVersion',
    ).format('json');

    const res = await thor
        .account(getConfig(networkType).accountFactoryAddress)
        .method(JSON.parse(functionFragment))
        .call();

    if (res.reverted) throw new Error('Reverted');

    return parseInt(res.decoded[0]);
};

export const getCurrentAccountImplementationVersionQueryKey = (
    networkType?: NETWORK_TYPE,
) => [
    'VECHAIN_KIT',
    'SMART_ACCOUNT',
    'FACTORY',
    'CURRENT_ACCOUNT_IMPLEMENTATION_VERSION',
    networkType,
];

/**
 * Get the current account implementation version used by the smart account factory
 * @returns The current account implementation version
 */
export const useCurrentAccountImplementationVersion = () => {
    const { thor } = useConnex();
    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: getCurrentAccountImplementationVersionQueryKey(network.type),
        queryFn: async () =>
            getCurrentAccountImplementationVersion(thor, network.type),
        enabled: !!thor && !!network,
    });
};
