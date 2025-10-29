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

    const coloredLogo =
        'https://vechain.org/wp-content/uploads/2025/02/VeChain_Icon_Quartz_300ppi.png';

    return (
        <VeChainKitProvider
            privy={{
                appId: process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
                clientId: process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID!,
                loginMethods: [
                    'google',
                    'apple',
                    'twitter',
                    'farcaster',
                    'email',
                    'discord',
                    'tiktok',
                    // 'rabby_wallet',
                    // 'coinbase_wallet',
                    // 'rainbow',
                    // 'phantom',
                    // 'metamask',
                ],
                appearance: {
                    loginMessage: 'Select a login method',
                    logo: coloredLogo,
                },
                embeddedWallets: {
                    createOnLogin: 'all-users',
                },
            }}
            feeDelegation={{
                // delegatorUrl: process.env.NEXT_PUBLIC_DELEGATOR_URL!,
                genericDelegatorUrl: process.env.NEXT_PUBLIC_GENERIC_DELEGATOR_URL!,
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
                        icons: [
                            typeof window !== 'undefined' ? coloredLogo : '',
                        ],
                    },
                },
            }}
            loginMethods={[
                // { method: 'email', gridColumn: 4 },
                // { method: 'google', gridColumn: 4 },
                { method: 'vechain', gridColumn: 4 },
                { method: 'dappkit', gridColumn: 4 },
                { method: 'ecosystem', gridColumn: 4 },
                // { method: 'passkey', gridColumn: 1 },
                // { method: 'more', gridColumn: 1 },
            ]}
            loginModalUI={{
                description:
                    'Choose between social login through VeChain or by connecting your wallet.',
            }}
            darkMode={isDarkMode}
            language={i18n.language}
            network={{
                type: process.env.NEXT_PUBLIC_NETWORK_TYPE! as NETWORK_TYPE,
            }}
            allowCustomTokens={true}
            legalDocuments={{
                termsAndConditions: [
                    {
                        url: 'https://vechainkit.vechain.org/terms',
                        version: 1,
                        required: true,
                        displayName: 'Example T&C',
                    },
                ],
            }}
        >
            {children}
        </VeChainKitProvider>
    );
}
