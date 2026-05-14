An all-in-one SDK for building frontend applications on VeChain, supporting wallet integration, developer hooks, pre-built UI components, and more.

<div align="center">
    <img src="https://prod-vechainkit-docs-images-bucket.s3.eu-west-1.amazonaws.com/vechain-kit-v2-shocase.png" alt="VeChain Kit Banner">
</div>

### Introduction

VeChain Kit is a comprehensive SDK designed to make building frontend applications on VeChain fast and straightforward. It offers:

-   <b>Seamless Wallet Integration:</b> Support for VeWorld, Sync2, WalletConnect, and social logins (Google, Apple, GitHub, email, passkey via Privy).
-   <b>Custom Connection UI:</b> A built-in, themeable connect modal owns the VeWorld and Sync2 flows end-to-end (no dapp-kit modal hand-off). WalletConnect's QR modal is preserved.
-   <b>Developer-Friendly Hooks:</b> Easy-to-use React Hooks that let you read and write data on the VeChainThor blockchain.
-   <b>Token Operations:</b> Send and swap tokens, check balances, manage VET domains, and more—all in one place.
-   <b>Pre-Built UI Components:</b> Ready-to-use components (e.g., TransactionModal) to simplify wallet operations and enhance your users’ experience.

> **Note**: Currently supports React and Next.js only

### Resources

-   [Live Demo](https://vechainkit.vechain.org/)
-   [Documentation](https://docs.vechainkit.vechain.org/)

### Quicks Start

#### Install dependencies

Install the core package along with its peer dependencies:


```bash
yarn add @vechain/vechain-kit \
  @chakra-ui/react@^2.8.2 \
  @emotion/react@^11.14.0 \
  @emotion/styled@^11.14.0 \
  @tanstack/react-query@^5.64.2 \
  @vechain/dapp-kit-react@2.1.0-rc.1 \
  framer-motion@^11.15.0
```


#### Setup Provider

Wrap your app with the VeChainKitProvider:

```typescript
'use client';

import { VeChainKitProvider } from '@vechain/vechain-kit';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <VeChainKitProvider>
            {children}
        </VeChainKitProvider>
    );
}
```

That's it! Your app is now ready to connect to VeChain mainnet with VeWorld wallet.

#### Add Wallet Button

```typescript
'use client';

import { WalletButton } from '@vechain/vechain-kit';

export function Page() {
    return <WalletButton />;
}
```


#### Customize the login modal

The connect modal renders a grid of login methods. Reorder, hide, or swap them via `loginMethods` on the provider:

```tsx
<VeChainKitProvider
    privy={{ appId: '...', clientId: '...', loginMethods: ['google', 'apple', 'email'], appearance: {...} }}
    dappKit={{ allowedWallets: ['veworld', 'sync2', 'wallet-connect'], walletConnectOptions: {...} }}
    loginMethods={[
        { method: 'veworld', gridColumn: 4 },         // primary CTA (filled, recommended)
        { method: 'google',  gridColumn: 4 },
        { method: 'apple',   gridColumn: 4 },
        { method: 'more',    gridColumn: 4 },         // opens an in-modal sub-view with overflow socials, wallets, ecosystem apps
    ]}
    // Optional: theme the brand accent (spinner, focus rings, "Waiting for signature…" headline)
    theme={{ accent: '#3b82f6' }}
>
```

Available `method` values: `veworld`, `sync2`, `wallet-connect`, `google`, `apple`, `github`, `email`, `passkey`, `vechain` (cross-app), `ecosystem`, `more`, and the legacy `dappkit` (which still opens dapp-kit's native modal for backwards compatibility).

For complete configuration options, check the [full documentation](https://docs.vechainkit.vechain.org/).

---

# Troubleshooting

Are you having issues using the kit?

-   Check our [Troubleshooting](https://docs.vechainkit.vechain.org/vechain-kit/troubleshooting) section.
-   Contact us on [Discord](https://discord.gg/wGkQnPpRVq)
-   Open an issue on [Github](https://github.com/vechain/vechain-kit/issues)
