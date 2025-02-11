import { useQueryClient } from '@tanstack/react-query';
import { getVechainDomainQueryKey } from '../vetDomains/useVechainDomain';
import { getAvatarQueryKey, getTextRecordsQueryKey } from '../vetDomains';
import { useVeChainKitConfig } from '@/providers';

export const useRefreshMetadata = (address: string, domain: string) => {
    const queryClient = useQueryClient();
    const { network } = useVeChainKitConfig();

    const refresh = async () => {
        // wait, so changes are propagated
        await new Promise((resolve) => setTimeout(resolve, 3000));

        await queryClient.invalidateQueries({
            queryKey: getVechainDomainQueryKey(address),
        });

        await queryClient.refetchQueries({
            queryKey: getVechainDomainQueryKey(address),
        });

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
