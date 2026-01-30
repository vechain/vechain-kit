# Intro

The kit provides hooks for developers to interact with smart contracts like VeBetterDAO, VePassport, veDelegate, and price oracles.&#x20;

The hooks in this package provide a standardized way to interact with various blockchain and web services. All hooks are built using [TanStack Query](https://tanstack.com/query) (formerly React Query), which provides powerful data-fetching and caching capabilities.

### Common Features

Every hook in the `@api` directory returns a consistent interface that includes:

* `data`: The fetched data
* `isLoading`: Boolean indicating if the request is in progress
* `isError`: Boolean indicating if the request failed
* `error`: Error object if the request failed
* `refetch`: Function to manually trigger a new fetch
* `isRefetching`: Boolean indicating if a refetch is in progress

Additionally, these hooks integrate with TanStack Query's global features:

* Automatic background refetching
* Cache invalidation
* Optimistic updates
* Infinite queries (for pagination)
* Parallel queries
* Query retrying
* Query polling

### Query Invalidation

All hooks use consistent query key patterns, making it easy to invalidate related queries. For example:

```typescript
const queryClient = useQueryClient();
// Invalidate all blockchain queries
queryClient.invalidateQueries({ queryKey: ['VECHAIN_KIT'] });
// Invalidate specific query
queryClient.invalidateQueries({ queryKey: ['VECHAIN_KIT', 'CURRENT_BLOCK'] });
```

### Caching Behavior

By default, most queries are configured with:

* `staleTime`: How long the data remains "fresh"
* `cacheTime`: How long inactive data remains in cache
* `refetchInterval`: For automatic background updates (if applicable)

These can be customized using TanStack Query's global configuration or per-hook options.
