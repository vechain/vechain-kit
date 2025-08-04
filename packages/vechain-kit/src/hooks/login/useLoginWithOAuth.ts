import {
    useLoginWithOAuth as usePrivyLoginWithOAuth,
    useCreateWallet,
    OAuthProviderType,
} from '@privy-io/react-auth';
import { Analytics } from '@/utils/mixpanelClientInstance';
import { VeLoginMethod } from '@/types/mixPanel';
import { usePrivy } from '@privy-io/react-auth';
import { isRejectionError } from '@/utils/stringUtils';

interface OAuthOptions {
    provider: OAuthProviderType;
}

export const useLoginWithOAuth = () => {
    const { createWallet } = useCreateWallet();
    const { initOAuth: privyInitOAuth } = usePrivyLoginWithOAuth({
        onComplete: async ({ isNewUser }) => {
            // When using initOAuth Privy does not create an embedded wallet automatically.
            // So we need to create a wallet manually.
            if (isNewUser) {
                await createWallet();
            }
        },
    });
    const { user } = usePrivy();

    const initOAuth = async ({ provider }: OAuthOptions) => {
        const loginMethod = VeLoginMethod.OAUTH;

        try {
            Analytics.auth.flowStarted(loginMethod);
            Analytics.auth.methodSelected(loginMethod);
            await privyInitOAuth({ provider });
            Analytics.auth.completed({
                userId: user?.id,
                loginMethod,
            });
        } catch (error) {
            const errorMsg =
                error instanceof Error ? error.message : 'Unknown error';

            if (isRejectionError(errorMsg)) {
                Analytics.auth.dropOff('oauth', {
                    ...(provider && { provider }),
                });
            } else {
                Analytics.auth.failed(loginMethod, errorMsg);
            }

            throw error;
        }
    };

    return { initOAuth };
};
