import { getConfig } from '@/config';
import { useVeChainKitConfig } from '@/providers';

export const useGetNodeUrl = () => {
    const { network } = useVeChainKitConfig();
    // If user has set a nodeUrl, use it, otherwise use the default nodeUrl for the network
    return network.nodeUrl ?? getConfig(network.type).nodeUrl;
};
