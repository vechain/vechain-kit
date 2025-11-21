'use client';

import { useColorMode } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import '../../../i18n';
import { useTranslation } from 'react-i18next';
import { NETWORK_TYPE } from '@vechain-kit/config/network';

// Dynamic import is used here for several reasons:
// 1. The VechainKit component uses browser-specific APIs that aren't available during server-side rendering
// 2. Code splitting - this component will only be loaded when needed, reducing initial bundle size
// 3. The 'ssr: false' option ensures this component is only rendered on the client side
const VeChainKitProvider = dynamic(
    async () => (await import('@vechain/vechain-kit')).VeChainKitProvider,
    {
        ssr: false,
    },
);

interface Props {
    children: React.ReactNode;
}

export function VechainKitProviderWrapper({ children }: Props) {
    const { colorMode } = useColorMode();
    const { i18n } = useTranslation();

    const isDarkMode = colorMode === 'dark';

    const logo =
        'https://vechain-brand-assets.s3.eu-north-1.amazonaws.com/VeChain_Logomark_Light.png';

    return (
        <VeChainKitProvider
            theme={{
                backgroundColor: isDarkMode ? '#1b1d1e' : '#ffffff',
                textColor: isDarkMode ? '#ffffff' : '#272A2E',
                buttons: {
                    secondaryButton: {
                        border: 'none',
                        bg: isDarkMode
                            ? 'rgb(45, 45, 45)'
                            : 'rgb(240, 240, 240)',
                    },
                },
            }}
            privy={{
                appId: process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
                clientId: process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID!,
                loginMethods: [
                    'google',
                    'apple',
                    'twitter',
                    'github',
                    'farcaster',
                    // 'email',
                    'discord',
                    'tiktok',
                    // 'rabby_wallet',
                    // 'coinbase_wallet',
                    // 'rainbow',
                    // 'metamask',
                ],
                appearance: {
                    loginMessage: 'Select a login method',
                    logo: logo,
                },
                embeddedWallets: {
                    createOnLogin: 'all-users',
                },
            }}
            dappKit={{
                allowedWallets: ['veworld', 'wallet-connect'],
                walletConnectOptions: {
                    projectId:
                        process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
                    metadata: {
                        name: 'VeChainKit Demo App',
                        description:
                            'This is a demo app to show you how the VechainKit works.',
                        url:
                            typeof window !== 'undefined'
                                ? window.location.origin
                                : '',
                        icons: [typeof window !== 'undefined' ? logo : ''],
                    },
                },
            }}
            loginMethods={[
                // { method: 'email', gridColumn: 4 },
                // { method: 'google', gridColumn: 4 },
                // { method: 'github', gridColumn: 4 },
                { method: 'vechain', gridColumn: 4 },
                { method: 'dappkit', gridColumn: 4 },
                { method: 'ecosystem', gridColumn: 4 },
                // { method: 'passkey', gridColumn: 1 },
                // { method: 'more', gridColumn: 1 },
            ]}
            darkMode={isDarkMode}
            language={i18n.language}
            network={{
                type: process.env.NEXT_PUBLIC_NETWORK_TYPE as NETWORK_TYPE,
                // nodeUrl: 'http://localhost:8669',
            }}
            allowCustomTokens={true}
        >
            {children}
        </VeChainKitProvider>
    );
}
