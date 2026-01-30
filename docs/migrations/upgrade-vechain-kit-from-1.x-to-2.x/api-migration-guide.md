---
description: >-
  Core API changes when migrating from VeChain Kit 1.x to 2.0 with practical
  examples
---

# API Migration Guide

### Update Dependencies

First, update your package dependencies:

```bash
npm install @vechain/vechain-kit@^2.0.0
npm uninstall @thor-devkit
```

Clean install to avoid conflicts:

```bash
rm -rf node_modules package-lock.json
npm install
```

### Update Imports

Update your import statements throughout your codebase:

```typescript
// Before (1.x)
import { useConnex, useWallet, useTransaction } from '@vechain/vechain-kit';

// After (2.x)
import { useThor, useWallet, useBuildTransaction, useCallClause } from '@vechain/vechain-kit';
```

> **Note**: For the complete list of removed hooks, [see Removed Features](removed-features-in-v2.md)

### Connex to Thor

#### Basic Setup

**v1:**

```typescript
import { useConnex } from '@vechain/vechain-kit';

const Component = () => {
  const connex = useConnex();
  
  // Access thor
  const thor = connex.thor;
  
  // Access vendor
  const vendor = connex.vendor;
};
```

**v2:**

```typescript
import { useThor } from '@vechain/vechain-kit';

const Component = () => {
  const thor = useThor();
  
  // Thor is now directly available
  // Vendor functionality is integrated into transaction methods
};
```

### Contract Interactions

#### Reading Contract Data

**Single Contract Call**

**v1:**

```typescript
const getBalance = async () => {
  const functionAbi = contractAbi.find((e) => e.name === "balanceOf");
  const res = await thor.account(contractAddress)
    .method(functionAbi)
    .call(address);
  
  return ethers.formatEther(res.decoded[0]);
};
```

**v2:**

```typescript
import { useCallClause } from '@vechain/vechain-kit';

const useBalance = (address: string) => {
  const { data, isLoading, error } = useCallClause({
    abi: TokenContract__factory.abi,
    address: contractAddress as `0x${string}`,
    method: 'balanceOf' as const,
    args: [address],
    queryOptions: {
      enabled: !!address,
      select: (data) => ethers.formatEther(data[0]),
    },
  });

  return { balance: data, isLoading, error };
};
```

**Multiple Contract Calls**

**v1:**

```typescript
const fetchMultipleBalances = async (addresses: string[]) => {
  const results = [];
  for (const addr of addresses) {
    const res = await thor.account(contractAddress)
      .method(balanceOfAbi)
      .call(addr);
    results.push(res.decoded[0]);
  }
  return results;
};
```

**v2:**

```typescript
import { executeMultipleClausesCall } from '@vechain/vechain-kit';

const fetchMultipleBalances = async (addresses: string[]) => {
  const results = await executeMultipleClausesCall({
    thor,
    calls: addresses.map(addr => ({
      abi: TokenContract__factory.abi,
      functionName: 'balanceOf',
      address: contractAddress,
      args: [addr]
    }))
  });
  
  return results.map(r => r.result[0]);
};
```

#### Writing Contract Data (Transactions)

**Simple Transaction**

**v1:**

```typescript
const approve = async (spender: string, amount: string) => {
  const functionAbi = contractAbi.find((e) => e.name === "approve");
  const clause = thor.account(contractAddress)
    .method(functionAbi)
    .asClause(spender, amount);
  
  const tx = connex.vendor.sign('tx', [clause]);
  const result = await tx.request();
  
  return result.txid;
};
```

**v2:**

```typescript
import { useBuildTransaction } from '@vechain/vechain-kit';

const useApprove = () => {
  const {
    sendTransaction,
    status,
    txReceipt,
    isTransactionPending,
    error,
    resetStatus
  } = useBuildTransaction({
    clauseBuilder: (params: { spender: string; amount: string }) => {
      const { clause } = thor.contracts
        .load(contractAddress, TokenContract__factory.abi)
        .clause.approve(params.spender, params.amount);
      
      return [{
        ...clause,
        comment: 'Approve tokens'
      }];
    }
  });

  return {
    approve: sendTransaction,
    status,
    txReceipt,
    isTransactionPending,
    error,
    resetStatus
  };
};
```

**Multi-Clause Transaction**

