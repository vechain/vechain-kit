---
description: Essential patterns for optimal performance, type safety, and maintainability
---

# Best Practices

### Type Safety

```typescript
// ✅ Good: Proper typing
const args: [string, bigint, boolean] = [address, amount, isEnabled];
const contractAddress = config.contractAddress as `0x${string}`;
const method = 'balanceOf' as const;

// ✅ Use contract factories
import { VOT3__factory } from '@vechain/vechain-kit/contracts';
const abi = VOT3__factory.abi;

// Avoid: Manual ABI definitions
const functionAbi = contractAbi.find((e) => e.name === "delegates");
```

### Query Optimization

```typescript
// ✅ Good: Conditional enablement
return useCallClause({
  abi,
  address: contractAddress,
  method: 'getData',
  args: [userAddress],
  queryOptions: {
    enabled: !!contractAddress && !!userAddress && isConnected,
  },
});

// ✅ Good: Configure caching
queryOptions: {
  staleTime: 30000,        // 30 seconds for price data
  refetchInterval: 60000,  // Refetch every minute
}
```

### Data Transformation

```typescript
// ✅ Good: Transform in select
return useCallClause({
  abi: VOT3__factory.abi,
  address: contractAddress,
  method: 'convertedB3trOf' as const,
  args: [address ?? ''],
  queryOptions: {
    enabled: !!address,
    select: (data) => ({
      balance: ethers.formatEther(data[0]),
      formatted: humanNumber(ethers.formatEther(data[0])),
    }),
  },
});

// Avoid: Transform in component
const transformedData = useMemo(() => ({
  balance: data?.[0]?.toString(),
}), [data]); // Causes re-renders
```

### Error Handling

```typescript
// ✅ Good: Comprehensive error handling
if (error) {
  if (error.message.includes('reverted')) {
    return <div>Contract call failed. Check parameters.</div>;
  }
  if (error.message.includes('network')) {
    return <div>Network error. <button onClick={refetch}>Retry</button></div>;
  }
  return <div>Error: {error.message}</div>;
}

// ✅ Good: Retry logic
queryOptions: {
  retry: (failureCount, error) => {
    if (error.message.includes('reverted')) return false;
    return failureCount < 3;
  },
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
}
```

### Query Key Management

```typescript
// ✅ Good: Use getCallClauseQueryKey (without args) 
export const getCurrentAllocationsRoundIdQueryKey = (
  address: string,
  networkType: NETWORK_TYPE
) =>
  getCallClauseQueryKey({
    abi: XAllocationVoting__factory.abi,
    address: getConfig(networkType).contractAddress as `0x${string}`,
    method: 'currentRoundId' as const,
  });
  
// ✅ Good: Use getCallClauseQueryKeyWithArgs
export const getTokenBalanceQueryKey = (
  address: string,
  networkType: NETWORK_TYPE
) =>
  getCallClauseQueryKeyWithArgs({
    abi: VOT3__factory.abi,
    address: getConfig(networkType).contractAddress as `0x${string}`,
    method: 'balanceOf' as const,
    args: [address],
  });

// ✅ Good: Query invalidation after transactions
const mutation = useBuildTransaction({
  clauseBuilder: buildClauses,
  onTxConfirmed: () => {
    queryClient.invalidateQueries({ queryKey: getTokenBalanceQueryKey(userAddress, networkType) });
  },
});
```

### Performance Tips

```typescript
// ✅ Good: Memoize expensive calculations
const queryKey = useMemo(() => 
  getTokenBalanceQueryKey(userAddress, tokenAddress),
  [userAddress, tokenAddress]
);

// ✅ Good: Batch multiple calls
const results = await executeMultipleClausesCall({
  thor,
  calls: addresses.map((address) => ({
    abi: ERC20__factory.abi,
    functionName: 'balanceOf',
    address: address as `0x${string}`,
    args: [userAddress],
  })),
});
```

### Security

