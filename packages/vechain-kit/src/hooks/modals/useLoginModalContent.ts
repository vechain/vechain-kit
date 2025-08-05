import { useVeChainKitConfig } from '@/providers';
import { VECHAIN_PRIVY_APP_ID } from '@/utils';
import { useMemo } from 'react';

type LoginModalContentConfig = {
    showGoogleLogin: boolean;
    showEmailLogin: boolean;
    showPasskey: boolean;
    showVeChainLogin: boolean;
    showDappKit: boolean;
    showEcosystem: boolean;
    showMoreLogin: boolean;
    showGithubLogin: boolean;
    isOfficialVeChainApp: boolean;
};

export const useLoginModalContent = (): LoginModalContentConfig => {
    const { privy, loginMethods } = useVeChainKitConfig();
    const isVeChainApp = privy?.appId === VECHAIN_PRIVY_APP_ID;

    // Helper function to check if a login method is enabled
    const isLoginMethodEnabled = (method: string | string[]) => {
        if (!loginMethods) return true;

        if (Array.isArray(method)) {
            return method.some((m) =>
                loginMethods.some((lm) => lm.method === m),
            );
        }
        return loginMethods.some((lm) => lm.method === method);
    };

    // Memoized login method states
    const showEcosystemLogin = useMemo(() => {
        if (!loginMethods) return true;
        return loginMethods.length === 0 || isLoginMethodEnabled('ecosystem');
    }, [loginMethods]);

    const showLoginWithVeChain = useMemo(
        () => isLoginMethodEnabled('vechain'),
        [loginMethods],
    );
    const showLoginWithDappKit = useMemo(
        () => isLoginMethodEnabled('dappkit'),
        [loginMethods],
    );
    const showLoginWithPasskey = useMemo(
        () => isLoginMethodEnabled('passkey'),
        [loginMethods],
    );
    const showLoginWithEmail = useMemo(
        () => isLoginMethodEnabled('email'),
        [loginMethods],
    );
    const showLoginWithGoogle = useMemo(
        () => isLoginMethodEnabled('google'),
        [loginMethods],
    );
    const showMoreLogin = useMemo(
        () => isLoginMethodEnabled('more'),
        [loginMethods],
    );
    const showLoginWithGithub = useMemo(
        () => isLoginMethodEnabled('github'),
        [loginMethods],
    );

    // Base configuration that's common across all cases
    const baseConfig: LoginModalContentConfig = {
        showGoogleLogin: showLoginWithGoogle,
        showEmailLogin: showLoginWithEmail,
        showPasskey: showLoginWithPasskey,
        showVeChainLogin: showLoginWithVeChain,
        showDappKit: showLoginWithDappKit,
        showEcosystem: showEcosystemLogin,
        showMoreLogin: showMoreLogin,
        showGithubLogin: showLoginWithGithub,
        isOfficialVeChainApp: false,
    };

    if (!privy) {
        // External apps (no self hosted privy)
        return {
            ...baseConfig,
            showGoogleLogin: false,
            showEmailLogin: false,
            showPasskey: false,
            showMoreLogin: false,
        };
    }

    if (isVeChainApp) {
        // VeChain app (using self hosted privy)
        return {
            ...baseConfig,
            isOfficialVeChainApp: true,
        };
    }

    // Self hosted privy app
    return {
        ...baseConfig,
    };
};
