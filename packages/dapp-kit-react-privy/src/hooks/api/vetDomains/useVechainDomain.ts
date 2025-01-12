import { useQuery } from '@tanstack/react-query';
import { useVechainDomain as useBaseVechainDomain } from '@vechain/dapp-kit-react';

interface VeChainDomainResult {
    address?: string;
    domain?: string;
    isValidAddressOrDomain: boolean;
    isLoading: boolean;
}

export const getVechainDomainQueryKey = (addressOrDomain: string) => [
    'VECHAIN_KIT_DOMAIN',
    addressOrDomain,
];

export const useVechainDomain = (addressOrDomain: string) => {
    const baseResult = useBaseVechainDomain({ addressOrDomain });

    return useQuery<VeChainDomainResult>({
        queryKey: getVechainDomainQueryKey(addressOrDomain),
        queryFn: () => baseResult,
        enabled: !!addressOrDomain,
        // Cache the domain for 24 hours
        staleTime: 24 * 60 * 60 * 1000,
        // Keep the data in cache for 24 hours
        gcTime: 24 * 60 * 60 * 1000,
    });
};
