import { useQuery } from '@tanstack/react-query';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';

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

//TODO: Move to env or constants
const TOKEN_REGISTRY_BASE_URL = 'https://vechain.github.io/token-registry';
const MAX_RETRY_COUNT = 3 as const;
const CACHE_TIME = 1000 * 60 * 60 * 24; // 24 hours

const getRegistryUrl = (networkType: NETWORK_TYPE): string => {
    const registryFile = networkType === 'main' ? 'main.json' : 'test.json';
    return new URL(registryFile, TOKEN_REGISTRY_BASE_URL).href;
};

const getTokenIconUrl = (iconPath?: string): string | undefined => {
    if (!iconPath) return;
    return new URL(`assets/${iconPath}`, TOKEN_REGISTRY_BASE_URL).href;
};

// Fetch tokens from VeChain registry and resolve icon URLs
const fetchTokenRegistry = async (
    networkType: NETWORK_TYPE,
): Promise<TokenRegistryInfo[]> => {
    const url = getRegistryUrl(networkType);
    const response = await fetch(url, {
        headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
        throw new Error(
            `Failed to fetch token registry: ${response.status} ${response.statusText}`,
        );
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
        throw new Error('Invalid token registry format: expected an array');
    }

    return data.map((token) => ({
        ...token,
        icon: getTokenIconUrl(token.icon),
    }));
};

export const getTokenRegistryQueryKey = (networkType: NETWORK_TYPE) => [
    'VECHAIN_KIT_TOKEN_REGISTRY',
    networkType,
];

// Hook to fetch and cache tokens from VeChain registry
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
        gcTime: CACHE_TIME, // 24 hours
        retry: (failureCount) => failureCount < MAX_RETRY_COUNT,
        retryDelay: (failureCount) => failureCount * 1000, // 1 second per retry
    });
};
