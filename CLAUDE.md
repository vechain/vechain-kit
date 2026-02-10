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

E2E tests exist in `tests/e2e/` using Playwright but are currently disabled. No need to add new tests or run existing ones.

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
