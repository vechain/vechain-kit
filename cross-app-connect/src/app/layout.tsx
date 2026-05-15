'use client';

import { ChakraProvider } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import { darkTheme } from './theme';
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
            </head>
            <body>
                <ChakraProvider theme={darkTheme}>
                    <VechainKitProviderWrapper>
                        {children}
                    </VechainKitProviderWrapper>
                </ChakraProvider>
            </body>
        </html>
    );
}
