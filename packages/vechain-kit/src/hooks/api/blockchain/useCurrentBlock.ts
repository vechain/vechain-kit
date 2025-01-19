import { useVeChainKitConfig } from '@/providers';
import { useQuery } from '@tanstack/react-query';

export const currentBlockQueryKey = () => ['VECHAIN_KIT', 'CURRENT_BLOCK'];

/**
 * Fetches the current block from the blockchain. The block is refetched every 10 seconds.
 * @returns the current block
 */
export const useCurrentBlock = () => {
    const { network } = useVeChainKitConfig();
    const nodeUrl = network.nodeUrl;

    return useQuery({
        queryKey: currentBlockQueryKey(),
        queryFn: async () => {
            const response = await fetch(`${nodeUrl}/blocks/best`, {
                method: 'GET',
            });
            if (!response.ok) throw new Error(response.statusText);
            return (await response.json()) as Connex.Thor.Block;
        },
        enabled: !!nodeUrl,
        staleTime: 1000 * 60,
        refetchInterval: 1000 * 10,
    });
};
