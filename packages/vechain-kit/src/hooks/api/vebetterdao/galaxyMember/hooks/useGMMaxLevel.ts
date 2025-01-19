import { getConfig } from '@/config';
import { GalaxyMember__factory } from '@/contracts';
import { getCallKey, useCall } from '@/hooks';
import { useVeChainKitConfig } from '@/providers';

const contractInterface = GalaxyMember__factory.createInterface();
const method = 'MAX_LEVEL';

export const getGMMaxLevelQueryKey = () => getCallKey({ method });

/**
 * Custom hook that retrieves the maximum level of the Galaxy Member NFT.
 *
 * @param enabled - Determines whether the hook is enabled or not. Default is true.
 * @returns The maximum level of the Galaxy Member NFT.
 */
export const useGMMaxLevel = (enabled = true) => {
    const { network } = useVeChainKitConfig();
    const contractAddress = getConfig(network.type).galaxyMemberContractAddress;

    return useCall({
        contractInterface,
        contractAddress,
        method,
        args: [],
        enabled: enabled && !!network.type,
    });
};
