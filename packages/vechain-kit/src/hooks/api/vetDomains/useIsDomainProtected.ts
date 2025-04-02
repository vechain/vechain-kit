import { getConfig } from '@/config';
import { SubdomainClaimer__factory } from '@/contracts';
import { getCallKey, useCall } from '@/hooks';
import { useVeChainKitConfig } from '@/providers';
import { Interface } from 'ethers';

const contractInterface =
    SubdomainClaimer__factory.createInterface() as Interface & {
        abi: readonly any[];
    };
contractInterface.abi = SubdomainClaimer__factory.abi;
const method = 'isDomainProtected';

export const getIsDomainProtectedQueryKey = (domain?: string) =>
    getCallKey({ method, keyArgs: [domain] });

/**
 * Custom hook to fetch the amount of B3TR tokens donated for a given token ID.
 *
 * @param {string} [domain] - The domain to fetch the protection status for.
 * @param {boolean} [enabled=true] - Flag to enable or disable the hook.
 * @returns The result of the useCall hook, with the donation amount formatted in Ether.
 */
export const useIsDomainProtected = (domain?: string, enabled = true) => {
    const { network } = useVeChainKitConfig();
    const contractAddress = getConfig(
        network.type,
    ).veWorldSubdomainClaimerContractAddress;
    return useCall({
        contractInterface,
        contractAddress,
        method,
        args: [domain],
        enabled: !!domain && enabled && !!network.type,
        mapResponse: (res) => res.decoded[0],
    });
};
