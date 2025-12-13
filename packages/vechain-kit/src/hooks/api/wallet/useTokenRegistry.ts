import { useQuery } from '@tanstack/react-query';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';

/**
 * Token information from VeChain token registry
 */
export interface TokenRegistryInfo {
    name: string;
    symbol: string;
    decimals: number;
    address: string;
    desc?: string;
    icon?: string;
    totalSupply?: string;
    website?: string;
    whitePaper?: string;
    links?: {
        twitter?: string;
        telegram?: string;
        medium?: string;
        github?: string;
        [key: string]: string | undefined;
    };
}

/**
 * Base URL for the VeChain token registry
 */
const TOKEN_REGISTRY_BASE_URL = 'https://vechain.github.io/token-registry';

/**
 * Get the registry URL based on network type
 */
const getRegistryUrl = (networkType: NETWORK_TYPE): string => {
    const registryFile = networkType === 'main' ? 'main.json' : 'test.json';
    return `${TOKEN_REGISTRY_BASE_URL}/${registryFile}`;
};

/**
 * Fetch tokens from the VeChain token registry
 */
export const fetchTokenRegistry = async (
    networkType: NETWORK_TYPE,
): Promise<TokenRegistryInfo[]> => {
    const url = getRegistryUrl(networkType);

    try {
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(
                `Failed to fetch token registry: ${response.status} ${response.statusText}`,
            );
        }

        const data = await response.json();

        // Validate that we received an array
        if (!Array.isArray(data)) {
            throw new Error('Invalid token registry format: expected an array');
        }

        return data as TokenRegistryInfo[];
    } catch (error) {
        console.error('Error fetching token registry:', error);
        throw error;
    }
};

/**
 * Query key factory for token registry
 */
export const getTokenRegistryQueryKey = (networkType: NETWORK_TYPE) => [
    'VECHAIN_KIT_TOKEN_REGISTRY',
    networkType,
];

/**
 * Hook to fetch and cache tokens from the VeChain token registry
 *
 * @returns Query result with token registry data
 *
 * @example
 * ```tsx
 * const { data: tokens, isLoading, error } = useTokenRegistry();
 *
 * if (isLoading) return <div>Loading tokens...</div>;
 * if (error) return <div>Error loading tokens</div>;
 *
 * return (
 *   <div>
 *     {tokens?.map(token => (
 *       <div key={token.address}>
 *         {token.symbol}: {token.name}
 *       </div>
 *     ))}
 *   </div>
 * );
 * ```
 */
export const useTokenRegistry = () => {
    const { network } = useVeChainKitConfig();

    return useQuery<TokenRegistryInfo[]>({
        queryKey: getTokenRegistryQueryKey(network.type),
        queryFn: async () => {
            if (!network.type) {
                throw new Error('Network type is required');
            }
            return fetchTokenRegistry(network.type);
        },
        enabled: !!network.type,
        staleTime: 1000 * 60 * 60, // 1 hour - registry doesn't change often
        gcTime: 1000 * 60 * 60 * 24, // 24 hours
        retry: (failureCount, error) => {
            // Don't retry on validation errors
            if (error instanceof Error) {
                const errorMessage = error.message.toLowerCase();
                if (
                    errorMessage.includes('network type is required') ||
                    errorMessage.includes('invalid token registry format')
                ) {
                    return false;
                }
            }
            // Retry network errors up to 3 times
            return failureCount < 3;
        },
    });
};
