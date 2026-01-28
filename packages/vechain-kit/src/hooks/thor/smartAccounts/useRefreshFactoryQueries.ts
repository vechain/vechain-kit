import { useQueryClient } from '@tanstack/react-query';
import { useWallet } from '../../api/wallet/useWallet';
// Direct imports to avoid circular dependencies
import { getAccountVersionQueryKey } from './useGetAccountVersion';
import { getUpgradeRequiredQueryKey } from './useUpgradeRequired';
import { getUpgradeRequiredForAccountQueryKey } from './useUpgradeRequiredForAccount';
import { getCurrentAccountImplementationVersionQueryKey } from './useCurrentAccountImplementationVersion';
import { getAccountImplementationAddressQueryKey } from './useAccountImplementationAddress';
import { getHasV1SmartAccountQueryKey } from './useHasV1SmartAccount';
import { getAccountAddressQueryKey } from './useGetAccountAddress';
import { useVeChainKitConfig } from '../../../providers/VeChainKitProvider';

/**
 * Hook to refresh smart account factory-related queries
 * @returns Object with refresh function
 */
export const useRefreshFactoryQueries = () => {
    const queryClient = useQueryClient();
    const { connectedWallet, smartAccount } = useWallet();
    const { network } = useVeChainKitConfig();

    const refresh = async () => {
        const ownerAddress = connectedWallet?.address ?? '';
        const smartAccountAddress = smartAccount?.address ?? '';

        // First cancel all queries
        await Promise.all([
            // Factory related queries
            queryClient.cancelQueries({
                queryKey: getAccountAddressQueryKey(ownerAddress, network.type),
            }),
            queryClient.cancelQueries({
                queryKey: getAccountVersionQueryKey(
                    smartAccountAddress,
                    ownerAddress,
                    network.type,
                ),
            }),
            queryClient.cancelQueries({
                queryKey: getHasV1SmartAccountQueryKey(
                    ownerAddress,
                    network.type,
                ),
            }),
            queryClient.cancelQueries({
                queryKey: getCurrentAccountImplementationVersionQueryKey(
                    network.type,
                ),
            }),

            // Upgrade related queries - using current version 3 as default
            queryClient.cancelQueries({
                queryKey: getUpgradeRequiredQueryKey(
                    smartAccountAddress,
                    ownerAddress,
                    3,
                    network.type,
                ),
            }),
            queryClient.cancelQueries({
                queryKey: getUpgradeRequiredForAccountQueryKey(
                    smartAccountAddress,
                    3,
                    network.type,
                ),
            }),
            queryClient.cancelQueries({
                queryKey: getAccountImplementationAddressQueryKey(
                    3,
                    network.type,
                ),
            }),
        ]);

        // Then refetch all queries
        await Promise.all([
            // Factory related queries
            queryClient.refetchQueries({
                queryKey: getAccountAddressQueryKey(ownerAddress, network.type),
            }),
            queryClient.refetchQueries({
                queryKey: getAccountVersionQueryKey(
                    smartAccountAddress,
                    ownerAddress,
                    network.type,
                ),
            }),
            queryClient.refetchQueries({
                queryKey: getHasV1SmartAccountQueryKey(
                    ownerAddress,
                    network.type,
                ),
            }),
            queryClient.refetchQueries({
                queryKey: getCurrentAccountImplementationVersionQueryKey(
                    network.type,
                ),
            }),

            // Upgrade related queries - using current version 3 as default
            queryClient.refetchQueries({
                queryKey: getUpgradeRequiredQueryKey(
                    smartAccountAddress,
                    ownerAddress,
                    3,
                    network.type,
                ),
            }),
            queryClient.refetchQueries({
                queryKey: getUpgradeRequiredForAccountQueryKey(
                    smartAccountAddress,
                    3,
                    network.type,
                ),
            }),
            queryClient.refetchQueries({
                queryKey: getAccountImplementationAddressQueryKey(
                    3,
                    network.type,
                ),
            }),
        ]);
    };

    return { refresh };
};
