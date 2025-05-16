import { useQuery } from '@tanstack/react-query';
import { useThor } from '@vechain/dapp-kit-react';
import { getXApps } from '../getXApps';
import { useVeChainKitConfig } from '@/providers';
import { ThorClient } from '@vechain/sdk-network';

export const getXAppsQueryKey = () => ['VECHAIN_KIT', 'getXApps'];

/**
 *  Hook to get all the available xApps in the B3TR ecosystem
 * @returns all the available xApps in the B3TR ecosystem capped to 256
 */
export const useXApps = () => {
    const thor = useThor();
    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: getXAppsQueryKey(),
        queryFn: async () =>
            await getXApps(thor as unknown as ThorClient, network.type),
        enabled: !!thor && !!network.type,
    });
};
