import { NETWORK_TYPE } from '@/config/network';

export interface TokenInfo {
    name: string;
    symbol: string;
    decimals: number;
    address: string;
    desc?: string;
    icon?: string;
    imgUrl?: string;
}

export interface TokenRegistry {
    updated: number;
    tokens: TokenInfo[];
}

const REGISTRY_BASE_URL = 'https://vechain.github.io/token-registry';
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour cache

class TokenRegistryService {
    private cache: Map<string, { data: TokenRegistry; timestamp: number }> = new Map();

    private getCacheKey(network: NETWORK_TYPE): string {
        return network === 'main' ? 'main' : 'test';
    }

    async fetchTokenRegistry(network: NETWORK_TYPE): Promise<TokenRegistry> {
        const cacheKey = this.getCacheKey(network);
        const cached = this.cache.get(cacheKey);

        // Return cached data if still valid
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
            // console.log('[TokenRegistry Service] Returning cached data for', cacheKey);
            // console.log('[TokenRegistry Service] Cache age:', Math.round((Date.now() - cached.timestamp) / 1000), 'seconds');
            return cached.data;
        }

        try {
            const endpoint = network === 'main' ? 'main.json' : 'test.json';
            const url = `${REGISTRY_BASE_URL}/${endpoint}`;
            // console.log('[TokenRegistry Service] Fetching from:', url);
            
            const response = await fetch(url);
            
            if (!response.ok) {
                // console.error('[TokenRegistry Service] Failed to fetch:', response.status, response.statusText);
                throw new Error(`Failed to fetch token registry: ${response.statusText}`);
            }

            const responseData = await response.json();
            
            // Handle both array and object response formats
            let data: TokenRegistry;
            if (Array.isArray(responseData)) {
                // If response is an array, wrap it in the expected format
                data = {
                    tokens: responseData,
                    updated: Date.now() / 1000 // Use current timestamp
                };
                // console.log('[TokenRegistry Service] Response is array format, wrapped into object');
            } else if (responseData && Array.isArray(responseData.tokens)) {
                // Response is already in the expected format
                data = responseData;
            } else {
                // console.error('[TokenRegistry Service] Invalid response structure:', responseData);
                throw new Error('Invalid token registry response structure');
            }
            
            // console.log('[TokenRegistry Service] Successfully fetched', data.tokens.length, 'tokens');
            // if (data.updated) {
            //     console.log('[TokenRegistry Service] Registry updated:', new Date(data.updated * 1000).toISOString());
            // }
            
            // Update cache
            this.cache.set(cacheKey, {
                data,
                timestamp: Date.now()
            });
            // console.log('[TokenRegistry Service] Cache updated for', cacheKey);

            return data;
        } catch (error) {
            // console.error('[TokenRegistry Service] Fetch error:', error);
            // If fetch fails and we have cached data, return it even if expired
            if (cached) {
                // console.warn('[TokenRegistry Service] Using expired cache due to fetch failure');
                return cached.data;
            }
            throw error;
        }
    }

    async getTokenInfo(address: string, network: NETWORK_TYPE): Promise<TokenInfo | undefined> {
        const registry = await this.fetchTokenRegistry(network);
        return registry.tokens.find(
            token => token.address.toLowerCase() === address.toLowerCase()
        );
    }

    async getTokensBySymbols(symbols: string[], network: NETWORK_TYPE): Promise<TokenInfo[]> {
        const registry = await this.fetchTokenRegistry(network);
        const symbolSet = new Set(symbols.map(s => s.toUpperCase()));
        return registry.tokens.filter(token => symbolSet.has(token.symbol.toUpperCase()));
    }

    getTokenIconUrl(icon?: string): string | undefined {
        if (!icon) return undefined;
        // If icon is already a full URL, return it
        if (icon.startsWith('http')) return icon;
        // Otherwise, construct the URL from the registry assets
        return `${REGISTRY_BASE_URL}/assets/${icon}`;
    }

    clearCache(): void {
        this.cache.clear();
    }
}

export const tokenRegistryService = new TokenRegistryService();