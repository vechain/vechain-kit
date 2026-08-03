'use client';

import { PrivyProvider } from '@privy-io/react-auth';

const coloredLogo =
    'https://vechain.org/wp-content/uploads/2025/02/VeChain_Icon_Quartz_300ppi.png';

interface Props {
    children: React.ReactNode;
}

/**
 * Minimal Privy provider for the cross-app host. We don't wrap the kit's
 * VeChainKitProvider (DAppKit + PrivyWalletProvider + ModalProvider) because
 * this app only signs and hands the signature back -- the broadcast happens
 * in the requester's app. On-chain reads use ThorClient directly via
 * `cross-app/_lib/thor.ts`.
 */
export function PrivyProviderWrapper({ children }: Props) {
    const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
    if (!appId) {
        throw new Error(
            'NEXT_PUBLIC_PRIVY_APP_ID is required to bootstrap the ' +
                'cross-app host. Set it in the environment before building.',
        );
    }
    return (
        <PrivyProvider
            appId={appId}
            clientId={process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID}
            config={{
                loginMethodsAndOrder: {
                    primary: ['google', 'apple', 'twitter', 'email'],
                    overflow: ['discord'],
                },
                externalWallets: {
                    walletConnect: { enabled: false },
                },
                appearance: {
                    theme: 'light',
                    loginMessage: 'Sign in to continue',
                    logo: coloredLogo,
                },
                embeddedWallets: {
                    ethereum: {
                        createOnLogin: 'all-users',
                    },
                },
                passkeys: {
                    shouldUnlinkOnUnenrollMfa: false,
                },
            }}
        >
            {children}
        </PrivyProvider>
    );
}
