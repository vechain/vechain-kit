import { useQuery } from '@tanstack/react-query';
import { SimpleAccountFactory__factory } from '@/contracts';
import { getConfig } from '@/config';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';
import { useThor } from '@vechain/dapp-kit-react2';
import { ThorClient } from '@vechain/sdk-network1.2';

export const getCurrentAccountImplementationVersion = async (
    thor: ThorClient,
    networkType?: NETWORK_TYPE,
): Promise<number> => {
    if (!networkType) throw new Error('Network type is required');

    const res = await thor.contracts
        .load(
            getConfig(networkType).accountFactoryAddress,
            SimpleAccountFactory__factory.abi,
        )
        .read.currentAccountImplementationVersion();

    if (!res)
        throw new Error('Failed to get current account implementation version');

    return parseInt(res[0].toString());
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
    const thor = useThor();
    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: getCurrentAccountImplementationVersionQueryKey(network.type),
        queryFn: async () =>
            getCurrentAccountImplementationVersion(
                thor as unknown as ThorClient,
                network.type,
            ),
        enabled: !!thor && !!network,
    });
};
