import { usePrivyCrossAppSdk } from '@/providers/PrivyCrossAppProvider';
import { useCrossAppConnectionCache } from '@/hooks/cache/useCrossAppConnectionCache';
import { useFetchAppInfo, usePrivy } from '@/hooks';
import { VECHAIN_PRIVY_APP_ID } from '@/utils';
import { handlePopupError } from '@/utils/handlePopupError';
import { VeLoginMethod } from '@/types/mixPanel';
import { Analytics } from '@/utils/mixpanelClientInstance';

export const useLoginWithVeChain = () => {
    const { login: loginWithVeChain } = usePrivyCrossAppSdk();
    const { setConnectionCache } = useCrossAppConnectionCache();
    const { data: appsInfo } = useFetchAppInfo([VECHAIN_PRIVY_APP_ID]);
    const { user } = usePrivy();

    const login = async () => {
        try {
            Analytics.auth.methodSelected(VeLoginMethod.VECHAIN);

            await loginWithVeChain(VECHAIN_PRIVY_APP_ID);

            setConnectionCache({
                name: 'VeChain',
                logoUrl: appsInfo?.[VECHAIN_PRIVY_APP_ID]?.logo_url,
                appId: VECHAIN_PRIVY_APP_ID,
            });

            Analytics.auth.completed({
                userId: user?.id,
                loginMethod: VeLoginMethod.VECHAIN,
            });
        } catch (error) {
            const errorMsg =
                error instanceof Error ? error.message : 'Unknown error';

            if (
                errorMsg.toLowerCase().includes('rejected') ||
                errorMsg.toLowerCase().includes('closed')
            ) {
                Analytics.auth.dropOff('wallet-connect');
            } else {
                Analytics.auth.failed(VeLoginMethod.VECHAIN, errorMsg);
            }

            throw handlePopupError({
                error,
                mobileBrowserPopupMessage:
                    "Your mobile browser blocked the login window. Please click 'Try again' to open the login window or change your browser settings.",
                rejectedMessage: 'Login request was cancelled.',
                defaultMessage:
                    'There was an unexpected issue logging in with VeChain. Please try again or contact support.',
            });
        }
    };

    return { login };
};
