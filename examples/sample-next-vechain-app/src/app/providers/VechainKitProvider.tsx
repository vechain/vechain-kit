'use client';

import { useColorMode } from '@chakra-ui/react';
import dynamic from 'next/dynamic';

// Dynamic import is used here for several reasons:
// 1. The VechainKit component uses browser-specific APIs that aren't available during server-side rendering
// 2. Code splitting - this component will only be loaded when needed, reducing initial bundle size
// 3. The 'ssr: false' option ensures this component is only rendered on the client side
const VeChainKit = dynamic(
    async () => (await import('@vechain/vechain-kit')).VeChainKit,
    {
        ssr: false,
    },
);

interface Props {
    children: React.ReactNode;
}

export function VechainKitProvider({ children }: Props) {
    const { colorMode } = useColorMode();
    const isDarkMode = colorMode === 'dark';

    return (
        <VeChainKit
            // privy={{
            //     appId: process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
            //     clientId: process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID!,
            //     loginMethods: ['google', 'twitter', 'sms', 'email'],
            //     appearance: {
            //         walletList: ['metamask', 'rainbow'],
            //         accentColor: '#696FFD',
            //         loginMessage: 'Select a social media profile',
            //         logo: 'https://i.ibb.co/ZHGmq3y/image-21.png',
            //     },
            //     embeddedWallets: {
            //         createOnLogin: 'all-users',
            //     },

            //     allowPasskeyLinking: true,
            // }}
            feeDelegation={{
                delegatorUrl: process.env.NEXT_PUBLIC_DELEGATOR_URL!,
                delegateAllTransactions: true,
            }}
            dappKit={{
                allowedWallets: ['veworld', 'wallet-connect', 'sync2'],
                walletConnectOptions: {
                    projectId:
                        process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
                    metadata: {
                        name: 'Your App',
                        description: 'Your app description',
                        url:
                            typeof window !== 'undefined'
                                ? window.location.origin
                                : '',
                        icons: [
                            typeof window !== 'undefined'
                                ? `${window.location.origin}/images/logo/my-dapp.png`
                                : '',
                        ],
                    },
                },
            }}
            loginModalUI={{
                preferredLoginMethods: ['google'],
                logo: 'https://i.ibb.co/ZHGmq3y/image-21.png',
                description:
                    'Choose between social login through VeChain or by connecting your wallet.',
            }}
            darkMode={isDarkMode}
            language="en"
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
        </VeChainKit>
    );
}
