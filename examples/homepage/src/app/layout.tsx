'use client';

import { ChakraProvider, useColorMode } from '@chakra-ui/react';
import './globals.css';
import dynamic from 'next/dynamic';
import { darkTheme } from './theme';
import { useEffect, useState } from 'react';

const VechainKitProviderWrapper = dynamic(
    async () =>
        (await import('./providers/VechainKitProviderWrapper'))
            .VechainKitProviderWrapper,
    {
        ssr: false,
    },
);

function AppContent({ children }: { children: React.ReactNode }) {
    const { colorMode } = useColorMode();
    const [bgColor, setBgColor] = useState('#0E0E0E');

    useEffect(() => {
        setBgColor(colorMode === 'dark' ? '#0E0E0E' : '#FFFFFF');
    }, [colorMode]);

    return (
        <body
            className="background-wrapper"
            style={{
                backgroundImage:
                    colorMode === 'dark'
                        ? 'url(/images/spider-web-element-onblack-background-transparent.png)'
                        : 'none',
                backgroundSize: '150%',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundColor: bgColor,
                transition: 'background-color 0.2s ease-in-out',
            }}
        >
            <VechainKitProviderWrapper>{children}</VechainKitProviderWrapper>
        </body>
    );
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
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
                    content="width=device-width, initial-scale=1.0"
                />
                <link rel="icon" href="/images/logo.png" type="image/png" />
                <link
                    rel="apple-touch-icon"
                    sizes="57x57"
                    href="/images/favicon/apple-touch-icon.png"
                />
                <meta
                    name="msapplication-TileImage"
                    content="/images/favicon/apple-touch-icon.png"
                />

                {/* Open Graph Metadata */}
                <meta name="title" property="og:title" content="VeChain Kit" />
                <meta name="type" property="og:type" content="website" />
                <meta
                    property="og:url"
                    content="https://vechain-kit.vechain.org/"
                />
                <meta
                    property="og:description"
                    content="VeChain Kit - A powerful and intuitive toolkit for building and interacting with decentralized applications on VeChain blockchain."
                />
                <meta property="og:site_name" content="VeChain Kit" />
                <meta
                    property="og:image"
                    content="/images/vechain-kit-long.png"
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
                    content="/images/vechain-kit-long.png"
                />
                <meta name="twitter:image:alt" content="VeChain Kit" />
            </head>
            <ChakraProvider theme={darkTheme}>
                <AppContent>{children}</AppContent>
            </ChakraProvider>
        </html>
    );
}
