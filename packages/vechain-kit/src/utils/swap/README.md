# Swap Aggregators Configuration

## Overview

The swap aggregator system provides a unified interface for interacting with multiple DEX aggregators on VeChain. Each aggregator implements the `SwapAggregator` interface, allowing the system to fetch quotes, simulate transactions, and build executable transaction clauses.

## Process Flow

### 1. Aggregator Initialization

```typescript
const aggregators = getSwapAggregators(networkType);
```

The `getSwapAggregators` function returns an array of configured aggregators for the specified network (main, test, or solo). Currently supported aggregators:

- **VeTrade.vet**: API-based aggregator that returns complex swap instructions
- **BetterSwap.io**: Uniswap V2 compatible router-based aggregator

### 2. Quote Fetching

For each aggregator, the system calls `getQuote()`:

```typescript
const quote = await aggregator.getQuote(params, thor);
```

**Input Parameters (`SwapParams`):**
- `fromTokenAddress`: Source token address (use `0x` or zero address for native VET)
- `toTokenAddress`: Destination token address
- `amountIn`: Input amount in raw format (Wei)
- `userAddress`: Address of the user making the swap
- `slippageTolerance`: Optional slippage percentage (default: 1%)

**Output (`SwapQuote`):**
- `aggregatorName`: Name of the aggregator
- `aggregator`: Reference to the aggregator instance
- `outputAmount`: Expected output amount (bigint)
- `minimumOutputAmount`: Minimum output considering slippage (bigint)
- `priceImpact`: Optional price impact percentage
- `data`: Aggregator-specific data (clauses, paths, etc.)

### 3. Transaction Simulation

After obtaining quotes, each quote is simulated to estimate gas costs and verify execution:

```typescript
const simulation = await aggregator.simulateSwap(params, quote, thor);
```

**Simulation Process:**
1. Builds transaction clauses using `buildSwapTransaction()`
2. Simulates the transaction on the VeChain network
3. Calculates gas costs (converted to VTHO)
4. Verifies token inflows/outflows match expected amounts
5. Checks for transaction reverts

**Output (`SwapSimulation`):**
- `gasCostVTHO`: Estimated gas cost in VTHO
- `success`: Whether simulation succeeded
- `error`: Error message if simulation failed

### 4. Quote Selection

The system filters and ranks quotes:
- Filters out quotes with zero output amounts
- Filters out quotes that reverted during simulation
- Selects the quote with the highest `outputAmount` among non-reverted quotes

### 5. Transaction Execution

When a user executes a swap:

```typescript
const clauses = await quote.aggregator.buildSwapTransaction(params, quote);
await sendTransaction(clauses);
```

The aggregator builds the final transaction clauses, which are then sent to the network.

## Clause Building

Each aggregator implements `buildSwapTransaction()` to construct VeChain transaction clauses. The implementation varies by aggregator type:

### Uniswap V2 Compatible

Use direct contract calls to a Uniswap V2 compatible router.

**For VET → Token swaps:**
1. Single clause: `swapExactETHForTokens`
   - Sends VET as `value` in the clause
   - Parameters: `amountOutMin`, `path`, `recipient`, `deadline`

**For Token → VET swaps:**
1. Approve clause: `approve` on the ERC20 token
   - Approves router to spend `amountIn`
2. Swap clause: `swapExactTokensForETH`
   - Parameters: `amountIn`, `amountOutMin`, `path`, `recipient`, `deadline`

**For Token → Token swaps:**
1. Approve clause: `approve` on the ERC20 token
2. Swap clause: `swapExactTokensForTokens`
   - Parameters: `amountIn`, `amountOutMin`, `path`, `recipient`, `deadline`

**Path Construction:**
- Native VET is replaced with wrapped VET (WVET) address in paths
- Path: `[fromToken, toToken]` (direct swap) or multi-hop paths

**Deadline:**
- Set to 20 minutes from current time (Unix timestamp)

### API-Based

Fetches interface and parameters from an API and encodes function calls locally.

**Process:**
1. Fetches quote from API endpoint
2. Receives clauses with function call specifications (ABI, function name, args)
3. Encodes function calls locally using viem's `encodeFunctionData`
4. Filters clauses to only include those targeting supported addresses to ensure interaction is limited to whitelisted contracts
5. Adds approve clause if swapping from ERC20 token (not VET)

**Clause Structure:**
- Each clause contains: `to`, `value`, `data` (encoded function call), `comment`
- Function calls are encoded using the ABI and arguments provided by the API

**Approve Clause Addition:**
- If `fromTokenAddress` is not VET, an approve clause is prepended
- Approves the router (first supported address) to spend `amountIn`

## Expected API Output

The API returns quotes in the following format:

