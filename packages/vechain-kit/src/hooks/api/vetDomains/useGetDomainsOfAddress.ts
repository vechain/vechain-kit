import { getConfig } from '@/config';
import { NETWORK_TYPE } from '@/config/network';
import { useVeChainKitConfig } from '@/providers';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

// Schema for the domain response
const DomainSchema = z.object({
    name: z.string(),
});

const DomainsResponseSchema = z.object({
    domains: z.array(DomainSchema),
});

export type Domain = z.infer<typeof DomainSchema>;
export type DomainsResponse = z.infer<typeof DomainsResponseSchema>;

/**
 * Fetches all domains owned by an address
 * @param networkType The network type
 * @param address The owner's address
 * @param parentDomain The parent domain (e.g., "veworld.vet")
 * @returns The domains owned by the address
 */
export const getDomainsOfAddress = async (
    networkType: NETWORK_TYPE,
    address?: string,
    parentDomain = 'vet',
): Promise<DomainsResponse> => {
    if (!address) throw new Error('Address is required');

    const graphQlIndexerUrl = getConfig(networkType).graphQlIndexerUrl;

    const query = `query Registrations {
        domains(
            where: {owner: "${address.toLowerCase()}", parent_: {name: "${parentDomain}"}}
        ) {
            name
        }
    }`;

    const response = await fetch(graphQlIndexerUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify({
            operationName: 'Registrations',
            query,
            extensions: {},
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to fetch domains');
    }

    const json = await response.json();
    return DomainsResponseSchema.parse(json.data);
};

export const getDomainsOfAddressQueryKey = (
    address?: string,
    parentDomain?: string,
) => ['VECHAIN_KIT', 'VET_DOMAINS', address, parentDomain];

/**
 * Hook to fetch all domains owned by an address
 * @param address The owner's address
 * @param parentDomain The parent domain (e.g., "veworld.vet")
 * @returns The domains owned by the address
 */
export const useGetDomainsOfAddress = (
    address?: string,
    parentDomain?: string,
) => {
    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: getDomainsOfAddressQueryKey(address, parentDomain),
        queryFn: () => getDomainsOfAddress(network.type, address, parentDomain),
        enabled: !!address && !!network.type,
    });
};
