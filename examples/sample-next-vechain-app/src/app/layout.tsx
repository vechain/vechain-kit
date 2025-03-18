'use client';

import { ChakraProvider } from '@chakra-ui/react';
import './globals.css';
import dynamic from 'next/dynamic';
import { lightTheme } from './theme/theme';

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
                <title>Privy Next JS</title>
            </head>
            <body>
                {/* Chakra UI Provider */}
                <ChakraProvider theme={lightTheme}>
                    {/* VechainKit Provider */}
                    <VechainKitProvider>{children}</VechainKitProvider>
                </ChakraProvider>
            </body>
        </html>
    );
}
