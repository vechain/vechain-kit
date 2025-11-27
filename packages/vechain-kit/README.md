An all-in-one SDK for building frontend applications on VeChain, supporting wallet integration, developer hooks, pre-built UI components, and more.

<div align="center">
    <img src="https://prod-vechainkit-docs-images-bucket.s3.eu-west-1.amazonaws.com/vechain-kit-v2-shocase.png" alt="VeChain Kit Banner">
</div>

### Introduction

VeChain Kit is a comprehensive SDK designed to make building frontend applications on VeChain fast and straightforward. It offers:

-   <b>Seamless Wallet Integration:</b> Support for VeWorld, Sync2, WalletConnect, and social logins.
-   <b>Developer-Friendly Hooks:</b> Easy-to-use React Hooks that let you read and write data on the VeChainThor blockchain.
-   <b>Token Operations:</b> Send and swap tokens, check balances, manage VET domains, and more—all in one place.
-   <b>Pre-Built UI Components:</b> Ready-to-use components (e.g., TransactionModal) to simplify wallet operations and enhance your users’ experience.

> **Note**: Currently supports React and Next.js only

### Resources

-   [Live Demo](https://vechainkit.vechain.org/)
-   [Documentation](https://docs.vechainkit.vechain.org/)

### Quicks Start

#### Install dependencies

```bash
yarn add @vechain/vechain-kit @chakra-ui/react@^2.8.2 @emotion/react@^11.14.0 @emotion/styled@^11.14.0 @tanstack/react-query@^5.64.2 @vechain/dapp-kit-react@2.1.0-rc.1 framer-motion@^11.15.0
```

or with npm:

```bash
npm install @vechain/vechain-kit @chakra-ui/react@^2.8.2 @emotion/react@^11.14.0 @emotion/styled@^11.14.0 @tanstack/react-query@^5.64.2 @vechain/dapp-kit-react@2.1.0-rc.1 framer-motion@^11.15.0
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

You're all set! Your users can now connect their wallets and interact with VeChain.

---

### Customization (Optional)

VeChain Kit comes with sensible defaults, but you can customize everything to fit your needs.

#### Available Options

<details>
<summary><b>Network Configuration</b></summary>

By default, VeChain Kit connects to **mainnet**. You can change this:

```typescript
<VeChainKitProvider network={{ type: 'test' }}>
    {children}
</VeChainKitProvider>
```

Options: `'main'` | `'test'` | `'solo'`

</details>

<details>
<summary><b>Wallet Configuration</b></summary>

By default, only **VeWorld** is enabled. Add more wallets:

```typescript
<VeChainKitProvider
    dappKit={{
        allowedWallets: ['veworld', 'wallet-connect', 'sync2'],
        walletConnectOptions: {
            projectId: 'your-project-id',
            metadata: {
                name: 'My App',
                description: 'My VeChain App',
                url: window.location.origin,
                icons: ['https://myapp.com/icon.png'],
            },
        },
    }}
>
    {children}
</VeChainKitProvider>
```

Get your WalletConnect project ID at [cloud.walletconnect.com](https://cloud.walletconnect.com)

</details>

<details>
<summary><b>Login Methods</b></summary>

By default, **VeChain**, **DAppKit**, and **Ecosystem** login methods are enabled. Customize them:

```typescript
<VeChainKitProvider
    loginMethods={[
        { method: 'vechain', gridColumn: 4 },
        { method: 'dappkit', gridColumn: 4 },
        { method: 'ecosystem', gridColumn: 4 },
        // Add social logins (requires Privy configuration)
        // { method: 'email', gridColumn: 4 },
        // { method: 'google', gridColumn: 4 },
    ]}
>
    {children}
</VeChainKitProvider>
```

</details>

<details>
<summary><b>Theme Customization</b></summary>

Customize colors and appearance:

```typescript
<VeChainKitProvider
    darkMode={true}
    theme={{
        modal: {
            backgroundColor: '#1a1a1a',
        },
        textColor: '#ffffff',
        buttons: {
            primaryButton: {
                bg: '#0066ff',
            },
        },
    }}
>
    {children}
</VeChainKitProvider>
```

</details>

<details>
<summary><b>Language Support</b></summary>

VeChain Kit supports multiple languages:

```typescript
<VeChainKitProvider language="en">
    {children}
</VeChainKitProvider>
```

Supported languages: `'en'`, `'zh'`, `'es'`, `'fr'`, `'de'`, `'ja'`, `'ko'`

</details>

For complete configuration options, check the [full documentation](https://docs.vechainkit.vechain.org/).

---

# Troubleshooting

Are you having issues using the kit?

-   Check our [Troubleshooting](https://docs.vechainkit.vechain.org/vechain-kit/troubleshooting) section.
-   Contact us on [Discord](https://discord.gg/wGkQnPpRVq)
-   Open an issue on [Github](https://github.com/vechain/vechain-kit/issues)
