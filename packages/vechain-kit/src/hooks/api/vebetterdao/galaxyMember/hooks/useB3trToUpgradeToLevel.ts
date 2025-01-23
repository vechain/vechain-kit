import { getConfig } from '@/config';
import { GalaxyMember__factory } from '@/contracts';
import { useCall } from '@/hooks';
import { useVeChainKitConfig } from '@/providers';
import { formatEther } from 'viem';

const contractInterface = GalaxyMember__factory.createInterface();
const method = 'getB3TRtoUpgradeToLevel';

/**
 * Retrieves the amount of B3TR tokens required to upgrade to a specific level for a given token ID.
 *
 * @param tokenId - The ID of the token.
 * @param enabled - Flag indicating whether the hook is enabled or not. Default is true.
 * @returns The result of the call to the contract method.
 */
export const useB3trToUpgradeToLevel = (level?: string, enabled = true) => {
    const { network } = useVeChainKitConfig();
    const contractAddress = getConfig(network.type).galaxyMemberContractAddress;

    return useCall({
        contractInterface,
        contractAddress,
        method,
        args: [level],
        enabled: !!level && enabled && !!network.type,
        mapResponse: (res) => formatEther(res.decoded[0]),
    });
};
