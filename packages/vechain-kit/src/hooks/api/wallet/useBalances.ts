/**
 * This file exists only for documentation purposes.
 * The useBalances hook has been refactored into specialized hooks:
 *
 * - useTokenBalances: Get raw token balances
 * - useTokenPrices: Get token prices
 * - useTokensWithValues: Get tokens with their values in different currencies
 * - useTotalBalance: Get total balance across all tokens
 *
 * Please update your imports to use the appropriate specialized hook.
 */

// Re-export from the new specialized hooks
export { useTokenBalances } from './useTokenBalances';
export { useTokenPrices } from './useTokenPrices';
export { useTokensWithValues } from './useTokensWithValues';
export { useTotalBalance } from './useTotalBalance';
