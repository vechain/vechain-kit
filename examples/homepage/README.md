# `vechain-kit-homepage`

This is the homepage of VeChain Kit, a library for building dApps on the VeChainThor blockchain.

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

## Environment Variables

Create a `.env` file based on `.env.example` for local development with Privy and WalletConnect configurations.
