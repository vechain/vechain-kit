import { Providers } from './providers';

export const metadata = {
    title: 'VeChain Kit · Chakra v3 + next-themes repro',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
