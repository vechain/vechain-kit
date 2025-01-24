import { usePrivyCrossAppSdk } from '@/providers/PrivyCrossAppProvider';
import { useCrossAppConnectionCache } from '@/hooks/cache/useCrossAppConnectionCache';
import { useFetchAppInfo } from '@/hooks';
import { VECHAIN_PRIVY_APP_ID } from '@/utils';

export const useLoginWithVeChain = () => {
    const { login: loginWithVeChain } = usePrivyCrossAppSdk();
    const { setConnectionCache } = useCrossAppConnectionCache();
    const { data: appsInfo } = useFetchAppInfo([VECHAIN_PRIVY_APP_ID]);

    const login = async () => {
        try {
            await loginWithVeChain(VECHAIN_PRIVY_APP_ID);
            setConnectionCache({
                name: 'VeChain',
                logoUrl: appsInfo?.[VECHAIN_PRIVY_APP_ID]?.logo_url,
                appId: VECHAIN_PRIVY_APP_ID,
            });
        } catch (error) {
            console.error('VeChain login failed:', error);
            throw error;
        }
    };

    return { login };
};
