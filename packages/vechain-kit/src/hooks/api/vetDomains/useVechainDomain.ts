import { useQuery } from '@tanstack/react-query';
import { useVeChainKitConfig } from '../../../providers';
import { getAddressDomain, getDomainAddress, isValidDomain, isPrimaryDomain } from '@vechain/contract-getters';
import { isValidAddress } from '../../../utils/addressUtils';

interface VeChainDomainResult {
    address?: string;
    domain?: string;
    isValidAddressOrDomain: boolean;
    isPrimaryDomain: boolean;
}


export const getVechainDomainQueryKey = (addressOrDomain?: string | null) => [
    'VECHAIN_KIT_DOMAIN',
    addressOrDomain,
];

export const useVechainDomain = (addressOrDomain?: string | null) => {
    const { network } = useVeChainKitConfig();

    return useQuery<VeChainDomainResult>({
        queryKey: getVechainDomainQueryKey(addressOrDomain),
        queryFn: async () => {
            if (!addressOrDomain) throw new Error('Address or domain is required');
            
            // Determine input type
            const isDomain = await isValidDomain(addressOrDomain, {
                networkUrl: network.nodeUrl,
            });
            const isAddress = isValidAddress(addressOrDomain);
            
            // Validate that input is either a valid domain or valid address
            if (!isDomain && !isAddress) {
                throw new Error('Input must be a valid domain or address');
            }

            let address: string | null = null;
            let domain: string | null = null;
            let isPrimary = false;

            if (isDomain) {
                // Input is a domain, get the corresponding address
                address = await getDomainAddress(addressOrDomain, {
                    networkUrl: network.nodeUrl,
                });
                domain = addressOrDomain;
                
                // Check if this domain is the primary domain for the address
                if (address) {
                    isPrimary = await isPrimaryDomain(addressOrDomain, address, {
                        networkUrl: network.nodeUrl,
                    });
                }
            } else {
                // Input is an address, get the corresponding domain
                domain = await getAddressDomain(addressOrDomain, {
                    networkUrl: network.nodeUrl,
                });
                address = addressOrDomain;
                
                // If we found a domain, check if it's the primary domain
                if (domain) {
                    isPrimary = await isPrimaryDomain(domain, addressOrDomain, {
                        networkUrl: network.nodeUrl,
                    });
                }
            }

            return {
                address: address || undefined,
                domain: domain || undefined,
                isValidAddressOrDomain: isDomain || isAddress,
                isPrimaryDomain: isPrimary,
            };
        },
        enabled: !!addressOrDomain && !!network.type,
        retry: (failureCount, error) => {
            // Don't retry on cancellation or validation errors
            if (error instanceof Error) {
                const errorMessage = error.message.toLowerCase();
                if (errorMessage.includes('cancel') || 
                    errorMessage.includes('abort') ||
                    errorMessage === 'address or domain is required' ||
                    errorMessage === 'input must be a valid domain or address') {
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