```typescript
// ✅ Good: Input validation
if (!isAddress(recipient)) {
  throw new Error('Invalid recipient address');
}

const amountBN = BigInt(amount);
if (amountBN <= 0n) {
  throw new Error('Amount must be positive');
}

// ✅ Good: Safe BigInt handling
const formatTokenAmount = (amount: bigint, decimals: number): string => {
  try {
    return ethers.formatUnits(amount, decimals);
  } catch (error) {
    return '0';
  }
};
```

### Single Contract Call Pattern

```typescript
import { VOT3__factory } from '@vechain/vechain-kit/contracts';
import { useCallClause, getCallClauseQueryKeyWithArgs } from '@vechain/vechain-kit';

const abi = VOT3__factory.abi;
const method = 'convertedB3trOf' as const;

export const useTokenBalance = (address?: string) => {
  const { network } = useVeChainKitConfig();
  const contractAddress = getConfig(network.type).contractAddress as `0x${string}`;

  return useCallClause({
    abi,
    address: contractAddress,
    method,
    args: [address ?? ''],
    queryOptions: {
      enabled: !!address,
      select: (data) => ({
        balance: ethers.formatEther(data[0]),
        formatted: humanNumber(ethers.formatEther(data[0])),
      }),
    },
  });
};
```

### Multiple Contract Calls Pattern

```typescript
import { useQuery } from '@tanstack/react-query';
import { executeMultipleClausesCall } from '@vechain/vechain-kit';

export const useMultipleTokenData = (addresses: string[]) => {
  const thor = useThor();

  return useQuery({
    queryKey: ['MULTIPLE_TOKENS', addresses],
    queryFn: async () => {
      const results = await executeMultipleClausesCall({
        thor,
        calls: addresses.map((address) => ({
          abi: ERC20__factory.abi,
          functionName: 'balanceOf',
          address: address as `0x${string}`,
          args: [userAddress],
        })),
      });

      return addresses.map((address, index) => ({
        address,
        balance: ethers.formatEther(results[index][0]),
      }));
    },
    enabled: !!addresses.length,
  });
};
```

### Transaction Building Pattern

```typescript
import { useBuildTransaction, useWallet } from '@vechain/vechain-kit';

export const useTokenTransfer = () => {
  const { account } = useWallet();
  const thor = useThor();

  return useBuildTransaction({
    clauseBuilder: (recipient: string, amount: string) => {
      if (!account?.address) return [];

      const { clause } = thor.contracts
        .load(tokenAddress, ERC20__factory.abi)
        .clause.transfer(recipient, ethers.parseEther(amount));

      return [{
        ...clause,
        comment: `Transfer ${amount} tokens to ${recipient}`,
      }];
    },
    onTxConfirmed: () => {
      queryClient.invalidateQueries({ queryKey: ['TOKEN_BALANCE'] });
    },
  });
};
```

### Multi-Clause Transactions

```typescript
const useApproveAndSwap = () => {
  const { account } = useWallet();
  const thor = useThor();

  return useBuildTransaction({
    clauseBuilder: (tokenAddress: string, amount: string) => {
      if (!account?.address) return [];

      return [
        // Approve
        {
          ...thor.contracts
            .load(tokenAddress, ERC20__factory.abi)
            .clause.approve(swapAddress, ethers.parseEther(amount)).clause,
          comment: 'Approve token spending',
        },
        // Swap
        {
          ...thor.contracts
            .load(swapAddress, SwapContract__factory.abi)
            .clause.swap(tokenAddress, ethers.parseEther(amount)).clause,
          comment: 'Execute swap',
        },
      ];
    },
  });
};
```

### Error Handling

```typescript
const useContractCall = (address: string) => {
  return useCallClause({
    abi: ContractABI,
    address: address as `0x${string}`,
    method: 'getData',
    args: [],
    queryOptions: {
      enabled: !!address,
      retry: (failureCount, error) => {
        if (error.message.includes('reverted')) return false;
        return failureCount < 3;
      },
    },
  });
};
```
