import { TIME } from '../../../utils';
import { useQuery } from '@tanstack/react-query';
import { useOptionalThor } from '../../api/dappkit/useOptionalThor';

export const currentBlockQueryKey = () => ['VECHAIN_KIT', 'CURRENT_BLOCK'];

const REFETCH_INTERVAL = 10 * TIME.SECOND;

/**
 * Fetches the current block from the blockchain. The block is refetched every 10 seconds.
 * @returns the current block
 */
export const useCurrentBlock = () => {
    // Use optional Thor hook that handles missing provider gracefully
    const thor = useOptionalThor();

    return useQuery({
        queryKey: currentBlockQueryKey(),
        queryFn: async () => {
            if (!thor) throw new Error('Thor client not available');
            const response = await thor.blocks.getBestBlockExpanded();
            if (!response) throw new Error('Failed to fetch current block');
            return response;
        },
        staleTime: 1000 * 60,
        refetchInterval: REFETCH_INTERVAL,
        enabled: !!thor,
    });
};