**v1:**

```typescript
const complexTransaction = async () => {
  const clauses = [
    thor.account(token1).method(approveAbi).asClause(spender, amount1),
    thor.account(token2).method(approveAbi).asClause(spender, amount2),
    thor.account(dex).method(swapAbi).asClause(token1, token2, amount1)
  ];
  
  const tx = connex.vendor.sign('tx', clauses);
  const result = await tx.request();
  
  return result;
};
```

**v2:**

```typescript
const useComplexTransaction = () => {
  const { sendTransaction, status, txReceipt } = useBuildTransaction({
    clauseBuilder: (params) => {
      const clauses = [];
      
      // Approve token1
      const token1Contract = thor.contracts.load(token1, ERC20__factory.abi);
      clauses.push({
        ...token1Contract.clause.approve(params.spender, params.amount1).clause,
        comment: 'Approve token 1'
      });
      
      // Approve token2
      const token2Contract = thor.contracts.load(token2, ERC20__factory.abi);
      clauses.push({
        ...token2Contract.clause.approve(params.spender, params.amount2).clause,
        comment: 'Approve token 2'
      });
      
      // Perform swap
      const dexContract = thor.contracts.load(dex, DexABI);
      clauses.push({
        ...dexContract.clause.swap(token1, token2, params.amount1).clause,
        comment: 'Execute swap'
      });
      
      return clauses;
    }
  });

  return { sendTransaction, status, txReceipt };
};
```

### Transaction Building

#### Advanced Transaction Options

**v1:**

```typescript
const txWithOptions = async () => {
  const clause = thor.account(contractAddress)
    .method(methodAbi)
    .asClause(...args);
  
  const tx = connex.vendor.sign('tx', [clause])
    .signer(signerAddress)
    .gas(100000)
    .link('https://example.com/callback')
    .comment('Test transaction');
    
  return await tx.request();
};
```

**v2:**

```typescript
const useTransactionWithOptions = () => {
    const { sendTransaction } = useBuildTransaction({
      clauseBuilder: (params) => {
        const { clause } = thor.contracts
          .load(contractAddress, ContractABI)
          .clause.methodName(...params.args);

        return [{
          ...clause,
          comment: 'My transaction'
        }];
      },
      suggestedMaxGas: 100000,
      gasPadding: 0.25 // 25% gas padding
    });

    return { sendTransaction };
};
```

### Events Handling

The events API has been redesigned in v2. [See more](https://docs.vechainkit.vechain.org/hooks/blockchain-hooks).

**v1:**

```typescript
const { events } = useEvents({
  contractAddress,
  eventName: 'Transfer',
  filters: { from: address }
});
```

**v2:**

```typescript
// New events API - check documentation for updated usage
import { useEvents } from '@vechain/vechain-kit';

// The API has changed - refer to blockchain hooks documentation
```

### Query Keys

#### Generating Query Keys

**v2 introduces specific query key functions:**

```typescript
import { 
  getCallClauseQueryKeyWithArgs, 
  getCallClauseQueryKey 
} from '@vechain/vechain-kit';

// With arguments
const queryKeyWithArgs = getCallClauseQueryKeyWithArgs({
  abi: ContractABI,
  address: contractAddress,
  method: 'balanceOf',
  args: [userAddress]
});

// Without arguments (for methods with no parameters)
const queryKey = getCallClauseQueryKey({
  abi: ContractABI,
  address: contractAddress,
  method: 'totalSupply'
});

// Use with React Query for cache invalidation
queryClient.invalidateQueries({ queryKey: queryKeyWithArgs });
```

#### Custom Query Management

```typescript
// Refresh specific contract data
const refreshBalance = () => {
  const key = getCallClauseQueryKeyWithArgs({
    abi: TokenABI,
    address: tokenAddress,
    method: 'balanceOf',
    args: [account]
  });
  
  queryClient.invalidateQueries({ queryKey: key });
};
```

### Migration Tips

1. **Start with Reading Operations**: Migrate `useCall` to `useCallClause` first
2. **Update Transactions Incrementally**: Convert one transaction type at a time
3. **Test Thoroughly**: The new patterns handle edge cases differently
4. **Leverage Type Safety**: Use TypeScript to catch migration issues
5. **Use Query Keys**: Implement proper cache management with new query key functions
