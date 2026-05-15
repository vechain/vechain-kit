import {
    usePrivyCrossAppSdk,
    type CrossAppLoginIntent,
} from '@/providers/PrivyCrossAppProvider';

export type { CrossAppLoginIntent };
import { useCrossAppConnectionCache } from '@/hooks/cache/useCrossAppConnectionCache';
import { useFetchAppInfo } from '@/hooks';
import { VECHAIN_PRIVY_APP_ID } from '@/utils';
import { handlePopupError } from '@/utils/handlePopupError';
import { VEBETTERDAO_GOVERNANCE_BASE_URL } from '@/constants';

export type UseLoginWithVeChainOptions = {
    /**
     * Pre-select a login method on the VeChain whitelabel connect page.
     * When set, the user skips the provider picker and jumps straight into
     * the matching OAuth flow (or email form for `'email'`).
     */
    intent?: CrossAppLoginIntent;
};

export const useLoginWithVeChain = () => {
    const { login: loginWithVeChain } = usePrivyCrossAppSdk();
    const { setConnectionCache } = useCrossAppConnectionCache();
    const { data: appsInfo } = useFetchAppInfo([VECHAIN_PRIVY_APP_ID]);

    const login = async (options?: UseLoginWithVeChainOptions) => {
        try {
            await loginWithVeChain(VECHAIN_PRIVY_APP_ID, options);

            setConnectionCache({
                name: 'VeChain',
                logoUrl: appsInfo?.[VECHAIN_PRIVY_APP_ID]?.logo_url,
                appId: VECHAIN_PRIVY_APP_ID,
                website: VEBETTERDAO_GOVERNANCE_BASE_URL,
            });

        } catch (error) {
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
