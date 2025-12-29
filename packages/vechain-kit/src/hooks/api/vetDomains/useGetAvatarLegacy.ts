/**
 * LEGACY IMPLEMENTATION
 *
 * This file contains the original implementation of the avatar fetching logic
 * which directly interacts with the VeChain blockchain to resolve avatars.
 *
 * The problem with this implementation was that some tokenURI aren't configured
 * to allow cross-origin requests from your localhost application.
 * To solve this we need a proxy server that allows us to fetch the metadata from the tokenURI
 * without having to deal with CORS issues.
 *
 * This implementation is preserved for documentation and reference purposes but is no longer
 * the active implementation. The current implementation uses the vet.domains API to fetch the avatar.
 */

import { useQuery } from '@tanstack/react-query';
import { useVeChainKitConfig } from '@/providers';
import {
    Interface,
    namehash,
    toUtf8String,
    zeroPadValue,
    toBeHex,
} from 'ethers';
import { NETWORK_TYPE } from '@/config/network';
import { getConfig } from '@/config';
import { convertUriToUrl } from '@/utils/uri';

const nameInterface = new Interface([
    'function resolver(bytes32 node) returns (address resolverAddress)',
    'function text(bytes32 node, string key) returns (string avatar)',
]);

const erc721Interface = new Interface([
    'function tokenURI(uint256 tokenId) view returns (string)',
    'function uri(uint256 id) view returns (string)',
]);

/**
 * Fetches the avatar for a given VET domain name
 * @param networkType - The network type ('main' or 'test')
 * @param nodeUrl - The node URL
 * @param name - The VET domain name
 * @returns The avatar URL from the response
 */

export const getAvatarLegacy = async (
    networkType: NETWORK_TYPE,
    nodeUrl: string,
    name: string,
): Promise<string | null> => {
    if (!name) throw new Error('Name is required');

    const node = namehash(name);

    try {
        // Get resolver address
        const accountsUrl = new URL('/accounts/*', nodeUrl);
        const resolverResponse = await fetch(accountsUrl, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                clauses: [
                    {
                        to: getConfig(networkType).vetDomainsContractAddress,
                        data: nameInterface.encodeFunctionData('resolver', [
                            node,
                        ]),
                    },
                ],
            }),
        });

        const [{ data: resolverData, reverted: noResolver }] =
            await resolverResponse.json();

        if (noResolver) {
            return null;
        }

        const { resolverAddress } = nameInterface.decodeFunctionResult(
            'resolver',
            resolverData,
        );

        // Get avatar
        const avatarResponse = await fetch(accountsUrl, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                clauses: [
                    {
                        to: resolverAddress,
                        data: nameInterface.encodeFunctionData('text', [
                            node,
                            'avatar',
                        ]),
                    },
                ],
            }),
        });

        const [{ data: lookupData, reverted: noLookup }] =
            await avatarResponse.json();

        if (noLookup || lookupData === '0x') {
            return null;
        }

        try {
            const { avatar } = nameInterface.decodeFunctionResult(
                'text',
                lookupData,
            );
            const avatarRecord = avatar === '' ? null : avatar;

            if (!avatarRecord) return null;

            return parseAvatarRecord(avatarRecord, networkType, nodeUrl);
        } catch (decodeError) {
            console.error('Failed to decode avatar data:', decodeError);
            return null;
        }
    } catch (error) {
        console.error('Error fetching avatar using legacy API:', error);
        throw error;
    }
};

export const getAvatarLegacyQueryKey = (
    name: string,
    networkType: NETWORK_TYPE,
) => ['VECHAIN_KIT', 'VET_DOMAINS', 'AVATAR', 'LEGACY', name, networkType];

async function parseAvatarRecord(
    record: string,
    networkType: NETWORK_TYPE,
    nodeUrl: string,
): Promise<string | null> {
    try {
        // Use the existing URI converter for direct URL handling
        if (
            record.startsWith('http') ||
            record.startsWith('ipfs://') ||
            record.startsWith('ar://')
        ) {
            return convertUriToUrl(record, networkType) || null;
        }

        // Handle NFT avatar (ENS-12)
        const match = record.match(
            /eip155:(\d+)\/(?:erc721|erc1155):([^/]+)\/(\d+)/,
        );
        if (match) {
            const [, chainId, contractAddress, tokenId] = match;
            const isErc1155 = record.includes('erc1155');

            if (!chainId || !contractAddress || tokenId === undefined) {
                return null;
            }

            // ... rest of NFT handling logic ...
            const clauses = [
                {
                    to: contractAddress,
                    data: erc721Interface.encodeFunctionData(
                        isErc1155 ? 'uri' : 'tokenURI',
                        [BigInt(tokenId || 0)],
                    ),
                },
            ];

            const accountsUrl = new URL('/accounts/*', nodeUrl);
            const [{ data, reverted }] = await fetch(accountsUrl, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({ clauses }),
            }).then((res) => res.json());

            if (reverted) {
                console.error('Failed to fetch tokenURI');
                return null;
            }

            let tokenUri = '';
            try {
                tokenUri = erc721Interface.decodeFunctionResult(
                    isErc1155 ? 'uri' : 'tokenURI',
                    data,
                )[0];
            } catch (e) {
                console.error('Failed to decode avatar data:', e);
                tokenUri = toUtf8String(data);
            }

            // Use the existing URI converter
            tokenUri = convertUriToUrl(tokenUri, networkType) || tokenUri;

            if (isErc1155) {
                tokenUri = tokenUri.replace(
                    '{id}',
                    zeroPadValue(toBeHex(BigInt(tokenId || 0)), 32).slice(2),
                );
            }

            const metadataResponse = await fetch(tokenUri);
            if (!metadataResponse.ok) {
                console.error('Failed to fetch metadata');
                return null;
            }

            const metadata = await metadataResponse.json();
            const imageUrl =
                metadata.image || metadata.image_url || metadata.image_data;

            if (!imageUrl) {
                console.error('No image URL in metadata');
                return null;
            }

            // Use the existing URI converter for the final image URL
            return convertUriToUrl(imageUrl, networkType) || imageUrl;
        }

        return null;
    } catch (error) {
        console.error('Error parsing avatar record:', error);
        return null;
    }
}

/**
 * Hook to fetch the avatar URL for a VET domain name
 * @param name - The VET domain name
 * @returns The resolved avatar URL
 */
export const useGetAvatarLegacy = (name: string) => {
    const { network } = useVeChainKitConfig();
    const nodeUrl = network.nodeUrl ?? getConfig(network.type).nodeUrl;

    const avatarQuery = useQuery({
        queryKey: getAvatarLegacyQueryKey(name ?? '', network.type),
        queryFn: async () => {
            if (!name) return null;

            return getAvatarLegacy(network.type, nodeUrl, name);
        },
        enabled: !!name && !!nodeUrl && !!network.type,
    });

    return avatarQuery;
};
