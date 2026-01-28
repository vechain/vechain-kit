# `vechain-kit-homepage`

This is the homepage of VeChain Kit, showcasing **all features** of the library for building dApps on the VeChainThor blockchain.

## Bundle Size

| Configuration | Bundle Size | Description |
|---------------|-------------|-------------|
| **This example (full-featured)** | **~1.0MB** | All providers and features enabled |
| Optimized (DAppKit only) | ~400KB | See `next-template` example |

This example intentionally includes all features to demonstrate the full capabilities of VeChain Kit:
- **Privy SDK** - Social logins (Google, Apple, Twitter, etc.)
- **DAppKit** - Direct wallet connections (VeWorld, WalletConnect)
- **Ecosystem** - Cross-app wallet connections via Privy

## Features

This example demonstrates:
- All login methods (social, wallet, ecosystem)
- All UI components and modals
- Multi-language support (7 languages)
- Custom theming
- Transaction handling
- VeBetterDAO integration
- Full feature showcase

## When to Use This Example

Use this as a reference when:
- Learning VeChain Kit features
- Building a feature-rich dApp
- Need all login methods available
- Want to see all capabilities demonstrated

For a smaller bundle, see the `next-template` example (DAppKit only).

## Setup

**Important:** This example depends on the `@vechain/vechain-kit` workspace package. You must build it first from the repository root.

### From Repository Root (Recommended)

```bash
# Install dependencies and build all packages
yarn install:all

# Then run the homepage
cd examples/homepage
yarn dev
```

### Environment Variables

Create a `.env` file based on `.env.example` for local development with Privy and WalletConnect configurations:

```env
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
NEXT_PUBLIC_PRIVY_CLIENT_ID=your_privy_client_id
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_walletconnect_project_id
```

### Troubleshooting Build Errors

If you encounter `Module not found: Can't resolve '@vechain/vechain-kit'` errors:

1. Return to the repository root
2. Run `yarn install:all` to rebuild the vechain-kit package and establish workspace links
3. Clear the Next.js cache: `rm -rf examples/homepage/.next`
4. Try building again

## Development

```bash
yarn dev
```

## Build

```bash
yarn build
```
