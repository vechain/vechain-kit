import { useMemo } from 'react';
import { useSupportedTokens } from './useSupportedTokens';
import { useCustomTokens, CustomTokenInfo } from '@/hooks/api/wallet';

export interface RegistryToken {
    address: string;
    symbol: string;
    name: string;
    decimals: number;
    icon?: string;
    iconUrl?: string;
    isCore?: boolean;
    isCustom?: boolean;
}

/**
 * Hook that combines registry tokens with user's custom tokens
 * Registry tokens take precedence over custom tokens for metadata
 */
export const useRegistryTokens = () => {
    const { tokens: supportedTokens, isLoading: registryLoading } =
        useSupportedTokens();
    const { customTokens } = useCustomTokens();

    const allTokens = useMemo(() => {
        const tokenMap = new Map<string, RegistryToken>();

        // supported tokens from registry
        supportedTokens.forEach((token) => {
            tokenMap.set(token.address.toLowerCase(), {
                ...token,
                isCustom: false,
            });
        });

        // custom tokens (won't override registry tokens)
        customTokens.forEach((customToken: CustomTokenInfo) => {
            const addressLower = customToken.address.toLowerCase();
            if (!tokenMap.has(addressLower)) {
                tokenMap.set(addressLower, {
                    address: customToken.address,
                    symbol: customToken.symbol,
                    name: customToken.name || customToken.symbol,
                    decimals:
                        typeof customToken.decimals === 'string'
                            ? parseInt(customToken.decimals, 10)
                            : customToken.decimals || 18,
                    isCore: false,
                    isCustom: true,
                });
            }
        });

        return Array.from(tokenMap.values());
    }, [supportedTokens, customTokens]);

    return {
        tokens: allTokens,
        isLoading: registryLoading,
    };
};

/**
 * Hook to search tokens by symbol or name
 */
export const useSearchTokens = (query: string) => {
    const { tokens } = useRegistryTokens();

    const searchResults = useMemo(() => {
        if (!query || query.length < 2) return [];

        const searchTerm = query.toLowerCase();
        return tokens.filter(
            (token) =>
                token.symbol.toLowerCase().includes(searchTerm) ||
                token.name.toLowerCase().includes(searchTerm) ||
                token.address.toLowerCase().includes(searchTerm),
        );
    }, [tokens, query]);

    return searchResults;
};
