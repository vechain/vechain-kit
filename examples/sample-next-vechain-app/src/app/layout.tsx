'use client';

import { ChakraProvider } from '@chakra-ui/react';
import './globals.css';
import dynamic from 'next/dynamic';
import { darkTheme } from './theme';
const VechainKitProvider = dynamic(
    async () =>
        (await import('./providers/VechainKitProvider')).VechainKitProvider,
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
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <title>Vechain Kit Sample App</title>
            </head>
            <body>
                {/* Chakra UI Provider */}
                <ChakraProvider theme={darkTheme}>
                    {/* VechainKit Provider */}
                    <VechainKitProvider>{children}</VechainKitProvider>
                </ChakraProvider>
            </body>
        </html>
    );
}
