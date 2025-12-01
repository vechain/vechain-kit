'use client';

import { useCallback } from 'react';
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

    // Listen to VeChainKit language changes and sync to host app's i18n
    const handleLanguageChange = useCallback(
        (language: string) => {
            i18n.changeLanguage(language);
        },
        [i18n],
    );

    // Listen to VeChainKit currency changes (host app can use this for its own state if needed)
    const handleCurrencyChange = useCallback(
        (currency: 'usd' | 'eur' | 'gbp') => {
            // Host app can handle currency changes here if needed
            // The kit already persists to localStorage
        },
        [],
    );

    const coloredLogo =
        'https://i.ibb.co/7G4PQNZ/vechain-kit-logo-colored-circle.png';

    return (
        <VeChainKitProvider
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
            language="en"
            defaultCurrency="usd"
            onLanguageChange={handleLanguageChange}
            onCurrencyChange={handleCurrencyChange}
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
