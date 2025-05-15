import { getConfig } from '@/config';
import { SubdomainClaimer__factory } from '@/contracts';
import { useThor } from '@vechain/dapp-kit-react2';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';
import { ThorClient } from '@vechain/sdk-network1.2';
import { useQuery } from '@tanstack/react-query';

export const getIsDomainProtectedQueryKey = (domain?: string) => [
    'VECHAIN_KIT_DOMAIN',
    domain,
    'IS_DOMAIN_PROTECTED',
];

const getIsDomainProtected = async (
    thor: ThorClient,
    network: NETWORK_TYPE,
    domain?: string,
) => {
    const contractAddress =
        getConfig(network).veWorldSubdomainClaimerContractAddress;

    const res = await thor.contracts
        .load(contractAddress, SubdomainClaimer__factory.abi)
        .read.isDomainProtected(domain);

    // TODO: migration checked it returns boolean ✅
    return res[0] as boolean;
};

/**
 * Custom hook to fetch the amount of B3TR tokens donated for a given token ID.
 *
 * @param {string} [domain] - The domain to fetch the protection status for.
 * @param {boolean} [enabled=true] - Flag to enable or disable the hook.
 * @returns The result of the useCall hook, with the donation amount formatted in Ether.
 */
export const useIsDomainProtected = (domain?: string, enabled = true) => {
    const thor = useThor();
    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: getIsDomainProtectedQueryKey(domain),
        queryFn: () =>
            getIsDomainProtected(
                thor as unknown as ThorClient,
                network.type,
                domain,
            ),
        enabled: !!domain && enabled && !!network.type,
    });
};
