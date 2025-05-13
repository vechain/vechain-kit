import { useQueryClient } from '@tanstack/react-query';
import {
    getAvatarOfAddressQueryKey,
    getAvatarQueryKey,
    getTextRecordsQueryKey,
} from '../vetDomains';
import { useVeChainKitConfig } from '@/providers';

export const useRefreshMetadata = (domain: string, address: string) => {
    const queryClient = useQueryClient();
    const { network } = useVeChainKitConfig();

    const refresh = async () => {
        const queryKeys = [
            getAvatarQueryKey(domain ?? '', network.type),
            getTextRecordsQueryKey(domain, network.type),
            getAvatarOfAddressQueryKey(address),
        ];

        await Promise.all(
            queryKeys.map((queryKey) =>
                queryClient.invalidateQueries({ queryKey }),
            ),
        );
    };

    return { refresh };
};
