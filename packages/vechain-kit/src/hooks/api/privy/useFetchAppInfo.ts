import type { PrivyAppInfo } from '../../../types';
import { useQuery } from '@tanstack/react-query';
import { DEFAULT_PRIVY_ECOSYSTEM_APPS } from '@/utils/constants';
import { PRIVY_AUTH_BASE_URL } from '@/constants';

export const fetchPrivyAppInfo = async (
    appId: string,
): Promise<PrivyAppInfo> => {
    const appInfoUrl = new URL(`/api/v1/apps/${appId}`, PRIVY_AUTH_BASE_URL);
    const response = await fetch(appInfoUrl, {
        headers: {
            'privy-app-id': appId,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch Privy app info');
    }

    return response.json();
};

export const getPrivyAppInfoQueryKey = (appIds: string | string[]) => [
    'VECHAIN_KIT_PRIVY_APP_INFO',
    ...(Array.isArray(appIds) ? appIds : [appIds]),
];

export const useFetchAppInfo = (appIds: string | string[]) => {
    const normalizedIds = Array.isArray(appIds) ? appIds : [appIds];

    return useQuery({
        queryKey: getPrivyAppInfoQueryKey(appIds),
        queryFn: async () => {
            const results = await Promise.all(
                normalizedIds.map((id) => fetchPrivyAppInfo(id)),
            );

            return Object.fromEntries(
                results.map((result, index) => {
                    const id = normalizedIds[index];
                    const defaultApp = DEFAULT_PRIVY_ECOSYSTEM_APPS.find(
                        (app) => app.id === id,
                    );
                    return [
                        id,
                        {
                            ...result,
                            website: defaultApp?.website,
                        },
                    ];
                }),
            );
        },
        enabled: normalizedIds.length > 0,
        retry: (failureCount, error) => {
            // Don't retry on cancellation errors
            if (error instanceof Error) {
                const errorMessage = error.message.toLowerCase();
                if (errorMessage.includes('cancel') || errorMessage.includes('abort')) {
                    return false;
                }
            }
            // Retry network errors up to 2 times
            return failureCount < 2;
        },
        gcTime: 1000 * 60 * 5, // 5 minutes
        staleTime: 1000 * 60, // 1 minute
    });
};
