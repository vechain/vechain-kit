import { useQuery } from '@tanstack/react-query';
import { useConnex } from '@vechain/dapp-kit-react';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';
import { getConfig } from '@/config';
import { isAddress } from 'ethers';

interface VeChainDomainResult {
    address?: string;
    domain?: string;
    isValidAddressOrDomain: boolean;
    isPrimaryDomain: boolean;
}

const getAddressesABI = {
    inputs: [{ internalType: 'string[]', name: 'names', type: 'string[]' }],
    name: 'getAddresses',
    outputs: [
        { internalType: 'address[]', name: 'addresses', type: 'address[]' },
    ],
    stateMutability: 'view',
    type: 'function',
};

const getNamesABI = {
    inputs: [
        { internalType: 'address[]', name: 'addresses', type: 'address[]' },
    ],
    name: 'getNames',
    outputs: [{ internalType: 'string[]', name: 'names', type: 'string[]' }],
    stateMutability: 'view',
    type: 'function',
};

export const fetchVechainDomain = async (
    thor: Connex.Thor,
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
            const res = await thor
                .account(getConfig(networkType).vnsResolverAddress)
                .method(getNamesABI)
                .call([addressOrDomain]);

            const domainName = res.decoded.names?.[0] as string;

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
        const res = await thor
            .account(getConfig(networkType).vnsResolverAddress)
            .method(getAddressesABI)
            .call([addressOrDomain]);

        const domainAddress = res.decoded.addresses?.[0] as string;

        // Domain could exist, but it is not pointing to an address
        if (domainAddress === '0x0000000000000000000000000000000000000000') {
            return {
                address: undefined,
                domain: undefined,
                isValidAddressOrDomain: false,
                isPrimaryDomain: false,
            };
        }

        // Get the primary domain
        const primaryDomainRes = await thor
            .account(getConfig(networkType).vnsResolverAddress)
            .method(getNamesABI)
            .call([domainAddress]);

        const primaryDomain = primaryDomainRes.decoded.names?.[0] as string;

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
    const { thor } = useConnex();
    const { network } = useVeChainKitConfig();

    return useQuery<VeChainDomainResult>({
        queryKey: getVechainDomainQueryKey(addressOrDomain),
        queryFn: () => fetchVechainDomain(thor, network.type, addressOrDomain),
        enabled: !!thor && !!addressOrDomain,
    });
};
