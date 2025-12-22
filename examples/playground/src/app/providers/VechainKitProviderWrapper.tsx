'use client';

import { useColorMode } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { resources } from '../../../i18n';
import i18n from '../../../i18n';

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

function LanguageSync({ children }: Props) {
    useEffect(() => {
        // Sync playground i18n with VeChainKit language changes via localStorage
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'i18nextLng' && e.newValue) {
                const newLang = e.newValue;
                if (i18n.language !== newLang) {
                    i18n.changeLanguage(newLang);
                }
            }
        };

        // Listen to playground i18n changes (from dropdown) and ensure localStorage is updated
        const handleLanguageChanged = (lng: string) => {
            if (typeof window !== 'undefined') {
                const stored = localStorage.getItem('i18nextLng');
                if (stored !== lng) {
                    localStorage.setItem('i18nextLng', lng);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        i18n.on('languageChanged', handleLanguageChanged);

        // Poll for changes (in case storage event doesn't fire)
        const interval = setInterval(() => {
            const stored = localStorage.getItem('i18nextLng');
            if (stored && stored !== i18n.language) {
                i18n.changeLanguage(stored);
            }
        }, 500);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            i18n.off('languageChanged', handleLanguageChanged);
            clearInterval(interval);
        };
    }, []);

    return <>{children}</>;
}

export function VechainKitProviderWrapper({ children }: Props) {
    const { colorMode } = useColorMode();
    const isDarkMode = colorMode === 'dark';

    const logo =
        'https://vechain-brand-assets.s3.eu-north-1.amazonaws.com/VeChain_Logomark_Light.png';

    const [kitLanguage, setKitLanguage] = useState<string>(
        typeof window !== 'undefined'
            ? localStorage.getItem('i18nextLng') || 'en'
            : 'en',
    );

    useEffect(() => {
        // Sync VeChainKit language prop with localStorage changes
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'i18nextLng' && e.newValue) {
                setKitLanguage(e.newValue);
            }
        };

        const storedLanguage =
            typeof window !== 'undefined'
                ? localStorage.getItem('i18nextLng')
                : null;
        if (storedLanguage) {
            setKitLanguage(storedLanguage);
        }

        window.addEventListener('storage', handleStorageChange);

        // Poll for changes
        const interval = setInterval(() => {
            const stored = localStorage.getItem('i18nextLng');
            if (stored && stored !== kitLanguage) {
                setKitLanguage(stored);
            }
        }, 500);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, [kitLanguage]);

    // Transform resources to match I18n type (extract translation objects)
    const playgroundTranslations = Object.keys(resources).reduce((acc, lang) => {
        acc[lang] = resources[lang as keyof typeof resources].translation;
        return acc;
    }, {} as Record<string, Record<string, string>>);

    const theme = isDarkMode
        ? {
              textColor: 'white',
              modal: {
                  backgroundColor: 'rgba(21, 21, 21)',
                  border: '1px solid rgba(255, 255, 255, 0.20)',
                  backdropFilter: 'blur(20px)',
                  rounded: '32px',
                  useBottomSheetOnMobile: true,
              },
              overlay: {
                  backgroundColor: 'rgba(0, 0, 0, 0.24)',
                  blur: 'blur(15px)',
              },
              buttons: {
                  secondaryButton: {
                      bg: 'rgb(255 255 255 / 4%)',
                      color: 'white',
                  },
              },
          }
        : {
              textColor: '#272A2E',
              modal: {
                  backgroundColor: 'rgba(255, 255, 255)',
                  border: '1px solid rgba(39, 42, 46, 0.12)',
                  backdropFilter: 'blur(20px)',
                  rounded: '32px',
                  useBottomSheetOnMobile: true,
              },
              overlay: {
                  backgroundColor: 'rgba(0, 0, 0, 0.16)',
                  blur: 'blur(15px)',
              },
              buttons: {
                  secondaryButton: {
                      bg: 'rgba(39, 42, 46, 0.08)',
                      color: '#272A2E',
                  },
                  loginButton: {
                      border: '1px solid rgba(39, 42, 46, 0.12)',
                  },
              },
          };

    return (
        <VeChainKitProvider
            theme={theme}
            language={kitLanguage}
            i18n={playgroundTranslations}
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
                // { method: 'passkey', gridColumn: 4 },
                // { method: 'more', gridColumn: 1 },
            ]}
            darkMode={isDarkMode}
            network={{
                type: 'main',
                // nodeUrl: 'http://localhost:8669',
            }}
            allowCustomTokens={true}
        >
            <LanguageSync>{children}</LanguageSync>
        </VeChainKitProvider>
    );
}
