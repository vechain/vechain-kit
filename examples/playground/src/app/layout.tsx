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
                <title>VeKit Playground</title>
                <meta
                    name="description"
                    content="VeKit Playground - Live demos, code snippets and ready-made AI prompts for shipping VeChain dApps."
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
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
                <meta
                    name="title"
                    property="og:title"
                    content="VeKit Playground"
                />
                <meta name="type" property="og:type" content="website" />
                <meta
                    property="og:url"
                    content="https://playground.vechainkit.vechain.org/"
                />
                <meta
                    property="og:description"
                    content="VeKit Playground - Live demos, code snippets and ready-made AI prompts for shipping VeChain dApps."
                />
                <meta property="og:site_name" content="VeKit Playground" />
                <meta
                    property="og:image"
                    content="https://prod-vechainkit-docs-images-bucket.s3.eu-west-1.amazonaws.com/banner-kit.png"
                />
                <meta property="og:image:type" content="image/png" />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:image:alt" content="VeKit Playground" />

                {/* Twitter Metadata */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta
                    name="twitter:title"
                    content="VeKit Playground"
                />
                <meta
                    name="twitter:description"
                    content="VeKit Playground - Live demos, code snippets and ready-made AI prompts for shipping VeChain dApps."
                />
                <meta
                    name="twitter:image"
                    content="https://prod-vechainkit-docs-images-bucket.s3.eu-west-1.amazonaws.com/banner-kit.png"
                />
                <meta name="twitter:image:alt" content="VeKit Playground" />

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
            </head>
            <body
                style={{
                    width: '100%',
                    height: '100%',
                }}
            >
                <ChakraProvider theme={darkTheme}>
                    <AppContent>{children}</AppContent>
                </ChakraProvider>
            </body>
        </html>
    );
}
