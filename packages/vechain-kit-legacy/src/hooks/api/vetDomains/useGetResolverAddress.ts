import { useVeChainKitConfig } from '@/providers';
import { getConfig } from '@/config';
import { useCallClause } from '@/hooks';
import { namehash } from 'viem';

const nameInterfaceAbi = [
    {
        type: 'function',
        name: 'resolver',
        inputs: [
            {
                type: 'bytes32',
                name: 'node',
                internalType: 'bytes32',
            },
        ],
        outputs: [
            {
                type: 'address',
                name: 'resolverAddress',
                internalType: 'address',
            },
        ],
        stateMutability: 'view',
    },
] as const;

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

    return useCallClause({
        address: getConfig(network.type).vetDomainsContractAddress,
        abi: nameInterfaceAbi,
        method: 'resolver',
        args: [domain ? namehash(domain) : '0x'],
        queryOptions: {
            select: (data) => data[0],
            enabled: !!domain,
        },
    });
};
