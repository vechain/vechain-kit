import { useVeChainKitConfig } from '@/providers';
import { VECHAIN_PRIVY_APP_ID } from '@/utils';
import { useMemo } from 'react';

type LoginModalContentConfig = {
    showSocialLogin: boolean;
    showPasskey: boolean;
    showVeChainLogin: boolean;
    showDappKit: boolean;
    showEcosystem: boolean;
    showMoreLogin: boolean;
    isOfficialVeChainApp: boolean;
};

export const useLoginModalContent = (): LoginModalContentConfig => {
    const { privy, loginMethods } = useVeChainKitConfig();

    const isVeChainApp = privy?.appId === VECHAIN_PRIVY_APP_ID;
    // The ways to show the ecosystem login button are:
    // 1. The user has defined the loginMethods in the config
    // 2. The user has not defined the loginMethods in the config so we default to showing the ecosystem login button
    //
    // To not show the ecosystem login button, the user must explicitly define the loginMethods in the config and not include the ecosystem login button
    const showEcosystemLogin = useMemo(() => {
        // by default we always show the ecosystem login button
        if (!loginMethods) return true;

        // if loginMethods is defined by the user BUT there is no ecosystem then we return false
        if (
            loginMethods.length > 0 &&
            !loginMethods?.find((method) => method.method === 'ecosystem')
        ) {
            return false;
        }

        return true;
    }, [loginMethods]);

    if (!privy) {
        // External apps (no self hosted privy)
        return {
            showSocialLogin: false,
            showPasskey: false,
            showVeChainLogin: true,
            showDappKit: true,
            showEcosystem: showEcosystemLogin,
            showMoreLogin: false,
            isOfficialVeChainApp: false,
        };
    }

    // Will be used by VeBetterDAO or any other official VeChain app
    if (isVeChainApp) {
        // VeChain app (using self hosted privy)
        return {
            showSocialLogin: false,
            showPasskey: false,
            showVeChainLogin: true,
            showDappKit: true,
            showEcosystem: showEcosystemLogin,
            showMoreLogin: false,
            isOfficialVeChainApp: true,
        };
    }

    // Self hosted privy app

    // Check if we need to show the "more login options" button
    const showMoreLogin = useMemo(() => {
        if (!loginMethods) return true;

        return loginMethods.some((method) => method.method === 'more');
    }, [loginMethods]);

    return {
        showSocialLogin: true,
        showPasskey: true,
        showVeChainLogin: true,
        showDappKit: true,
        showEcosystem: showEcosystemLogin,
        showMoreLogin: showMoreLogin,
        isOfficialVeChainApp: false,
    };
};
