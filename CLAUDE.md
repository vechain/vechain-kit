# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

VeChain Kit is an all-in-one React library for building VeChain blockchain applications. It provides wallet integration (VeWorld, Sync2, WalletConnect, embedded wallets), social logins via Privy, React hooks for blockchain interactions, and pre-built UI components.

**Important:** Currently supports React and Next.js only. UI components use Chakra UI v2.

**Documentation:** https://docs.vechainkit.vechain.org/

**MCP Endpoint:** https://docs.vechainkit.vechain.org/~gitbook/mcp

**VeChain MCP Server:** For blockchain interactions, use `@vechain/mcp-server`:
```json
{
  "mcpServers": {
    "vechain": {
      "command": "npx",
      "args": ["-y", "@vechain/mcp-server@latest"],
      "env": { "VECHAIN_NETWORK": "mainnet" }
    }
  }
}
```

## Development Commands

```bash
yarn install:all          # Install dependencies and build packages
yarn kit:build            # Build vechain-kit package
yarn kit:typecheck        # Type check vechain-kit package
yarn lint                 # Run ESLint
yarn dev:next-template    # Watch kit + run next-template example
yarn clean                # Remove build artifacts
yarn purge                # Clean + remove node_modules
```

### Local Development

1. `yarn install:all` (from root)
2. Terminal 1: `cd packages/vechain-kit && yarn watch`
3. Terminal 2: `cd examples/next-template && yarn dev`

### Testing

`yarn test` runs the Vitest suite (kit unit/hook/provider tests, lambda, CI gate script); `yarn test:coverage` adds coverage; `yarn test:e2e` runs the Playwright VeWorld suite (needs thor-solo via `thor-solo/`, `yarn kit:build` and a solo build of `next-template`). Build the kit first (`yarn kit:build`) to include the dist smoke test. Strategy, levels and follow-ups: [docs/testing.md](docs/testing.md). Add or update tests next to the code you change (`*.test.ts` for pure code, `*.test.tsx` when React or the DOM is involved); mock Privy and dapp-kit at the module boundary with the fakes in `packages/vechain-kit/test/`, never hit the network.

### Translations

Add new translation keys to the end of `packages/vechain-kit/src/languages/en.json`. The `yarn translate` command runs automatically during `yarn publish:release`.

## Architecture

### Core Dependencies

1. **DApp-Kit** (`@vechain/dapp-kit-react`) - Direct wallet connections (VeWorld, Sync2, WalletConnect)
2. **Privy** (`@privy-io/react-auth`) - Social logins (Google, email, passkey)
3. **Privy Cross-App Connect** (`@privy-io/cross-app-connect`) - Ecosystem wallet connections across Privy-enabled apps
4. **React Query** (`@tanstack/react-query`) - All data fetching/caching. Use `useCallClause`, `getCallClauseQueryKey`, `getCallClauseQueryKeyWithArgs`
5. **Chakra UI** (`@chakra-ui/react` v2) - All UI components

### Smart Account Flow (Privy users)

Privy signatures are not valid on VeChain. When a Privy user transacts:
1. User signs ERC-712 typed message with Privy embedded wallet
2. A random VeChain-compatible wallet is generated
3. Random wallet calls user's smart account to execute on behalf of owner
4. Signed typed data proves authorization
5. Transaction is fee-delegated (random wallet has no funds)

This explains the many if/else conditions when signing messages or transactions.

### Source Structure (`packages/vechain-kit/src/`)

- `providers/` - VeChainKitProvider, PrivyWalletProvider, PrivyCrossAppProvider, ModalProvider
- `hooks/` - api (balances, domains, IPFS), thor (accounts, transactions, smart accounts), login, signing, modals, cache
- `components/` - WalletButton, ConnectModal, AccountModal, TransactionModal, TransactionToast
- `config/` - Network configs (mainnet, testnet, solo). Use `getConfig(networkType)`
- `utils/`, `types/`, `theme/`, `assets/`, `languages/`, `constants/`

### Path Aliases (tsconfig.json)

