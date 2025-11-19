'use client';

import { useColorMode } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import '../../../i18n';
import { useTranslation } from 'react-i18next';
import { NETWORK_TYPE } from '@vechain-kit/config/network';
import type { VechainKitThemeConfig } from '@vechain-kit/theme';

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

    // Glass effect theme configuration
    // This matches the hardcoded values you tested and liked
    const glassTheme: VechainKitThemeConfig = {
        colors: {
            background: {
                // Modal with glass effect (40% opacity)
                modal: isDarkMode
                    ? 'rgba(21, 21, 21, 0.4)'
                    : 'rgba(255, 255, 255, 0.4)',
                // Overlay colors matching your hardcoded values
                // overlay: isDarkMode ? 'rgb(255, 19, 19)' : '#00000024'
                // Card backgrounds - > should this be taken from the primary color?
                card: isDarkMode
                    ? 'rgba(255, 14, 14, 0.4)'
                    : 'rgba(255, 255, 255, 0.4)',
                cardElevated: isDarkMode
                    ? 'rgba(21, 21, 21, 0.6)'
                    : 'rgba(255, 255, 255, 0.6)',
                // Sticky header (will be conditional based on hasContentBelow)
                stickyHeader: isDarkMode
                    ? 'rgba(21, 21, 21, 0.6)'
                    : 'rgba(255, 255, 255, 0.6)',
            },
            // DAppKit primary colors (for wallet cards)
            primary: isDarkMode
                ? {
                      base: 'rgba(242, 8, 8, 0.93)',
                      hover: 'rgb(75, 219, 19)',
                      active: 'rgba(255, 255, 255, 0.1)',
                  }
                : {
                      base: 'rgba(255, 255, 255, 0.4)',
                      hover: 'rgba(248, 248, 248, 0.5)',
                      active: 'rgba(240, 240, 240, 0.6)',
                  },
            // DAppKit secondary colors
            secondary: isDarkMode
                ? {
                      base: 'rgba(26, 121, 238, 0.6)',
                      hover: 'rgba(12, 194, 40, 0.7)',
                      active: 'rgba(21, 21, 21, 0.8)',
                  }
                : {
                      base: 'rgba(255, 255, 255, 0.6)',
                      hover: 'rgba(255, 255, 255, 0.7)',
                      active: 'rgba(255, 255, 255, 0.8)',
                  },
            tertiary: {
                base: 'rgba(227, 21, 249, 0.89)', // or your desired color
                hover: 'rgba(33, 192, 25, 0.2)',
                active: 'rgba(255, 255, 255, 0.3)',
            },
            border: {
                default: isDarkMode ? '#ffffff0a' : '#ebebeb',
            },
            text: {
                primary: isDarkMode ? 'rgba(227, 21, 249, 0.89)' : '#2e2e2e',
                secondary: isDarkMode ? 'rgba(108, 249, 21, 0.89)' : '#4d4d4d',
                tertiary: isDarkMode ? 'rgba(21, 37, 223, 0.89)' : '#a0aec0',
                disabled: isDarkMode ? 'rgba(249, 21, 21, 0.89)' : '#a0aec0',
            },
        },

        effects: {
            backdropFilter: {
                modal: 'blur(15px)', // Modal backdrop blur
                overlay: 'blur(2px)', // Overlay backdrop blur (from BaseModal default)
                stickyHeader: 'blur(15px)', // Sticky header blur when hasContentBelow
            },
        },
    };

    return (
        <VeChainKitProvider
            // theme={glassTheme}
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
