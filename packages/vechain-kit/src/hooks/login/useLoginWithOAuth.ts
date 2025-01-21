import { useLoginWithOAuth as usePrivyLoginWithOAuth } from '@privy-io/react-auth';

type OAuthProvider = 'google' | 'twitter' | 'apple' | 'discord';

interface OAuthOptions {
    provider: OAuthProvider;
}

export const useLoginWithOAuth = () => {
    const { initOAuth: privyInitOAuth } = usePrivyLoginWithOAuth();

    const initOAuth = async ({ provider }: OAuthOptions) => {
        try {
            await privyInitOAuth({ provider });
        } catch (error) {
            console.error('OAuth login failed:', error);
            throw error;
        }
    };

    return { initOAuth };
};
