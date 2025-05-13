import { useQueryClient } from '@tanstack/react-query';
import { useWallet } from '../../../api/wallet/useWallet';

/**
 * Hook to refresh smart account-related queries
 * @returns Object with refresh function
 */
export const useRefreshSmartAccountQueries = () => {
    const queryClient = useQueryClient();
    const { smartAccount } = useWallet();

    const refresh = async () => {
        const smartAccountAddress = smartAccount?.address ?? '';

        await queryClient.invalidateQueries({
            queryKey: ['VECHAIN_KIT_SMART_ACCOUNT', smartAccountAddress],
        });
    };

    return { refresh };
};
