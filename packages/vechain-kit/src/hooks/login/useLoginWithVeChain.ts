import { usePrivyCrossAppSdk } from '../../providers/PrivyCrossAppProvider';
import { useCrossAppConnectionCache } from '../cache/useCrossAppConnectionCache';
import { useFetchAppInfo } from '../';
import { VECHAIN_PRIVY_APP_ID } from '../../utils';
import { handlePopupError } from '../../utils/handlePopupError';
import { VEBETTERDAO_GOVERNANCE_BASE_URL } from '@/constants';

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
