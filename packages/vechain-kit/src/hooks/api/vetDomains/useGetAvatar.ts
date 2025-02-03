import { useQuery } from '@tanstack/react-query';
import { useVeChainKitConfig } from '@/providers';
import { Interface, namehash } from 'ethers';
import { NETWORK_TYPE } from '@/config/network';
import { getConfig } from '@/config';

const nameInterface = new Interface([
    'function resolver(bytes32 node) returns (address resolverAddress)',
    'function text(bytes32 node, string key) returns (string avatar)',
]);

/**
 * Fetches the avatar for a given VET domain name
 * @param networkType - The network type ('main' or 'test')
 * @param nodeUrl - The node URL
 * @param name - The VET domain name
 * @returns The avatar URL from the response
 */
export const getAvatar = async (
    networkType: NETWORK_TYPE,
    nodeUrl: string,
    name: string,
): Promise<string | null> => {
    if (!name) throw new Error('Name is required');

    const node = namehash(name);

    try {
        // Get resolver address
        const resolverResponse = await fetch(`${nodeUrl}/accounts/*`, {
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
        const avatarResponse = await fetch(`${nodeUrl}/accounts/*`, {
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

        if (noLookup) {
            return null;
        }

        const { avatar } = nameInterface.decodeFunctionResult(
            'text',
            lookupData,
        );

        return avatar === '' ? null : avatar;
    } catch (error) {
        console.error('Error fetching avatar:', error);
        throw error;
    }
};

export const getAvatarQueryKey = (name: string) => [
    'VECHAIN_KIT',
    'VET_DOMAINS',
    'AVATAR',
    name,
];

/**
 * Hook to fetch the avatar URL for a VET domain name
 * @param name - The VET domain name
 * @returns The resolved avatar URL
 */
export const useGetAvatar = (name?: string) => {
    const { network } = useVeChainKitConfig();
    const nodeUrl = network.nodeUrl ?? getConfig(network.type).nodeUrl;

    const avatarQuery = useQuery({
        queryKey: getAvatarQueryKey(name ?? ''),
        queryFn: () => getAvatar(network.type, nodeUrl, name!),
        enabled: !!name && !!nodeUrl && !!network.type,
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    return avatarQuery;
};
