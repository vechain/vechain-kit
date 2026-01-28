import { useQuery } from '@tanstack/react-query';
import { useVeChainKitConfig } from '../../../providers/VeChainKitProvider';
import { getTokenInfo as getTokenInfoFromContract, type CustomTokenInfo } from '@vechain/contract-getters';

export const getTokenInfo = async (tokenAddress: string, networkUrl: string): Promise<CustomTokenInfo> => {
    return getTokenInfoFromContract(tokenAddress, {
        networkUrl,
    });
};

export const getCustomTokenInfoQueryKey = (tokenAddress: string) => [
    'VECHAIN_KIT_CUSTOM_TOKEN_INFO',
    tokenAddress,
];

export const useGetCustomTokenInfo = (tokenAddress: string) => {
    const { network } = useVeChainKitConfig();

    return useQuery<CustomTokenInfo>({
        queryKey: getCustomTokenInfoQueryKey(tokenAddress),
        queryFn: async () => {
            if (!tokenAddress) throw new Error('Token address is required');
            if (!network.nodeUrl) throw new Error('Network node URL is required');
            return getTokenInfo(tokenAddress, network.nodeUrl);
        },
        enabled: !!network.type && !!tokenAddress,
        retry: (failureCount, error) => {
            // Don't retry on cancellation or validation errors
            if (error instanceof Error) {
                const errorMessage = error.message.toLowerCase();
                if (errorMessage.includes('cancel') || 
                    errorMessage.includes('abort') ||
                    errorMessage === 'token address is required' ||
                    errorMessage === 'network node url is required') {
                    return false;
                }
            }
            // Retry network errors up to 2 times
            return failureCount < 2;
        },
        gcTime: 1000 * 60 * 5, // 5 minutes
        staleTime: 1000 * 60, // 1 minute
    });
};
