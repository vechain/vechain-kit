import { usePrivyCrossAppSdk } from '@/providers/PrivyCrossAppProvider';
import { useCrossAppConnectionCache } from '@/hooks/cache/useCrossAppConnectionCache';
import { useFetchAppInfo } from '@/hooks';
import { VECHAIN_PRIVY_APP_ID } from '@/utils';
import { handlePopupError } from '@/utils/handlePopupError';

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
            throw handlePopupError({
                error,
                safariMessage:
                    'Safari blocked the login window. Please try again, it should work now.',
                rejectedMessage: 'Login request was cancelled.',
                defaultMessage: 'VeChain login failed',
            });
        }
    };

    return { login };
};
