import { TransactionClause } from '@vechain/sdk-core';
import { ThorClient } from '@vechain/sdk-network';
import React from 'react';

/**
 * Swap quote from an aggregator
 */
export interface SwapQuote {
    /**
     * The aggregator name (e.g., "BetterSwap", "VeTrade")
     */
    aggregatorName: string;
    /**
     * Reference to the aggregator that generated this quote
     */
    aggregator: SwapAggregator;
    /**
     * Amount of output token to receive
     */
    outputAmount: bigint;
    /**
     * Estimated price impact percentage
     */
    priceImpact?: number;
    /**
     * Minimum amount of output token (considering slippage)
     */
    minimumOutputAmount?: bigint;
    /**
     * Additional data needed for transaction building
     */
    data?: unknown;
    /**
     * Whether the transaction simulation reverted
     */
    reverted?: boolean;
    /**
     * Revert reason if simulation failed
     */
    revertReason?: string;
    /**
     * Estimated gas cost in VTHO (from simulation)
     */
    gasCostVTHO?: number;
}

/**
 * Swap simulation result
 */
export interface SwapSimulation {
    /**
     * Estimated gas cost in VTHO
     */
    gasCostVTHO: number;
    /**
     * Whether the simulation was successful
     */
    success: boolean;
    /**
     * Error message if simulation failed
     */
    error?: string;
}

/**
 * Swap parameters
 */
export interface SwapParams {
    /**
     * Address of the token to swap from
     */
    fromTokenAddress: string;
    /**
     * Address of the token to swap to
     */
    toTokenAddress: string;
    /**
     * Amount of input token (in raw format, e.g., Wei)
     */
    amountIn: string;
    /**
     * Address of the user making the swap
     */
    userAddress: string;
    /**
     * Slippage tolerance percentage (default: 1)
     */
    slippageTolerance?: number;
}

/**
 * Aggregator module interface
 * Each aggregator must implement these functions
 */
export interface SwapAggregator {
    /**
     * Get a swap quote
     * @param params Swap parameters
     * @param thor Thor client instance for contract calls
     * @returns Promise resolving to a swap quote
     */
    getQuote(params: SwapParams, thor: ThorClient): Promise<SwapQuote>;
    
    /**
     * Simulate the swap transaction to estimate gas
     * @param params Swap parameters
     * @param quote The quote from getQuote
     * @param thor Thor client instance for transaction simulation
     * @returns Promise resolving to simulation result
     */
    simulateSwap(params: SwapParams, quote: SwapQuote, thor: ThorClient): Promise<SwapSimulation>;
    
    /**
     * Build transaction clauses for the swap
     * @param params Swap parameters
     * @param quote The quote from getQuote
     * @returns Promise resolving to transaction clauses
     */
    buildSwapTransaction(params: SwapParams, quote: SwapQuote): Promise<TransactionClause[]>;
    
    /**
     * Display name of the aggregator
     */
    name: string;
    
    /**
     * Icon component for the aggregator
     * @param boxSize Size of the icon (e.g., "20px", "24px")
     * @returns React element representing the aggregator icon
     */
    getIcon: (boxSize?: string) => React.ReactElement;
}

