import { getConfig } from '@/config';
import { GalaxyMember__factory } from '@vechain/vechain-contract-types';
import { getCallKey, useCall } from '@/hooks';
import { useVeChainKitConfig } from '@/providers';
import { formatEther } from 'viem';

const contractInterface = GalaxyMember__factory.createInterface();
const method = 'getB3TRtoUpgrade';

export const getB3trToUpgradeQueryKey = (tokenId?: string) =>
    getCallKey({ method, keyArgs: [tokenId] });

/**
 * Retrieves the amount of B3TR tokens required to upgrade a specific token.
 *
 * @param tokenId - The ID of the token.
 * @param enabled - Flag indicating whether the hook is enabled or not. Default is true.
 * @returns The result of the call to the contract method.
 */
export const useB3trToUpgrade = (tokenId?: string, enabled = true) => {
    const { network } = useVeChainKitConfig();
    const contractAddress = getConfig(network.type).galaxyMemberContractAddress;

    return useCall({
        contractInterface,
        contractAddress,
        method,
        args: [tokenId],
        enabled: !!tokenId && enabled && !!network.type,
        mapResponse: (res) => formatEther(res.decoded[0]),
    });
};
