import { useQuery } from '@tanstack/react-query';

interface PrivyAppInfo {
    id: string;
    name: string;
    logo_url: string;
    icon_url: string | null;
    terms_and_conditions_url: string;
    privacy_policy_url: string;
    theme: string;
    accent_color: string;
    wallet_auth: boolean;
    email_auth: boolean;
    google_oauth: boolean;
    twitter_oauth: boolean;
    // Add other fields as needed
}

export const fetchPrivyAppInfo = async (
    appId: string,
): Promise<PrivyAppInfo> => {
    const response = await fetch(`https://auth.privy.io/api/v1/apps/${appId}`, {
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
                results.map((result, index) => [normalizedIds[index], result]),
            );
        },
        enabled: normalizedIds.length > 0,
    });
};
