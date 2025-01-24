'use client';

import { ChakraProvider } from '@chakra-ui/react';
import './globals.css';
import dynamic from 'next/dynamic';
import { darkTheme } from './theme';
import { Metadata } from 'next';
const VechainKitProviderWrapper = dynamic(
    async () =>
        (await import('./providers/VechainKitProviderWrapper'))
            .VechainKitProviderWrapper,
    {
        ssr: false,
    },
);

export const metadata: Metadata = {
    title: 'VeChain Kit',
    description:
        'VeChain Kit - A powerful and intuitive toolkit for building and interacting with decentralized applications on VeChain blockchain.',
    openGraph: {
        title: 'VeChain Kit',
        description:
            'VeChain Kit - A powerful and intuitive toolkit for building and interacting with decentralized applications on VeChain blockchain.',
        images: ['https://i.ibb.co/ncysMF9/vechain-kit-logo-transparent.png'],
    },
    icons: {
        icon: 'https://i.ibb.co/ncysMF9/vechain-kit-logo-transparent.png',
    },
};

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
