import { useQuery } from '@tanstack/react-query';
import { useThor } from '@vechain/dapp-kit-react';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';
import { getConfig } from '@/config';
import { isAddress } from 'ethers';
import { type ThorClient } from '@vechain/sdk-network';
import { ZERO_ADDRESS } from '@vechain/sdk-core';
import { executeCallClause } from '@/utils';

interface VeChainDomainResult {
    address?: string;
    domain?: string;
    isValidAddressOrDomain: boolean;
    isPrimaryDomain: boolean;
}

const getAddressesABI = [
    {
        inputs: [{ internalType: 'string[]', name: 'names', type: 'string[]' }],
        name: 'getAddresses',
        outputs: [
            { internalType: 'address[]', name: 'addresses', type: 'address[]' },
        ],
        stateMutability: 'view',
        type: 'function',
    },
] as const;

const resolverABI = [
    {
        inputs: [
            { internalType: 'address[]', name: 'addresses', type: 'address[]' },
        ],
        name: 'getNames',
        outputs: [
            { internalType: 'string[]', name: 'names', type: 'string[]' },
        ],
        stateMutability: 'view',
        type: 'function',
    },
] as const;

export const fetchVechainDomain = async (
    thor: ThorClient,
    networkType: NETWORK_TYPE,
    addressOrDomain?: string | null,
): Promise<VeChainDomainResult> => {
    if (!addressOrDomain) {
        return {
            address: undefined,
            domain: undefined,
            isValidAddressOrDomain: false,
            isPrimaryDomain: false,
        };
    }

    if (isAddress(addressOrDomain)) {
        try {
            const res = await executeCallClause({
                thor,
                contractAddress: getConfig(networkType).vnsResolverAddress,
                abi: resolverABI,
                method: 'getNames',
                args: [[addressOrDomain as `0x${string}`]],
            });
            const domainName = res[0][0];

            return {
                address: addressOrDomain,
                domain: domainName || undefined,
                isValidAddressOrDomain: true,
                isPrimaryDomain: true,
            };
        } catch (err) {
            console.error('Error getting domain: ', err);
            return {
                address: addressOrDomain,
                domain: undefined,
                isValidAddressOrDomain: true,
                isPrimaryDomain: false,
            };
        }
    }

    // Otherwise, if the addressOrDomain is a domain, we need to get the address
    try {
        const res = await executeCallClause({
            thor,
            contractAddress: getConfig(networkType).vnsResolverAddress,
            abi: getAddressesABI,
            method: 'getAddresses',
            args: [[addressOrDomain]],
        });
        const domainAddress = res[0][0];

        // Domain could exist, but it is not pointing to an address
        if (domainAddress === ZERO_ADDRESS) {
            return {
                address: undefined,
                domain: undefined,
                isValidAddressOrDomain: false,
                isPrimaryDomain: false,
            };
        }

        // Get the primary domain
        const primaryDomainRes = await executeCallClause({
            thor,
            contractAddress: getConfig(networkType).vnsResolverAddress,
            abi: resolverABI,
            method: 'getNames',
            args: [[domainAddress]],
        });
        const primaryDomain = primaryDomainRes[0][0];

        return {
            address: domainAddress,
            domain: addressOrDomain,
            isValidAddressOrDomain: true,
            isPrimaryDomain: primaryDomain === addressOrDomain,
        };
    } catch (err) {
        console.error('Error getting address: ', err);
        return {
            address: undefined,
            domain: undefined,
            isValidAddressOrDomain: false,
            isPrimaryDomain: false,
        };
    }
};

export const getVechainDomainQueryKey = (addressOrDomain?: string | null) => [
    'VECHAIN_KIT_DOMAIN',
    addressOrDomain,
];

export const useVechainDomain = (addressOrDomain?: string | null) => {
    const thor = useThor();
    const { network } = useVeChainKitConfig();

    return useQuery<VeChainDomainResult>({
        queryKey: getVechainDomainQueryKey(addressOrDomain),
        queryFn: () => fetchVechainDomain(thor, network.type, addressOrDomain),
        enabled: !!thor && !!addressOrDomain,
    });
};
