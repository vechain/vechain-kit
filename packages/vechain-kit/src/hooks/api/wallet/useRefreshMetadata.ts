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
        await queryClient.invalidateQueries({
            queryKey: getAvatarQueryKey(domain ?? '', network.type),
        });

        await queryClient.refetchQueries({
            queryKey: getAvatarQueryKey(domain ?? '', network.type),
        });

        await queryClient.invalidateQueries({
            queryKey: getTextRecordsQueryKey(domain, network.type),
        });

        await queryClient.refetchQueries({
            queryKey: getTextRecordsQueryKey(domain, network.type),
        });

        await queryClient.invalidateQueries({
            queryKey: getAvatarOfAddressQueryKey(address),
        });

        await queryClient.refetchQueries({
            queryKey: getAvatarOfAddressQueryKey(address),
        });
    };

    return { refresh };
};
