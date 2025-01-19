import { getConfig } from '@/config';
import { useWallet } from '@/hooks';
import { GalaxyMember__factory } from '@/contracts';
import { getCallKey, useCall } from '@/hooks';
import { useVeChainKitConfig } from '@/providers';

const contractInterface = GalaxyMember__factory.createInterface();
const method = 'getSelectedTokenId';

export const getSelectedTokenIdQueryKey = (account?: string | null) =>
    getCallKey({ method, keyArgs: [account] });

/**
 * Custom hook that retrieves the selected token ID for the selected galaxy member.
 *
 * @param enabled - Determines whether the hook is enabled or not. Default is true.
 * @returns The selected token ID for the galaxy member.
 */
export const useSelectedTokenId = (enabled = true) => {
    const { account } = useWallet();
    const { network } = useVeChainKitConfig();
    const contractAddress = getConfig(network.type).galaxyMemberContractAddress;
    return useCall({
        contractInterface,
        contractAddress,
        method,
        args: [account.address],
        enabled: !!account.address && enabled && !!contractAddress,
    });
};
