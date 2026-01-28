import { useQueryClient } from '@tanstack/react-query';
import {
    getAvatarOfAddressQueryKey,
    getAvatarQueryKey,
    getTextRecordsQueryKey,
} from '../../';
import { useVeChainKitConfig } from '@/providers';

export const useRefreshMetadata = (domain: string, address: string) => {
    const queryClient = useQueryClient();
    const { network } = useVeChainKitConfig();

    const refresh = async () => {
        await Promise.all([
            queryClient.invalidateQueries({
                queryKey: getAvatarQueryKey(domain ?? '', network.type),
            }),
            queryClient.invalidateQueries({
                queryKey: getTextRecordsQueryKey(domain, network.type),
            }),
            queryClient.invalidateQueries({
                queryKey: getAvatarOfAddressQueryKey(address),
            }),
        ]);
    };

    return { refresh };
};
