import { Interface, namehash } from 'ethers';
import { useQuery } from '@tanstack/react-query';
import { useVeChainKitConfig } from '@/providers';
import { getConfig } from '@/config';
import { NETWORK_TYPE } from '@/config/network';

const nameInterface = new Interface([
    'function resolver(bytes32 node) returns (address resolverAddress)',
]);

/**
 * Get resolver address for a VET domain from the contract
 * @param nodeUrl The node URL to query
 * @param network The network type
 * @param domain The domain to get resolver for
 * @returns The resolver address for the domain
 */
export const getResolverAddress = async (
    nodeUrl: string,
    network: NETWORK_TYPE,
    domain?: string,
): Promise<string> => {
    if (!domain) throw new Error('Domain is required');

    const node = namehash(domain);

    const resolverResponse = await fetch(`${nodeUrl}/accounts/*`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
            clauses: [
                {
                    to: getConfig(network).vetDomainsContractAddress,
                    data: nameInterface.encodeFunctionData('resolver', [node]),
                },
            ],
        }),
    });

    const [{ data: resolverData, reverted: noResolver }] =
        await resolverResponse.json();

    if (noResolver) throw new Error('Failed to get resolver address');

    const { resolverAddress } = nameInterface.decodeFunctionResult(
        'resolver',
        resolverData,
    );

    return resolverAddress;
};

export const getResolverAddressQueryKey = (domain?: string) => [
    'VECHAIN_KIT',
    'RESOLVER_ADDRESS',
    domain,
];

/**
 * Hook to get resolver address for a VET domain
 * @param domain The domain to get resolver for
 * @returns The resolver address for the domain
 */
export const useGetResolverAddress = (domain?: string) => {
    const { network } = useVeChainKitConfig();
    const nodeUrl = network.nodeUrl ?? getConfig(network.type).nodeUrl;

    return useQuery({
        queryKey: getResolverAddressQueryKey(domain),
        queryFn: () => getResolverAddress(nodeUrl, network.type, domain),
        enabled: !!domain && !!nodeUrl && !!network.type,
    });
};
