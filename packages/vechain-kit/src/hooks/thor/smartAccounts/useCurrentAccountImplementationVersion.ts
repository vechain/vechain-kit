import { getConfig } from '../../../config';
import { NETWORK_TYPE } from '../../../config/network';
import { useVeChainKitConfig } from '../../../providers/VeChainKitContext';
import { SocialLoginSmartAccountFactory__factory } from '@vechain/vechain-contract-types';
import { useQuery } from '@tanstack/react-query';
import { useOptionalThor } from '../../api/dappkit/useOptionalThor';
import { ThorClient } from '@vechain/sdk-network';

export const getCurrentAccountImplementationVersion = async (
    thor: ThorClient,
    networkType?: NETWORK_TYPE,
): Promise<number> => {
    if (!networkType) throw new Error('Network type is required');

    const res = await thor.contracts
        .load(
            getConfig(networkType).accountFactoryAddress,
            SocialLoginSmartAccountFactory__factory.abi,
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
    // Use optional Thor hook that handles missing provider gracefully
    const thor = useOptionalThor();
    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: getCurrentAccountImplementationVersionQueryKey(network.type),
        queryFn: async () =>
            getCurrentAccountImplementationVersion(thor!, network.type),
        enabled: !!thor && !!network,
    });
};
