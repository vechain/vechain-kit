# Oracle

### `useGetTokenUsdPrice`

A React hook that fetches the current USD price for supported tokens (B3TR, VET, VTHO) from the VeChain oracle contract.

#### Usage

```typescript
import { useGetTokenUsdPrice } from '@vechain/vechain-kit';

function TokenPrice() {
  const { data: vetPrice, isLoading, error } = useGetTokenUsdPrice('VET');
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching price</div>;
  
  return <div>VET Price: ${vetPrice}</div>;
}
```

### Parameters

Fetch the price for the following token symbols: 'B3TR', 'VET', 'VTHO'.

### Returns

The hook returns a TanStack Query result object with the following properties:

| Property  | Type          | Description                                     |
| --------- | ------------- | ----------------------------------------------- |
| data      | number        | The current token price in USD.                 |
| isLoading | boolean       | Indicates if the query is currently loading.    |
| error     | Error \| null | Describes any error that occurred during query. |
| isError   | boolean       | Indicates if there was an error in the query.   |

### Implementation Details

The hook internally:

* Uses the VeChain oracle contract to fetch real-time price data
* Automatically handles network configuration (mainnet/testnet)
* Caches results using TanStack Query
* Only fetches when both Thor connection and network type are available

### Example with Multiple Tokens

```typescript
function TokenPrices() {
  const { data: vetPrice } = useGetTokenUsdPrice('VET');
  const { data: vthoPrice } = useGetTokenUsdPrice('VTHO');
  const { data: b3trPrice } = useGetTokenUsdPrice('B3TR');

  return (
    <div>
      <div>VET: ${vetPrice}</div>
      <div>VTHO: ${vthoPrice}</div>
      <div>B3TR: ${b3trPrice}</div>
    </div>
  );
}
```
