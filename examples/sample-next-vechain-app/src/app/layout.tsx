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
                <link
                    rel="icon"
                    href="/images/vechain-kit-long.svg"
                    type="image/svg+xml"
                />
                <link
                    rel="apple-touch-icon"
                    sizes="57x57"
                    href="/images/vechain-kit-long.svg"
                />
                <meta
                    name="msapplication-TileImage"
                    content="/images/vechain-kit-long.svg"
                />

                {/* Open Graph Metadata */}
                <meta name="title" property="og:title" content="VeChain Kit" />
                <meta name="type" property="og:type" content="website" />
                <meta
                    property="og:url"
                    content="https://sample-vechain-app-demo.vechain.org/"
                />
                <meta
                    property="og:description"
                    content="VeChain Kit - A powerful and intuitive toolkit for building and interacting with decentralized applications on VeChain blockchain."
                />
                <meta property="og:site_name" content="VeChain Kit" />
                <meta
                    property="og:image"
                    content="/images/vechain-kit-long.svg"
                />
                <meta property="og:image:type" content="image/svg+xml" />
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
                    content="/images/vechain-kit-long.svg"
                />
                <meta name="twitter:image:alt" content="VeChain Kit" />
            </head>
            <body>
                {/* Chakra UI Provider */}
                <ChakraProvider theme={darkTheme}>
                    {/* VechainKit Provider */}
                    <VechainKitProviderWrapper>
                        {children}
                    </VechainKitProviderWrapper>
                </ChakraProvider>
            </body>
        </html>
    );
}
