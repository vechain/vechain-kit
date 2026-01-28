# `vechain-kit-playground`

This is the backward compatibility testing playground for VeChain Kit. It uses the **barrel import style** (importing from `@vechain/vechain-kit`) to ensure legacy import patterns continue to work.

## Bundle Size

| Configuration | Bundle Size | Description |
|---------------|-------------|-------------|
| **This example (full-featured)** | **~1.0MB** | All providers, barrel imports |
| Optimized (DAppKit only) | ~400KB | See `next-template` example |

This example intentionally uses barrel imports for backward compatibility testing.

## Purpose

This playground exists to:
- **Verify backward compatibility** - Ensure legacy import patterns still work
- **Regression testing** - Catch breaking changes before release
- **Feature parity** - Should work identically to `homepage`

**Note:** For new projects, use the `next-template` example which demonstrates optimized subpath imports.

## Features

Same features as `homepage`:
- All login methods (social, wallet, ecosystem)
- All UI components and modals
- Multi-language support
- Dark/light mode theming
- Transaction handling

## Import Style (Barrel Imports)

This example uses barrel imports (legacy style):

```typescript
// Barrel import (legacy - still works)
import {
    VeChainKitProvider,
    useWallet,
    WalletButton
} from '@vechain/vechain-kit';
```

For better tree-shaking, new projects should use subpath imports:

```typescript
// Subpath imports (recommended)
import { VeChainKitProvider } from '@vechain/vechain-kit/providers';
import { useWallet } from '@vechain/vechain-kit/hooks';
import { WalletButton } from '@vechain/vechain-kit/components';
```

## Setup

```bash
# From repository root
yarn install:all

# Run the playground
cd examples/playground
yarn dev
```

## Development

```bash
yarn dev
```

## Build

```bash
yarn build
```
