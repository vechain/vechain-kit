import { getConfig } from '@/config';
import { X2EarnApps__factory } from '@/contracts';
import { getCallKey, useCall } from '@/hooks';
import { useVeChainKitConfig } from '@/providers';
import { Interface } from 'ethers';

/**
 * Returns the cooldown status of an X-Node.
 * @param nodeId - The ID of the X-Node.
 * @returns The cooldown status of the X-Node.
 */
const contractInterface = X2EarnApps__factory.createInterface() as Interface & {
    abi: readonly any[];
};
contractInterface.abi = X2EarnApps__factory.abi;
const method = 'checkCooldown';

export const getNodeCheckCooldownQueryKey = (nodeId: string) =>
    getCallKey({ method, keyArgs: [nodeId] });

export const useXNodeCheckCooldown = (nodeId: string) => {
    const { network } = useVeChainKitConfig();
    const contractAddress = getConfig(
        network.type,
    ).nodeManagementContractAddress;
    return useCall({
        contractInterface,
        contractAddress,
        method,
        args: [nodeId],
        enabled: !!nodeId,
    });
};
