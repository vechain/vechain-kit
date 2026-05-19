import Script from 'next/script';
import { PrivyProviderWrapper } from './providers/PrivyProviderWrapper';
import { I18nProvider } from './i18n/I18nProvider';
import './globals.css';

// Pre-paint script: set `data-color-mode` on <html> from
// `prefers-color-scheme` so CSS vars resolve before first paint and we don't
// flash light → dark on cold load. Defaults to 'light' if matchMedia isn't
// available (older browsers). Uses Next's <Script> with the
// `beforeInteractive` strategy so it runs *before* React hydrates and
// doesn't trip React 19's "script in component" warning.
const colorModeScript = `(function(){try{var d=window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.dataset.colorMode=d?'dark':'light';}catch(e){document.documentElement.dataset.colorMode='light';}})();`;

export const metadata = {
    title: 'VeChain Connect',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning data-color-mode="light">
            <head>
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
                <Script
                    id="vk-color-mode"
                    strategy="beforeInteractive"
                >
                    {colorModeScript}
                </Script>
                <I18nProvider>
                    <PrivyProviderWrapper>{children}</PrivyProviderWrapper>
                </I18nProvider>
            </body>
        </html>
    );
}
