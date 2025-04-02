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
const method = 'getSelectedTokenId';

export const getSelectedTokenIdQueryKey = (account?: string | null) =>
    getCallKey({ method, keyArgs: [account] });

/**
 * Custom hook that retrieves the selected token ID for the selected galaxy member.
 *
 * @param address - The address of the account.
 * @param enabled - Determines whether the hook is enabled or not. Default is true.
 * @returns The selected token ID for the galaxy member.
 */
export const useSelectedTokenId = (address: string, enabled = true) => {
    const { network } = useVeChainKitConfig();
    const contractAddress = getConfig(network.type).galaxyMemberContractAddress;
    return useCall({
        contractInterface,
        contractAddress,
        method,
        args: [address],
        enabled: !!address && enabled && !!contractAddress,
    });
};
