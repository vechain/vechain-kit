# Blockchain Hooks

### `useCurrentBlock()`

Fetches the current block from the blockchain with automatic updates.

```typescript
const { data, isLoading, error } = useCurrentBlock();
```

Features:

* Auto-refreshes every 10 seconds
* Caches data for 1 minute
* Returns the latest expanded block information&#x20;

Example:

```typescript
function BlockInfo() {
  const { data: block } = useCurrentBlock();
  
  return <div>Current Block: {block?.number}</div>;
}
```

### `useTxReceipt()`

Polls the blockchain for a transaction receipt until it is found or times out.

```typescript
const { data, isLoading, error } = useTxReceipt(txId, blockTimeout);
```

Parameters:

* txId: (string) The transaction ID to monitor
* blockTimeout: (optional number) Number of blocks to wait before timing out (default: 5)

Returns:

* data: Transaction receipt (TransactionReceipt)
* isLoading: Boolean indicating if the receipt is being fetched
* error: Error object if the operation fails

Example:

```typescript
function TransactionStatus({ txId }) {
  const { data: receipt, isLoading } = useTxReceipt(txId);
  
  if (isLoading) return <div>Loading...</div>;
  return <div>Transaction Status: {receipt?.reverted ? 'Failed' : 'Success'}</div>;
}
```

## Utility Functions

### **`useEvents()`**

Fetches events from the blockchain based on specified criteria.

```typescript
const events = await getEvents({
   abi,
   contractAddress,
   eventName,
   filterParams,
   mapResponse,
   nodeUrl,
});
```
