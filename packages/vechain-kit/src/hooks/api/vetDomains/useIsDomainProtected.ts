import { getConfig } from '@/config';
import { SubdomainClaimer__factory } from '@hooks/contracts';
import { useThor } from '@vechain/dapp-kit-react';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';
import { ThorClient } from '@vechain/sdk-network';
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

    return res[0] as boolean;
};

/**
 * Custom hook to fetch the protection status of a VeChain domain.
 *
 * @param {string} [domain] - The domain to fetch the protection status for.
 * @param {boolean} [enabled=true] - Flag to enable or disable the hook.
 * @returns The result of the useQuery hook, with the protection status.
 */
export const useIsDomainProtected = (domain?: string, enabled = true) => {
    const thor = useThor();
    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: getIsDomainProtectedQueryKey(domain),
        queryFn: () => getIsDomainProtected(thor, network.type, domain),
        enabled: !!domain && enabled && !!network.type,
        retry: (failureCount, error) => {
            // Don't retry on cancellation errors
            if (error instanceof Error) {
                const errorMessage = error.message.toLowerCase();
                if (
                    errorMessage.includes('cancel') ||
                    errorMessage.includes('abort')
                ) {
                    return false;
                }
            }
            // Retry network errors up to 2 times
            return failureCount < 2;
        },
        gcTime: 1000 * 60 * 5, // 5 minutes
        staleTime: 1000 * 60, // 1 minute
    });
};
