import { useLoginWithOAuth as usePrivyLoginWithOAuth } from '@privy-io/react-auth';
import { Analytics } from '@/utils/mixpanelClientInstance';
import { VeLoginMethod, VePrivySocialLoginMethod } from '@/types/mixPanel';
import { usePrivy } from '@privy-io/react-auth';
import { isRejectionError } from '@/utils/StringUtils';

type OAuthProvider = 'google' | 'twitter' | 'apple' | 'discord';

interface OAuthOptions {
    provider: OAuthProvider;
}

const providerToSocialMethod: Record<OAuthProvider, VePrivySocialLoginMethod> =
    {
        google: VePrivySocialLoginMethod.EMAIL,
        twitter: VePrivySocialLoginMethod.X,
        apple: VePrivySocialLoginMethod.EMAIL,
        discord: VePrivySocialLoginMethod.DISCORD,
    };

export const useLoginWithOAuth = () => {
    const { initOAuth: privyInitOAuth } = usePrivyLoginWithOAuth();
    const { user } = usePrivy();

    const initOAuth = async ({ provider }: OAuthOptions) => {
        const loginMethod = VeLoginMethod.OAUTH;
        const socialMethod = providerToSocialMethod[provider];

        try {
            Analytics.auth.flowStarted(loginMethod);
            Analytics.auth.methodSelected(loginMethod);

            await privyInitOAuth({ provider });

            Analytics.auth.completed({
                userId: user?.id,
                loginMethod,
                platform: socialMethod,
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
