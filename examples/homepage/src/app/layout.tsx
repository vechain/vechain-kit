'use client';

import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import './globals.css';
import dynamic from 'next/dynamic';
import { theme } from './theme';
// Initialize i18n
import '../../i18n';

const VechainKitProviderWrapper = dynamic(
    async () =>
        (await import('./providers/VechainKitProviderWrapper'))
            .VechainKitProviderWrapper,
    {
        ssr: false,
    },
);

const ForceLightMode = dynamic(
    async () => (await import('./components/ForceLightMode')).ForceLightMode,
    {
        ssr: false,
    },
);

function AppContent({ children }: { children: React.ReactNode }) {
    return (
        <>
            <ForceLightMode />
            <VechainKitProviderWrapper>{children}</VechainKitProviderWrapper>
        </>
    );
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const basePath = process.env.basePath ?? '';
    return (
        <html
            lang="en"
            suppressHydrationWarning={true}
            style={{
                scrollBehavior: 'smooth',
            }}
        >
            <head>
                <title>VeChain Kit</title>
                <meta
                    name="description"
                    content="VeChain Kit - A powerful and intuitive toolkit for building and interacting with decentralized applications on VeChain blockchain."
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0, maximum-scale=1.0"
                />
                <link
                    rel="icon"
                    href={`${basePath}/images/logo.png`}
                    type="image/png"
                />
                <link
                    rel="apple-touch-icon"
                    sizes="57x57"
                    href={`${basePath}/images/favicon/apple-touch-icon.png`}
                />
                <meta
                    name="msapplication-TileImage"
                    content={`${basePath}/images/favicon/apple-touch-icon.png`}
                />

                {/* Open Graph Metadata */}
                <meta name="title" property="og:title" content="VeChain Kit" />
                <meta name="type" property="og:type" content="website" />
                <meta
                    property="og:url"
                    content="https://vechainkit.vechain.org/"
                />
                <meta
                    property="og:description"
                    content="VeChain Kit - A powerful and intuitive toolkit for building and interacting with decentralized applications on VeChain blockchain."
                />
                <meta property="og:site_name" content="VeChain Kit" />
                <meta
                    property="og:image"
                    content={`${basePath}/images/vechain-kit-long.png`}
                />
                <meta property="og:image:type" content="image/png" />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:image:alt" content="VeChain Kit" />

                {/* Twitter Metadata */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="VeChain Kit" />
                <meta
                    name="twitter:description"
                    content="VeChain Kit - A powerful and intuitive toolkit for building and interacting with decentralized applications on VeChain blockchain."
                />
                <meta
                    name="twitter:image"
                    content={`${basePath}/images/vechain-kit-long.png`}
                />
                <meta name="twitter:image:alt" content="VeChain Kit" />

                {/* Fonts */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap"
                    rel="stylesheet"
                />
                <link
                    href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap"
                    rel="stylesheet"
                />
                <ColorModeScript initialColorMode="light" />
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            (function() {
                                // Clear any cached dark mode preferences before React hydrates
                                const possibleKeys = [
                                    'chakra-ui-color-mode-vechain-kit-homepage',
                                    'chakra-ui-color-mode',
                                    'vechain-kit-homepage-color-mode'
                                ];
                                possibleKeys.forEach(function(key) {
                                    try {
                                        var stored = localStorage.getItem(key);
                                        if (stored && stored !== 'light') {
                                            localStorage.setItem(key, 'light');
                                        }
                                    } catch(e) {}
                                });
                            })();
                        `,
                    }}
                />
            </head>
            <body
                style={{
                    width: '100%',
                    height: '100%',
                }}
            >
                <ChakraProvider theme={theme}>
                    <AppContent>{children}</AppContent>
                </ChakraProvider>
            </body>
        </html>
    );
}
