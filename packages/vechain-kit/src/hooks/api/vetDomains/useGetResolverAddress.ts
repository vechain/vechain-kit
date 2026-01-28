import { useVeChainKitConfig } from '@/providers';
import { getConfig } from '../../../config';
import { useCallClause } from '../../';
import { namehash } from 'viem';
import { VetDomainsRegistry__factory } from '@vechain/vechain-contract-types';


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
        abi: VetDomainsRegistry__factory.abi,
        method: 'resolver',
        args: [domain ? namehash(domain) : '0x'],
        queryOptions: {
            select: (data) => data[0],
            enabled: !!domain,
        },
    });
};
