'use client';

import { useColorMode } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import '../../../i18n';

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
    // const { i18n } = useTranslation();

    const isDarkMode = colorMode === 'dark';

    const appLogo = 'https://i.ibb.co/ncysMF9/vechain-kit-logo-transparent.png';
    const coloredLogo =
        'https://i.ibb.co/7G4PQNZ/vechain-kit-logo-colored-circle.png';

    return (
        <VeChainKitProvider
            // privy={{
            //     appId: process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
            //     clientId: process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID!,
            //     loginMethods: ['google', 'twitter', 'sms', 'email'],
            //     appearance: {
            //         walletList: ['metamask', 'rainbow'],
            //         accentColor: '#696FFD',
            //         loginMessage: 'Select a social media profile',
            //         logo: appLogo,
            //     },
            //     embeddedWallets: {
            //         createOnLogin: 'all-users',
            //     },

            //     allowPasskeyLinking: true,
            // }}
            feeDelegation={{
                delegatorUrl: process.env.NEXT_PUBLIC_DELEGATOR_URL!,
                delegateAllTransactions: false,
            }}
            dappKit={{
                allowedWallets: ['veworld', 'wallet-connect', 'sync2'],
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
            loginModalUI={{
                // preferredLoginMethods: ['google'],
                variant: 'vechain-and-wallet',
                logo: appLogo,
                description:
                    'Choose between social login through VeChain or by connecting your wallet.',
            }}
            // Uncomment this to remove the ecosystem button
            // privyEcosystemAppIDS={[]}
            darkMode={isDarkMode}
            language={'en'}
            network={{
                type: 'main',
                // connectionCertificate: {
                //     message: {
                //         purpose: 'identification',
                //         payload: {
                //             type: 'text',
                //             content:
                //                 'https://node.vechain.energy/connection-certificate',
                //         },
                //     },
                // },
            }}
        >
            {children}
        </VeChainKitProvider>
    );
}
