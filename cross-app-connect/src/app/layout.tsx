'use client';

import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import { vechainTheme } from './theme';
import { ColorModeToggle } from './components/ColorModeToggle';
import './globals.css';

const VechainKitProviderWrapper = dynamic(
    async () =>
        (await import('./providers/VechainKitProviderWrapper'))
            .VechainKitProviderWrapper,
    { ssr: false },
);

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning={true}>
            <head>
                <title>VeChain Cross-App Connect</title>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body suppressHydrationWarning>
                <ColorModeScript
                    initialColorMode={vechainTheme.config.initialColorMode}
                />
                <ChakraProvider theme={vechainTheme}>
                    <VechainKitProviderWrapper>
                        {children}
                        <ColorModeToggle />
                    </VechainKitProviderWrapper>
                </ChakraProvider>
            </body>
        </html>
    );
}
