import { getConfig } from '@/config';
import { GalaxyMember__factory } from '@/contracts';
import { getCallKey, useCall } from '@/hooks';
import { useVeChainKitConfig } from '@/providers';
import { Interface } from 'ethers';

const contractInterface =
    GalaxyMember__factory.createInterface() as Interface & {
        abi: readonly any[];
    };
contractInterface.abi = GalaxyMember__factory.abi;
const method = 'levelOf';

export const getLevelOfTokenQueryKey = (tokenId?: string) =>
    getCallKey({ method, keyArgs: [tokenId] });

/**
 * Custom hook that retrieves the level of the specified token.
 *
 * @param tokenId - The token ID to retrieve the level for.
 * @param enabled - Determines whether the hook is enabled or not. Default is true.
 * @returns The level of the specified token.
 */
export const useLevelOfToken = (tokenId?: string, enabled = true) => {
    const { network } = useVeChainKitConfig();
    const contractAddress = getConfig(network.type).galaxyMemberContractAddress;

    return useCall({
        contractInterface,
        contractAddress,
        method,
        args: [tokenId],
        enabled: !!tokenId && enabled && !!network.type,
    });
};
