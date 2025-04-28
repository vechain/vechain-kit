import {
    useLoginWithOAuth as usePrivyLoginWithOAuth,
    useCreateWallet,
} from '@privy-io/react-auth';
import { Analytics } from '@/utils/mixpanelClientInstance';
import { VeLoginMethod, VePrivySocialLoginMethod } from '@/types/mixPanel';
import { usePrivy } from '@privy-io/react-auth';
import { isRejectionError } from '@/utils/StringUtils';

type OAuthProvider = 'google' | 'twitter' | 'apple' | 'discord';

interface OAuthOptions {
    provider: OAuthProvider;
}

const providerToLoginMethod: Record<OAuthProvider, VeLoginMethod> = {
    google: VeLoginMethod.GOOGLE,
    twitter: VeLoginMethod.EMAIL,
    apple: VeLoginMethod.EMAIL,
    discord: VeLoginMethod.EMAIL,
};

const providerToSocialMethod: Record<OAuthProvider, VePrivySocialLoginMethod> =
    {
        google: VePrivySocialLoginMethod.EMAIL,
        twitter: VePrivySocialLoginMethod.X,
        apple: VePrivySocialLoginMethod.EMAIL,
        discord: VePrivySocialLoginMethod.DISCORD,
    };

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
        const loginMethod = providerToLoginMethod[provider];
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
