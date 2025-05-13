import { useQueryClient } from '@tanstack/react-query';

export const useInvalidateDomainQueries = () => {
    const queryClient = useQueryClient();

    return () =>
        queryClient.invalidateQueries({
            queryKey: ['VECHAIN_KIT_DOMAIN'],
        });
};
