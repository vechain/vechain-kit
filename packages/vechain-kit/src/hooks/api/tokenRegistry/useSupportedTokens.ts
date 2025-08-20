import { useMemo } from 'react';
import { useTokenRegistry } from './useTokenRegistry';
import { useVeChainKitConfig } from '@/providers';
import { getConfig } from '@/config';
import { tokenRegistryService } from '@/services/tokenRegistry';
import { TOKEN_LOGOS } from '@/utils/constants';

export interface TokenWithInfo {
    address: string;
    symbol: string;
    name: string;
    decimals: number;
    icon?: string;
    iconUrl?: string;
    isCore?: boolean; // Core tokens are always shown (VET, VTHO, B3TR, etc.)
}

export const useSupportedTokens = () => {
    const { network } = useVeChainKitConfig();
    const { data: registry, isLoading, error } = useTokenRegistry();

    const supportedTokens = useMemo(() => {
        const config = getConfig(network.type);
        // console.log('[SupportedTokens] Building token list for network:', network.type);
        // console.log('[SupportedTokens] Registry available:', !!registry);
        const tokens: TokenWithInfo[] = [];

        // Core tokens that are always included
        const coreTokens: TokenWithInfo[] = [
            {
                address: '0x', // Native VET
                symbol: 'VET',
                name: 'VeChain',
                decimals: 18,
                isCore: true,
            },
            {
                address: config.vthoContractAddress,
                symbol: 'VTHO',
                name: 'VeThor',
                decimals: 18,
                isCore: true,
            },
        ];

        // Add B3TR if configured
        if (config.b3trContractAddress) {
            coreTokens.push({
                address: config.b3trContractAddress,
                symbol: 'B3TR',
                name: 'B3TR',
                decimals: 18,
                isCore: true,
            });
        }

        // Add VOT3 if configured
        if (config.vot3ContractAddress) {
            coreTokens.push({
                address: config.vot3ContractAddress,
                symbol: 'VOT3',
                name: 'VOT3',
                decimals: 18,
                isCore: true,
            });
        }

        // Add veDelegate if configured
        if (config.veDelegateTokenContractAddress) {
            coreTokens.push({
                address: config.veDelegateTokenContractAddress,
                symbol: 'veDelegate',
                name: 'veDelegate',
                decimals: 18,
                isCore: true,
                iconUrl: TOKEN_LOGOS.veDelegate,
            });
        }

        // Add GloDollar if configured
        if (config.gloDollarContractAddress) {
            coreTokens.push({
                address: config.gloDollarContractAddress,
                symbol: 'USDGLO',
                name: 'Glo Dollar',
                decimals: 18,
                isCore: true,
                iconUrl: TOKEN_LOGOS.USDGLO,
            });
        }

        // Start with core tokens
        tokens.push(...coreTokens);
        // console.log('[SupportedTokens] Added', coreTokens.length, 'core tokens');

        // If registry is available, merge with registry tokens
        if (registry?.tokens) {
            // console.log('[SupportedTokens] Processing', registry.tokens.length, 'registry tokens');
            let enrichedCount = 0;
            let addedCount = 0;
            
            // Add registry tokens, enriching core tokens with registry data
            for (const registryToken of registry.tokens) {
                const addressLower = registryToken.address.toLowerCase();
                
                // Find if this is a core token
                const coreTokenIndex = tokens.findIndex(
                    t => t.address.toLowerCase() === addressLower
                );

                if (coreTokenIndex >= 0) {
                    // Enrich core token with registry data
                    tokens[coreTokenIndex] = {
                        ...tokens[coreTokenIndex],
                        name: registryToken.name,
                        decimals: registryToken.decimals,
                        icon: registryToken.icon,
                        iconUrl: tokenRegistryService.getTokenIconUrl(registryToken.icon),
                    };
                    enrichedCount++;
                } else {
                    // Add non-core token from registry
                    tokens.push({
                        address: registryToken.address,
                        symbol: registryToken.symbol,
                        name: registryToken.name,
                        decimals: registryToken.decimals,
                        icon: registryToken.icon,
                        iconUrl: tokenRegistryService.getTokenIconUrl(registryToken.icon),
                        isCore: false,
                    });
                    addedCount++;
                }
            }
            // console.log('[SupportedTokens] Enriched', enrichedCount, 'core tokens with registry data');
            // console.log('[SupportedTokens] Added', addedCount, 'new tokens from registry');
        }
        
        // console.log('[SupportedTokens] Total tokens:', tokens.length);

        return tokens;
    }, [registry, network.type]);

    return {
        tokens: supportedTokens,
        isLoading,
        error,
    };
};

export const useTokenByAddress = (address?: string) => {
    const { tokens } = useSupportedTokens();
    
    return useMemo(() => {
        if (!address) return undefined;
        return tokens.find(
            token => token.address.toLowerCase() === address.toLowerCase()
        );
    }, [tokens, address]);
};

export const useTokenBySymbol = (symbol?: string) => {
    const { tokens } = useSupportedTokens();
    
    return useMemo(() => {
        if (!symbol) return undefined;
        return tokens.find(
            token => token.symbol.toUpperCase() === symbol.toUpperCase()
        );
    }, [tokens, symbol]);
};