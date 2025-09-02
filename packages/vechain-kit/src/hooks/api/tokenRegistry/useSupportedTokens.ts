import { useMemo } from 'react';
import { useTokenRegistry } from './useTokenRegistry';
import { useVeChainKitConfig } from '@/providers';
import { getConfig } from '@/config';
import { tokenRegistryService } from '@/services/tokenRegistry';
import { TOKEN_LOGOS } from '@/utils/Constants';

export interface TokenWithInfo {
    address: string;
    symbol: string;
    name: string;
    decimals: number;
    icon?: string;
    iconUrl?: string;
    isCore?: boolean;
}

export const useSupportedTokens = () => {
    const { network } = useVeChainKitConfig();
    const { data: registry, isLoading, error } = useTokenRegistry();

    const supportedTokens = useMemo(() => {
        const tokens: TokenWithInfo[] = [];

        // process registry tokens if available
        if (registry?.tokens) {
            // priority tokens to appear first
            const prioritySymbols = [
                'VET',
                'VTHO',
                'B3TR',
                'VOT3',
                'veDelegate',
                'USDGLO',
            ];

            const tokenMap = new Map<string, TokenWithInfo>();

            for (const registryToken of registry.tokens) {
                tokenMap.set(registryToken.symbol, {
                    address: registryToken.address,
                    symbol: registryToken.symbol,
                    name: registryToken.name,
                    decimals: registryToken.decimals,
                    icon: registryToken.icon,
                    iconUrl: tokenRegistryService.getTokenIconUrl(
                        registryToken.icon,
                    ),
                    isCore: prioritySymbols.includes(registryToken.symbol),
                });
            }

            // priority tokens first (in order)
            for (const symbol of prioritySymbols) {
                const token = tokenMap.get(symbol);
                if (token) {
                    tokens.push(token);
                    tokenMap.delete(symbol);
                }
            }

            tokens.push(...tokenMap.values());
        } else {
            // fallback: minimal core tokens when registry is not available
            const config = getConfig(network.type);

            tokens.push({
                address: '0x',
                symbol: 'VET',
                name: 'VeChain',
                decimals: 18,
                isCore: true,
            });

            tokens.push({
                address: config.vthoContractAddress,
                symbol: 'VTHO',
                name: 'VeThor',
                decimals: 18,
                isCore: true,
            });

            // hardcoded icons for tokens not in registry
            if (config.veDelegateTokenContractAddress) {
                tokens.push({
                    address: config.veDelegateTokenContractAddress,
                    symbol: 'veDelegate',
                    name: 'veDelegate',
                    decimals: 18,
                    isCore: true,
                    iconUrl: TOKEN_LOGOS.veDelegate,
                });
            }

            if (config.gloDollarContractAddress) {
                tokens.push({
                    address: config.gloDollarContractAddress,
                    symbol: 'USDGLO',
                    name: 'Glo Dollar',
                    decimals: 18,
                    isCore: true,
                    iconUrl: TOKEN_LOGOS.USDGLO,
                });
            }
        }

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
            (token) => token.address.toLowerCase() === address.toLowerCase(),
        );
    }, [tokens, address]);
};

export const useTokenBySymbol = (symbol?: string) => {
    const { tokens } = useSupportedTokens();

    return useMemo(() => {
        if (!symbol) return undefined;
        return tokens.find(
            (token) => token.symbol.toUpperCase() === symbol.toUpperCase(),
        );
    }, [tokens, symbol]);
};
