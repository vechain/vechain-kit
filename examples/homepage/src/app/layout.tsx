'use client';

import { ChakraProvider } from '@chakra-ui/react';
import './globals.css';
import dynamic from 'next/dynamic';
import { darkTheme } from './theme';

const VechainKitProviderWrapper = dynamic(
    async () =>
        (await import('./providers/VechainKitProviderWrapper'))
            .VechainKitProviderWrapper,
    {
        ssr: false,
    },
);

function AppContent({ children }: { children: React.ReactNode }) {
    return <VechainKitProviderWrapper>{children}</VechainKitProviderWrapper>;
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
                    content="width=device-width, initial-scale=1.0"
                />
                <link rel="icon" href={`${basePath}/images/logo.png`} type="image/png" />
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
            </head>
            <body
                style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'inherit',
                }}
            >
                <ChakraProvider theme={darkTheme}>
                    <AppContent>{children}</AppContent>
                </ChakraProvider>
            </body>
        </html>
    );
}
