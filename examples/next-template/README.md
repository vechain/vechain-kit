# `next-template`

This example demonstrates how to integrate the `@vechain/vechain-kit` package into a Next.js application using **subpath imports** and **optimized provider configuration** for minimal bundle size.

## Bundle Size

| Configuration | Bundle Size | Description |
|---------------|-------------|-------------|
| **This template (DAppKit only)** | **~400KB** | Optimized for wallet-only apps |
| Full-featured (Privy + DAppKit + Ecosystem) | ~1.0MB | See `homepage` example |

This template is optimized to exclude:
- **Privy SDK** (~500KB) - No social login support
- **Wagmi** (~150KB) - No ecosystem wallet connections
- **Result**: ~60% smaller than full-featured setup

## Features

This template demonstrates:
- Subpath imports (`@vechain/vechain-kit/hooks`, `@vechain/vechain-kit/components`)
- **Optimized bundle** - DAppKit-only configuration
- Wallet connection (VeWorld, WalletConnect)
- Transaction handling with modals and toasts
- Message signing (plain text and EIP-712 typed data)
- Account management
- VeBetterDAO integration
- Multi-language support
- Currency selection

## When to Use This Template

Use this template when:
- Bundle size is critical for your application
- You only need direct wallet connections (VeWorld, WalletConnect)
- You don't need social logins (Google, Apple, etc.)
- You want the smallest possible VeChain Kit footprint

For social logins or ecosystem wallet connections, see the `homepage` or `playground` examples.

## Setup

**Important:** This example depends on the `@vechain/vechain-kit` workspace package. You must build it first from the repository root.

### From Repository Root (Recommended)

```bash
# Install dependencies and build all packages
yarn install:all

# Then run the template
cd examples/next-template
yarn dev
```

### Environment Variables

Create a `.env.local` file:

```env
# Required for WalletConnect
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id

# Network configuration
NEXT_PUBLIC_NETWORK_TYPE=main  # or 'test' for testnet

# Optional: Only needed if you enable Privy social logins
# NEXT_PUBLIC_PRIVY_APP_ID=your_app_id
# NEXT_PUBLIC_PRIVY_CLIENT_ID=your_client_id
```

### Troubleshooting Build Errors

If you encounter `Module not found: Can't resolve '@vechain/vechain-kit'` errors:

1. Return to the repository root
2. Run `yarn install:all` to rebuild the vechain-kit package and establish workspace links
3. Clear the Next.js cache: `rm -rf examples/next-template/.next`
4. Try building again

## Development

```bash
yarn dev
```

## Build

```bash
yarn build
```

## Subpath Imports

This template uses optimized subpath imports for better tree-shaking:

```typescript
// Hooks
import { useWallet, useBuildTransaction } from '@vechain/vechain-kit/hooks';

// Components
import { WalletButton, TransactionModal } from '@vechain/vechain-kit/components';

// Providers
import { VeChainKitProvider } from '@vechain/vechain-kit/providers';

// Utils
import { humanAddress } from '@vechain/vechain-kit/utils';
```

## Enabling Additional Features

### To enable social logins (adds ~500KB):

```typescript
<VeChainKitProvider
    privy={{
        appId: process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
        clientId: process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID!,
        loginMethods: ['google', 'apple', 'email'],
        embeddedWallets: { createOnLogin: 'all-users' },
    }}
    loginMethods={[
        { method: 'google', gridColumn: 4 },
        { method: 'dappkit', gridColumn: 4 },
    ]}
    // ... other props
>
```

### To enable ecosystem connections (adds ~150KB):

```typescript
<VeChainKitProvider
    loginMethods={[
        { method: 'vechain', gridColumn: 4 },    // Ecosystem login
        { method: 'ecosystem', gridColumn: 4 },   // Cross-app connect
        { method: 'dappkit', gridColumn: 4 },
    ]}
    // ... other props
>
```

See the `homepage` example for a full-featured configuration.
