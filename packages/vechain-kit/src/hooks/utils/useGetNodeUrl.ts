import { getConfig } from '../../config';
// Direct import to avoid circular dependency (providers barrel re-exports hooks)
import { useVeChainKitConfig } from '../../providers/VeChainKitProvider';

export const useGetNodeUrl = () => {
    const { network } = useVeChainKitConfig();
    // If user has set a nodeUrl, use it, otherwise use the default nodeUrl for the network
    return network.nodeUrl ?? getConfig(network.type).nodeUrl;
};
