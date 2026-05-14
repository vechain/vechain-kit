'use client';
import { useChakraContext, useToken } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import { useColorMode } from '@/components/ui/color-mode';

// Same dynamic-import-with-ssr-false pattern b3tr uses.
const VeChainKitProvider = dynamic(
    () =>
        import('@vechain/vechain-kit').then((mod) => mod.VeChainKitProvider),
    { ssr: false },
);

interface Props {
    readonly children: React.ReactNode;
}

export function VechainKitProviderWrapper({ children }: Props) {
    const { colorMode } = useColorMode();
    const isDarkMode = colorMode === 'dark';

    // KEY REPRODUCTION DETAIL: `useToken` in Chakra v3 returns the CSS
    // variable reference (e.g. `var(--vbd-colors-bg-primary)`), NOT the
    // resolved color. Its value flips at paint time based on
    // `html.class="dark"`. The kit must keep these references intact so they
    // stay reactive — any path inside the kit that snapshots the resolved
    // color (e.g. by appending a temp element to the DOM and reading
    // computed style) freezes the value at render time and breaks the
    // theme toggle for everything derived from it.
    // Chakra v3 quirk: `useToken('colors', 'bg.primary')` returns the
    // resolved literal value (e.g. `#1B1D1F`) at render time, NOT a CSS
    // variable reference. That snapshot is darkMode-frozen and breaks
    // theme toggling once it's piped into the kit. Use `sys.token.var(...)`
    // (or build `var(--vbd-colors-bg-primary)` by hand) so the value stays
    // reactive to host theme changes.
    const sys = useChakraContext();
    const tokVar = (path: string) =>
        sys.token.var(`colors.${path}`) as string;
    const bgPrimary = tokVar('bg.primary');
    const primaryDefault = tokVar('actions.primary.default');
    const primaryText = tokVar('actions.primary.text');
    const primaryHover = tokVar('actions.primary.hover');
    const secondaryDefault = tokVar('card.subtle');
    const secondaryHover = tokVar('card.hover');
    const borderSecondary = tokVar('border.secondary');
    // (still importing useToken for shape parity with b3tr's wrapper, even
    // though we don't call it — left as a reminder that this is the broken
    // path we're avoiding)
    void useToken;

    return (
        <VeChainKitProvider
            theme={{
                modal: {
                    backgroundColor: bgPrimary,
                    border: `1px solid ${borderSecondary}`,
                    useBottomSheetOnMobile: true,
                },
                buttons: {
                    primaryButton: {
                        bg: primaryDefault,
                        color: primaryText,
                        hoverBg: primaryHover,
                        rounded: 'full',
                    },
                    secondaryButton: {
                        border: `1px solid ${borderSecondary}`,
                        bg: secondaryDefault,
                        hoverBg: secondaryHover,
                    },
                },
            }}
            privy={{
                appId:
                    process.env.NEXT_PUBLIC_PRIVY_APP_ID ||
                    'cm4wxxujb022fyujl7g0thb21',
                clientId:
                    process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID ||
                    'client-WY5eXujRFovfkYSxufm6NM9CjAzeTqFw5tSd4hJPyA9nk',
                loginMethods: ['google', 'apple', 'twitter'],
                appearance: {
                    loginMessage: 'Select a login method',
                    logo: 'https://vechain-brand-assets.s3.eu-north-1.amazonaws.com/VeChain_Logomark_Light.png',
                },
                embeddedWallets: { createOnLogin: 'all-users' },
            }}
            dappKit={{
                allowedWallets: ['veworld', 'wallet-connect'],
                walletConnectOptions: {
                    projectId:
                        process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID ||
                        '06c045cd12ae0906fe5ad7d737fcdc04',
                    metadata: {
                        name: 'next-chakra-v3 repro',
                        description: 'Reproduces b3tr theme integration',
                        url:
                            typeof window !== 'undefined'
                                ? window.location.origin
                                : '',
                        icons: [],
                    },
                },
            }}
            loginMethods={[
                { method: 'veworld', gridColumn: 4 },
                { method: 'vechain', gridColumn: 4 },
                { method: 'dappkit', gridColumn: 4 },
                { method: 'ecosystem', gridColumn: 4 },
            ]}
            darkMode={isDarkMode}
            network={{ type: 'main' }}
        >
            {children}
        </VeChainKitProvider>
    );
}
