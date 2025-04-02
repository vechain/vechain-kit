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
const method = 'getIdAttachedToNode';

export const getGetTokenIdAttachedToNodeQueryKey = (nodeId?: string) =>
    getCallKey({ method, keyArgs: [nodeId] });

/**
 * Custom hook that retrieves the GM Token ID attached to the given Vechain Node ID.
 *
 * @param nodeId - The Vechain Node ID to check for attached GM Token.
 * @param enabled - Determines whether the hook is enabled or not. Default is true.
 * @returns The GM Token ID attached to the given Vechain Node ID.
 */
export const useGetTokenIdAttachedToNode = (
    nodeId?: string,
    enabled = true,
) => {
    const { network } = useVeChainKitConfig();
    const contractAddress = getConfig(network.type).galaxyMemberContractAddress;

    return useCall({
        contractInterface,
        contractAddress,
        method,
        args: [nodeId],
        enabled: !!nodeId && enabled && !!network.type,
    });
};
