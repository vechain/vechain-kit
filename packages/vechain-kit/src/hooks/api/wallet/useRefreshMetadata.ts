import { useQueryClient } from '@tanstack/react-query';
import { getAvatarQueryKey, getTextRecordsQueryKey } from '../vetDomains';
import { useVeChainKitConfig } from '@/providers';

export const useRefreshMetadata = (address: string, domain: string) => {
    const queryClient = useQueryClient();
    const { network } = useVeChainKitConfig();

    const refresh = async () => {
        await queryClient.invalidateQueries({
            queryKey: getAvatarQueryKey(domain ?? ''),
        });

        await queryClient.refetchQueries({
            queryKey: getAvatarQueryKey(domain ?? ''),
        });

        await queryClient.invalidateQueries({
            queryKey: getTextRecordsQueryKey(domain, network.type),
        });

        await queryClient.refetchQueries({
            queryKey: getTextRecordsQueryKey(domain, network.type),
        });
    };

    return { refresh };
};
