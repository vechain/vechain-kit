# `next-template`

This example demonstrates how to integrate the `@vechain/vechain-kit` package into a Next.js application using **subpath imports** for better code organization. It showcases how to leverage the library for VeChain ecosystem integration, providing a foundation for building robust and user-friendly decentralized applications (dApps).

## Features

This template demonstrates:
- ✅ Subpath imports (`@vechain/vechain-kit/hooks`, `@vechain/vechain-kit/components`)
- ✅ Wallet connection (VeWorld, WalletConnect, Social Logins)
- ✅ Transaction handling with modals and toasts
- ✅ Message signing (plain text and EIP-712 typed data)
- ✅ Account management
- ✅ VeBetterDAO integration
- ✅ Multi-language support
- ✅ Currency selection

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

This template uses optimized subpath imports for better code organization:

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

**Note:** While subpath imports provide better code organization, they do not reduce bundle size for applications using the `VeChainKitProvider`, as the provider creates a dependency chain that includes the entire library. See `BUNDLE-SIZE-ANALYSIS.md` in the repository root for details.
