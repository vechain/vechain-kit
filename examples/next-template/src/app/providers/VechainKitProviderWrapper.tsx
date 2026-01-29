'use client';

import { useCallback } from 'react';
import { useColorMode } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import '../../../i18n';
import { useTranslation } from 'react-i18next';

// Dynamic import is used here for several reasons:
// 1. The VechainKit component uses browser-specific APIs that aren't available during server-side rendering
// 2. Code splitting - this component will only be loaded when needed, reducing initial bundle size
// 3. The 'ssr: false' option ensures this component is only rendered on the client side
const VeChainKitProvider = dynamic(
    async () =>
        (await import('@vechain/vechain-kit/providers')).VeChainKitProvider,
    {
        ssr: false,
    },
);

interface Props {
    children: React.ReactNode;
}

/**
 * OPTIMIZED CONFIGURATION
 *
 * This template demonstrates an optimized VeChain Kit setup for smaller bundle sizes:
 *
 * - NO Privy: Removes ~500KB by not loading @privy-io/react-auth
 * - NO Ecosystem login: Removes ~150KB by not loading wagmi
 * - DAppKit only: Uses direct wallet connections (VeWorld, WalletConnect)
 *
 * For apps that need social logins or ecosystem wallet connections,
 * see the `homepage` or `playground` examples which demonstrate full-featured setups.
 *
 * Expected bundle size: ~400KB (vs ~1.0MB+ for full-featured setup)
 */
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

    // Listen to VeChainKit currency changes (can be used for host app state if needed)
    const handleCurrencyChange = useCallback(
        (_currency: 'usd' | 'eur' | 'gbp') => {
            // Currency changes are handled by VeChainKit internally
            // Add any host app-specific logic here if needed
        },
        [],
    );

    return (
        <VeChainKitProvider
            // OPTIMIZED: No privy prop = Privy SDK not loaded (~500KB savings)
            // To enable social logins, add the privy prop (see homepage example)

            // DAppKit configuration for direct wallet connections
            dappKit={{
                allowedWallets: ['veworld', 'wallet-connect'],
                walletConnectOptions: {
                    projectId:
                        process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
                    metadata: {
                        name: 'VeChainKit Optimized Template',
                        description:
                            'A bundle-optimized VeChain Kit template using DAppKit only.',
                        url:
                            typeof window !== 'undefined'
                                ? window.location.origin
                                : '',
                        icons: [
                            typeof window !== 'undefined'
                                ? `${window.location.origin}/favicon.ico`
                                : '',
                        ],
                    },
                },
            }}
            // OPTIMIZED: Only dappkit login method = no ecosystem/wagmi loaded (~150KB savings)
            // No 'ecosystem' or 'vechain' methods means PrivyCrossAppProvider is not rendered
            loginMethods={[{ method: 'dappkit', gridColumn: 4 }]}
            loginModalUI={{
                description: 'Connect your VeChain wallet to continue.',
            }}
            darkMode={isDarkMode}
            onLanguageChange={handleLanguageChange}
            onCurrencyChange={handleCurrencyChange}
            network={{
                type: process.env.NEXT_PUBLIC_NETWORK_TYPE,
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
