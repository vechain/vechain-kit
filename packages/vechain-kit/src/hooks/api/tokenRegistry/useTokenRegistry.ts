import { useQuery } from '@tanstack/react-query';
import { tokenRegistryService, TokenInfo, TokenRegistry } from '@/services/tokenRegistry';
import { useVeChainKitConfig } from '@/providers';

export const useTokenRegistry = () => {
    const { network } = useVeChainKitConfig();

    return useQuery<TokenRegistry>({
        queryKey: ['tokenRegistry', network.type],
        queryFn: async () => {
            const registry = await tokenRegistryService.fetchTokenRegistry(network.type);
            return registry;
        },
        staleTime: 1000 * 60 * 60, // 1 hour
        gcTime: 1000 * 60 * 60 * 24, // 24 hours
    });
};

export const useTokenInfo = (address?: string) => {
    const { network } = useVeChainKitConfig();

    return useQuery<TokenInfo | undefined>({
        queryKey: ['tokenInfo', address, network.type],
        queryFn: () => {
            if (!address) return undefined;
            return tokenRegistryService.getTokenInfo(address, network.type);
        },
        enabled: !!address,
        staleTime: 1000 * 60 * 60, // 1 hour
        gcTime: 1000 * 60 * 60 * 24, // 24 hours
    });
};

export const useTokensBySymbols = (symbols: string[]) => {
    const { network } = useVeChainKitConfig();

    return useQuery<TokenInfo[]>({
        queryKey: ['tokensBySymbols', symbols, network.type],
        queryFn: () => tokenRegistryService.getTokensBySymbols(symbols, network.type),
        enabled: symbols.length > 0,
        staleTime: 1000 * 60 * 60, // 1 hour
        gcTime: 1000 * 60 * 60 * 24, // 24 hours
    });
};

export const useTokenIcon = (icon?: string) => {
    return tokenRegistryService.getTokenIconUrl(icon);
};