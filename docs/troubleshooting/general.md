---
description: Common issues and solutions during migration from 1.x to 2.0
---

# Troubleshooting

### TypeScript Compilation Errors

#### Type Mismatch Errors

```typescript
// Error: Type 'string' is not assignable to type '`0x${string}`'
const address: `0x${string}` = userAddress;

// ✅ Solution
const contractAddress = getConfig(networkType).contractAddress as `0x${string}`;
const method = 'convertedB3trOf' as const;

// ✅ Validate addresses
import { humanAddress } from '@vechain/vechain-kit/utils';
const validatedAddress = humanAddress(address);
```

#### BigInt Serialization Errors

```typescript
import { hashFn } from 'wagmi/query';
// Error: Do not know how to serialize a BigInt

// ✅ Solution: set wagmi's hashfn as default queryKeyHashFn
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryKeyHashFn: hashFn,
      retry: 0,
      retryOnMount: false,
      staleTime: 30000,
      // other options
    },
  },
})

```

### React Query Issues

#### Cache Invalidation Not Working

```typescript
// ✅ Good: Consistent query key structure
const queryKey = getCallClauseQueryKeyWithArgs({
  abi: VOT3__factory.abi,
  address: contractAddress,
  method: 'balanceOf' as const,
  args: [userAddress],
});

// ✅ Proper invalidation
queryClient.invalidateQueries({ queryKey });
```

### Contract Interaction Issues

**Migration from manual ABI lookup:**

```typescript
// Old pattern
const functionAbi = vot3Abi.find((e) => e.name === "convertedB3trOf");
const res = await thor.account(contractAddress).method(functionAbi).call(address);

// ✅ New pattern
import { VOT3__factory } from '@vechain/vechain-kit/contracts';
return useCallClause({
  abi: VOT3__factory.abi,
  address: contractAddress,
  method: 'convertedB3trOf' as const,
  args: [address ?? ''],
  queryOptions: { enabled: !!address },
});
```

#### Transaction Building Fails

```typescript
// Old manual transaction building
const buildConvertTx = (thor: Connex.Thor, amount: string) => {
  const functionAbi = abi.find((e) => e.name === "convertToVOT3");
  const clause = thor.account(contractAddress).method(functionAbi).asClause(amount);
  return { ...clause, comment: `Convert ${amount}`, abi: functionAbi };
};

// ✅ New clause building
import { VOT3__factory } from '@vechain/vechain-kit/contracts';
const buildConvertTx = (thor: ThorClient, amount: string): EnhancedClause => {
  const { clause } = thor.contracts
    .load(contractAddress, VOT3__factory.abi)
    .clause.convertToVOT3(ethers.parseEther(amount));

  return {
    ...clause,
    comment: `Convert ${humanNumber(amount)} B3TR to VOT3`,
  };
};
```

### Performance Issues

#### Too Many Network Requests

```typescript
// ✅ Batch multiple calls
const useTokenData = (tokenAddress: string) => {
  return useQuery({
    queryKey: ['TOKEN_DATA', tokenAddress],
    queryFn: async () => {
      const results = await executeMultipleClausesCall({
        thor,
        calls: [
          { abi: ERC20__factory.abi, functionName: 'symbol', address: tokenAddress, args: [] },
          { abi: ERC20__factory.abi, functionName: 'decimals', address: tokenAddress, args: [] },
          { abi: ERC20__factory.abi, functionName: 'totalSupply', address: tokenAddress, args: [] },
        ],
      });
      
      return {
        symbol: results[0][0],
        decimals: results[1][0],
        totalSupply: results[2][0],
      };
    },
    enabled: !!tokenAddress,
    staleTime: 60000, // Cache for 1 minute
  });
};
```

### Network Issues

#### RPC Endpoint Problems

```typescript
// ✅ retry configuration
const { data, error } = useCallClause({
  queryOptions: {
    retry: (failureCount, error) => {
      if (error.message.includes('reverted')) return false;
      if (error.message.includes('invalid')) return false;
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  },
});
```

### Testing Issues

#### Mocking Problems

```typescript
// ✅ Mock VeChain Kit hooks
jest.mock('@vechain/vechain-kit', () => ({
  useWallet: () => ({
    account: { address: '0x123...' },
    isConnected: true,
  }),
  useCallClause: () => ({
    data: [BigInt('1000000000000000000')],
    isLoading: false,
    error: null,
  }),
}));
```
