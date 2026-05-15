'use client';

import dynamic from 'next/dynamic';

const VeChainKitProvider = dynamic(
    async () => (await import('@vechain/vechain-kit')).VeChainKitProvider,
    { ssr: false },
);

interface Props {
    children: React.ReactNode;
}

const coloredLogo =
    'https://vechain.org/wp-content/uploads/2025/02/VeChain_Icon_Quartz_300ppi.png';

export function VechainKitProviderWrapper({ children }: Props) {
    return (
        <VeChainKitProvider
            privy={{
                appId: process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
                clientId: process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID!,
                loginMethods: [
                    'google',
                    'apple',
                    'twitter',
                    'email',
                    'discord',
                ],
                appearance: {
                    loginMessage: 'Sign in to continue',
                    logo: coloredLogo,
                },
                embeddedWallets: {
                    createOnLogin: 'all-users',
                },
            }}
            dappKit={{
                allowedWallets: ['veworld', 'wallet-connect'],
                walletConnectOptions: process.env
                    .NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID
                    ? {
                          projectId:
                              process.env
                                  .NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
                          metadata: {
                              name: 'VeChain Cross-App Connect',
                              description:
                                  'Whitelabel cross-app connect host for VeChain',
                              url:
                                  typeof window !== 'undefined'
                                      ? window.location.origin
                                      : '',
                              icons: [coloredLogo],
                          },
                      }
                    : undefined,
            }}
            loginMethods={[{ method: 'veworld', gridColumn: 4 }]}
            darkMode
            network={{
                type:
                    process.env.NEXT_PUBLIC_NETWORK_TYPE ?? 'main',
            }}
            feeDelegation={{
                delegatorUrl: process.env.NEXT_PUBLIC_DELEGATOR_URL,
            }}
        >
            {children}
        </VeChainKitProvider>
    );
}
