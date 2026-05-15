import { useVeChainKitConfig } from '@/providers';
import { VECHAIN_PRIVY_APP_ID } from '@/utils';
import { useMemo } from 'react';

type LoginModalContentConfig = {
    showGoogleLogin: boolean;
    showAppleLogin: boolean;
    showEmailLogin: boolean;
    showPasskey: boolean;
    showVeChainLogin: boolean;
    showDappKit: boolean;
    showVeWorld: boolean;
    showSync2: boolean;
    showWalletConnect: boolean;
    showEcosystem: boolean;
    showMoreLogin: boolean;
    showGithubLogin: boolean;
    isOfficialVeChainApp: boolean;
};

export const useLoginModalContent = (): LoginModalContentConfig => {
    const { privy, loginMethods, dappKit } = useVeChainKitConfig();
    const isVeChainApp = privy?.appId === VECHAIN_PRIVY_APP_ID;
    const allowedWallets = dappKit?.allowedWallets;

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
    const showLoginWithApple = useMemo(
        () => isLoginMethodEnabled('apple'),
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

    // Granular wallet methods. When the dev configured `dappKit.allowedWallets`,
    // also honor that gate so a method can never bypass it via `loginMethods`.
    const showLoginWithVeWorld = useMemo(() => {
        if (!isLoginMethodEnabled('veworld')) return false;
        if (!allowedWallets) return true;
        return allowedWallets.includes('veworld');
    }, [loginMethods, allowedWallets]);

    const showLoginWithSync2 = useMemo(() => {
        if (!isLoginMethodEnabled('sync2')) return false;
        if (!allowedWallets) return true;
        return allowedWallets.includes('sync2');
    }, [loginMethods, allowedWallets]);

    const showLoginWithWalletConnect = useMemo(() => {
        if (!isLoginMethodEnabled('wallet-connect')) return false;
        if (!allowedWallets) return true;
        return allowedWallets.includes('wallet-connect');
    }, [loginMethods, allowedWallets]);

    // Base configuration that's common across all cases
    const baseConfig: LoginModalContentConfig = {
        showGoogleLogin: showLoginWithGoogle,
        showAppleLogin: showLoginWithApple,
        showEmailLogin: showLoginWithEmail,
        showPasskey: showLoginWithPasskey,
        showVeChainLogin: showLoginWithVeChain,
        showDappKit: showLoginWithDappKit,
        showVeWorld: showLoginWithVeWorld,
        showSync2: showLoginWithSync2,
        showWalletConnect: showLoginWithWalletConnect,
        showEcosystem: showEcosystemLogin,
        showMoreLogin: showMoreLogin,
        showGithubLogin: showLoginWithGithub,
        isOfficialVeChainApp: false,
    };

    if (!privy) {
        // External apps (no self hosted privy). Most OAuth methods fall
        // back to the VeChain whitelabel cross-app flow via
        // useLoginWithVeChain({ intent }). Email / Passkey / 'more' have
        // no fallback (VeChain has email disabled), so they stay hidden.
        return {
            ...baseConfig,
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
