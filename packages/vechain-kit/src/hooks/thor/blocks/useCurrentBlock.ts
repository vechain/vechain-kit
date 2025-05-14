import { TIME } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { useThor } from '@vechain/dapp-kit-react2';

export const currentBlockQueryKey = () => ['VECHAIN_KIT', 'CURRENT_BLOCK'];

const REFETCH_INTERVAL = 10 * TIME.SECOND;

/**
 * Fetches the current block from the blockchain. The block is refetched every 10 seconds.
 * @returns the current block
 */
export const useCurrentBlock = () => {
  const thor = useThor();

  return useQuery({
    queryKey: currentBlockQueryKey(),
    queryFn: async () => {
      const response = await thor.blocks.getBestBlockExpanded();
      if (!response) throw new Error('Failed to fetch current block');
      return response;
    },
    staleTime: 1000 * 60,
    refetchInterval: REFETCH_INTERVAL,
  });
};
