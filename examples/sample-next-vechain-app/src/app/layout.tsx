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
        <html lang="en" suppressHydrationWarning={true}>
            <head>
                <link
                    rel="icon"
                    href="https://i.ibb.co/BcCrSj9/vechain-kit-logo-colored.png"
                    type="image/png"
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />

                <title>Vechain Kit Sample App</title>
                <meta
                    name="description"
                    content="VeChain Kit - A powerful and intuitive toolkit for building and interacting with decentralized applications on VeChain blockchain."
                />

                <meta
                    property="og:url"
                    content="https://sample-vechain-app-demo.vechain.org/"
                />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Vechain Kit Sample App" />
                <meta
                    property="og:description"
                    content="VeChain Kit - A powerful and intuitive toolkit for building and interacting with decentralized applications on VeChain blockchain."
                />
                <meta
                    property="og:image"
                    content="https://i.ibb.co/ncysMF9/vechain-kit-logo-transparent.png"
                />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Vechain Kit Sample App" />
                <meta
                    name="twitter:description"
                    content="VeChain Kit - A powerful and intuitive toolkit for building and interacting with decentralized applications on VeChain blockchain."
                />
                <meta
                    name="twitter:image"
                    content="https://i.ibb.co/ncysMF9/vechain-kit-logo-transparent.png"
                />
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
