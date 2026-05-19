'use client';

import { ThorClient } from '@vechain/sdk-network';
import { Address } from '@vechain/sdk-core';
import {
    getAddressDomain,
    getAvatar,
    getDomainAddress,
    isPrimaryDomain,
} from '@vechain/contract-getters';
import { picasso } from '@vechain/picasso';

// Network configuration: hardcoded once, no React context required.
// Matches the kit's mainnet/testnet config (`packages/vechain-kit/src/config/*.ts`).
// Validate the env var explicitly — a stray value (e.g. 'production') would
// fall through `NETWORK[NETWORK_TYPE]` undefined and crash on `.nodeUrl`.
const rawNetworkType = process.env.NEXT_PUBLIC_NETWORK_TYPE;
const NETWORK_TYPE: 'main' | 'test' =
    rawNetworkType === 'test' ? 'test' : 'main';

const NETWORK = {
    main: {
        nodeUrl: 'https://mainnet.vechain.org',
        accountFactoryAddress: '0xC06Ad8573022e2BE416CA89DA47E8c592971679A',
    },
    test: {
        nodeUrl: 'https://testnet.vechain.org',
        accountFactoryAddress: '0x713b908Bcf77f3E00EFEf328E50b657a1A23AeaF',
    },
} as const;

export const networkType = NETWORK_TYPE;
export const networkConfig = NETWORK[NETWORK_TYPE];
export const thor = ThorClient.at(networkConfig.nodeUrl);

// Minimal ABI for SocialLoginSmartAccountFactory.getAccountAddress. Inlined
// to avoid pulling the full `@vechain/vechain-contract-types` package; this
// single read is all the host needs.
const SMART_ACCOUNT_FACTORY_ABI = [
    {
        type: 'function',
        name: 'getAccountAddress',
        stateMutability: 'view',
        inputs: [{ name: 'owner', type: 'address' }],
        outputs: [{ name: '', type: 'address' }],
    },
] as const;

export type SmartAccountInfo = {
    address: string;
    isDeployed: boolean;
};

export async function getSmartAccountAddress(
    owner: string,
): Promise<SmartAccountInfo> {
    const res = await thor.contracts
        .load(
            networkConfig.accountFactoryAddress,
            SMART_ACCOUNT_FACTORY_ABI,
        )
        .read.getAccountAddress(owner);
    const address = Address.of((res as unknown as [string])[0].toString()).toString();
    const detail = await thor.accounts.getAccount(Address.of(address));
    return { address, isDeployed: detail.hasCode };
}

export async function getChainId(): Promise<string> {
    const genesis = await thor.blocks.getGenesisBlock();
    if (!genesis) throw new Error('Could not fetch genesis block');
    return genesis.id;
}

// VNS lookups are only defined on mainnet and testnet.
const vnsSupported = NETWORK_TYPE === 'main' || NETWORK_TYPE === 'test';

export type DomainInfo = {
    address?: string;
    domain?: string;
    isPrimaryDomain: boolean;
};

export async function getDomainOfAddress(
    address: string,
): Promise<DomainInfo> {
    if (!vnsSupported || !address) {
        return { address, isPrimaryDomain: false };
    }
    const domain = await getAddressDomain(address, {
        networkUrl: networkConfig.nodeUrl,
    });
    if (!domain) return { address, isPrimaryDomain: false };
    const isPrimary = await isPrimaryDomain(domain, address, {
        networkUrl: networkConfig.nodeUrl,
    });
    return { address, domain, isPrimaryDomain: isPrimary };
}

export async function resolveDomainToAddress(
    domain: string,
): Promise<string | undefined> {
    if (!vnsSupported || !domain) return undefined;
    const res = await getDomainAddress(domain, {
        networkUrl: networkConfig.nodeUrl,
    });
    return res ?? undefined;
}

// Avatar resolution: VET-domain avatar → Picasso identicon fallback.
// The kit also resolves cross-app-specific avatars from localStorage, but
// this host doesn't carry those connection caches.
export async function getAvatarForAddress(address: string): Promise<string> {
    if (!vnsSupported) return picassoFallback(address);
    const domain = await getAddressDomain(address, {
        networkUrl: networkConfig.nodeUrl,
    });
    if (!domain) return picassoFallback(address);
    const avatar = await getAvatar(domain, {
        networkUrl: networkConfig.nodeUrl,
    });
    return avatar ?? picassoFallback(address);
}

export function picassoFallback(address: string): string {
    const svg = picasso(address.toLowerCase());
    return `data:image/svg+xml;utf8,${svg}`;
}