`@/*` → `src/*`, `@hooks` → `src/hooks`, `@components` → `src/components`, `@utils` → `src/utils`

## Best Practices

### Type Safety & Contract Calls

```typescript
// Always use typed patterns
const contractAddress = config.contractAddress as `0x${string}`;
const method = 'balanceOf' as const;

// Use contract factories, not manual ABI definitions
import { VOT3__factory } from '@vechain/vechain-kit/contracts';
const abi = VOT3__factory.abi;
```

### Query Patterns

```typescript
// Single contract call with useCallClause
export const useTokenBalance = (address?: string) => {
  const { network } = useVeChainKitConfig();
  return useCallClause({
    abi: VOT3__factory.abi,
    address: getConfig(network.type).contractAddress as `0x${string}`,
    method: 'balanceOf' as const,
    args: [address ?? ''],
    queryOptions: {
      enabled: !!address,  // Always enable conditionally
      select: (data) => ethers.formatEther(data[0]),  // Transform in select, not component
      staleTime: 30000,
      retry: (failureCount, error) => !error.message.includes('reverted') && failureCount < 3,
    },
  });
};

// Query key for invalidation
export const getTokenBalanceQueryKey = (address: string, networkType: NETWORK_TYPE) =>
  getCallClauseQueryKeyWithArgs({
    abi: VOT3__factory.abi,
    address: getConfig(networkType).contractAddress as `0x${string}`,
    method: 'balanceOf' as const,
    args: [address],
  });

// Multiple contract calls
const results = await executeMultipleClausesCall({
  thor,
  calls: addresses.map((addr) => ({
    abi: ERC20__factory.abi,
    functionName: 'balanceOf',
    address: addr as `0x${string}`,
    args: [userAddress],
  })),
});
```

### Transaction Patterns

```typescript
// Single or multi-clause transactions
const { sendTransaction } = useBuildTransaction({
  clauseBuilder: (params) => {
    if (!account?.address) return [];
    return [
      {
        ...thor.contracts.load(tokenAddress, ERC20__factory.abi)
          .clause.approve(spender, amount).clause,
        comment: 'Approve spending',
      },
      {
        ...thor.contracts.load(contractAddress, Contract__factory.abi)
          .clause.execute(params).clause,
        comment: 'Execute action',
      },
    ];
  },
  onTxConfirmed: () => {
    queryClient.invalidateQueries({ queryKey: getTokenBalanceQueryKey(address, networkType) });
  },
});
```

### Security

```typescript
// Always validate inputs
if (!isAddress(recipient)) throw new Error('Invalid address');
if (BigInt(amount) <= 0n) throw new Error('Amount must be positive');
```

## Commits & PRs

- Conventional commits, enforced by commitlint.
- **Prose bloat is a merge blocker.** [.github/workflows/pr-bloat.yaml](.github/workflows/pr-bloat.yaml) fails a PR on a description over 240 words (or under 10), a tool-attribution trailer, or a comment block that outweighs the code it documents (>1:1 against attached added-code lines; 10 lines absolute; a top-of-file header measures against the whole file). Comment density and long Markdown paragraphs are advisory; Markdown never blocks. `yarn check:pr-bloat` runs it locally. Bypass is the `verbose-ok` label, which anyone including the author may apply. Thresholds are env-overridable in [scripts/check-pr-bloat.mjs](scripts/check-pr-bloat.mjs).
- **Write reviewer-facing prose at final length — don't draft long and trim.** The budget is the target, not a limit to approach.
  - **PR descriptions:** what changed and why, in two or three sentences. Skip `## Summary` / `## Test plan` scaffolding unless there is genuinely something new to test. No tool-attribution trailers.
  - **Comments:** default to none. Add one only when the WHY is non-obvious (hidden constraint, invariant, workaround), and keep it to one short line. Never explain WHAT the code does. A comment must not outweigh the code it documents.
  - Don't restate what the code does, what a technical term already implies, or what a linked doc already says. Don't explain what something does _not_ do.
  - **But keep visual/semantic bridges.** Mapping something observable to what it means is real information, not padding.
