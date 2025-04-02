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
const method = 'getNodeIdAttached';

export const getNodeIdAttachedQueryKey = (tokenId?: string) =>
    getCallKey({ method, keyArgs: [tokenId] });

/**
 * Custom hook that retrieves the Vechain Node Token ID attached to the given GM Token ID.
 *
 * @param tokenId - The GM Token ID to check for attached node.
 * @returns The Vechain Node Token ID attached to the given GM Token ID.
 */
export const useGetNodeIdAttached = (tokenId: string | null) => {
    const { network } = useVeChainKitConfig();
    const contractAddress = getConfig(network.type).galaxyMemberContractAddress;

    return useCall({
        contractInterface,
        contractAddress,
        method,
        args: [tokenId],
        enabled: !!tokenId && !!network.type,
    });
};
