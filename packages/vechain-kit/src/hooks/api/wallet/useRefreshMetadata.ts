import { useQueryClient } from '@tanstack/react-query';
// Direct imports to avoid circular dependency through barrel exports
import { getAvatarOfAddressQueryKey } from '../vetDomains/useGetAvatarOfAddress';
import { getAvatarQueryKey } from '../vetDomains/useGetAvatar';
import { getTextRecordsQueryKey } from '../vetDomains/useGetTextRecords';
import { useVeChainKitConfig } from '../../../providers/VeChainKitProvider';

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