### Request

Sample from VeTrade.vet:

```
GET https://vetrade.vet/api/quote/vck?fromAddress={tokenAddress}&toAddress={tokenAddress}&amountIn={amount}&recipient={userAddress}&slippageBps={basisPoints}&network={networkType}
```

**Query Parameters:**
- `fromAddress`: Source token address (hex string)
- `toAddress`: Destination token address (hex string)
- `amountIn`: Input amount as decimal string
- `recipient`: User address receiving output tokens
- `slippageBps`: Slippage in basis points (e.g., 100 = 1%)
- `network`: Network type (`main`, `test`, or `solo`)

### Response

```typescript
interface APIQuoteResponse {
    amountOut: string;              // Expected output amount (decimal string)
    amountOutMin: string;            // Minimum output with slippage (decimal string)
    clauses: Array<{
        to: string;                 // Contract address to call
        value: string;              // VET value to send (hex or decimal string)
        comment?: string;           // Optional description
        functionCall: {
            functionName?: string;  // Function name (or use 'name')
            name?: string;          // Alternative function name field
            abi: Abi | Array<{      // Function ABI or inputs array
                name: string;
                type: string;
                internalType?: string;
                components?: Array<{...}>; // For struct types
            }>;
            args: unknown[];        // Function arguments
        };
    }>;
    path: string[];                 // Token swap path
}
```

### Response Example

```json
{
  "amountOut": "1000000000000000000",
  "amountOutMin": "990000000000000000",
  "clauses": [
    {
      "to": "0xE5fA980a6EfE5B79C2150a529da06AeF455963b6",
      "value": "0",
      "comment": "Swap on VeTrade",
      "functionCall": {
        "functionName": "swapExactTokensForTokens",
        "abi": [
          {
            "name": "amountIn",
            "type": "uint256"
          },
          {
            "name": "amountOutMin",
            "type": "uint256"
          },
          {
            "name": "path",
            "type": "address[]"
          },
          {
            "name": "to",
            "type": "address"
          },
          {
            "name": "deadline",
            "type": "uint256"
          }
        ],
        "args": [
          "1000000000000000000",
          "990000000000000000",
          ["0xTokenA", "0xTokenB"],
          "0xUserAddress",
          "1234567890"
        ]
      }
    }
  ],
  "path": ["0xTokenA", "0xTokenB"]
}
```

### ABI Format Handling

The API may provide ABIs in two formats:

1. **Full Function ABI**: Complete function definition with `name`, `type`, `inputs`, `outputs`, `stateMutability`
2. **Inputs Array**: Just the inputs array, which is converted to a full function ABI locally

The system normalizes both formats before encoding function calls.

### Clause Filtering

Only clauses targeting addresses in `supportedAddresses` are used. This ensures security by restricting which contracts can be called.

## Adding New Aggregators

To add a new aggregator:

1. **Create aggregator module** in `packages/vechain-kit/src/utils/swap/`
   - Implement the `SwapAggregator` interface
   - Export a factory function (e.g., `createMyAggregator`)

2. **Import and register** in `swapAggregators.ts`:
   ```typescript
   import { createMyAggregator } from '@/utils/swap/myAggregator';
   
   export const getSwapAggregators = (networkType: NETWORK_TYPE): SwapAggregator[] => [
       createVeTradeAggregator(networkType),
       createBetterSwapAggregator(networkType),
       createMyAggregator(networkType), // Add here
   ];
   ```

3. **Implement required methods:**
   - `getQuote()`: Fetch or calculate swap quote
   - `simulateSwap()`: Simulate transaction execution
   - `buildSwapTransaction()`: Build transaction clauses
   - `name`: Display name
   - `getIcon()`: React icon component

## Network Configuration

Each aggregator must handle three network types:

- **main**: VeChain mainnet
- **test**: VeChain testnet
- **solo**: Local VeChain Solo network

Network-specific addresses and endpoints are configured within each aggregator module.

## Error Handling

- **Quote failures**: Return quote with `outputAmount: 0n` (filtered out)
- **Simulation failures**: Quote marked with `reverted: true` and `revertReason`
- **Transaction building failures**: Throw error to prevent execution
- **API failures**: Log error and return empty quote

## Gas Estimation

Gas costs are calculated during simulation:
- Base gas: 200,000 units
- Additional gas per clause: `gasUsed` from simulation result
- Conversion: `gasCostVTHO = totalGas / 1e5`

## Token Flow Verification

During simulation, the system verifies:
- **Outflow**: User's token outflow matches `amountIn`
- **Inflow**: User's token inflow meets `minimumOutputAmount` (if specified)

This verification works for both ERC20 tokens and native VET, ensuring swap integrity.

