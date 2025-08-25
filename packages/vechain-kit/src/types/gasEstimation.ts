export interface VthoPerGasAtSpeed {
    regular: number;
    medium: number;
    high: number;
    legacy: number;
}

export interface EstimatedGas {
    vtho: number;
    vet: number;
    b3tr: number;
    smartAccount: number;
}

export interface Rate {
    vtho: number;
    vet: number;
    b3tr: number;
}

export interface CostLevel {
    vtho: number;
    vet: number;
    b3tr: number;
    vetWithSmartAccount: number;
    b3trWithSmartAccount: number;
}

export interface TransactionCost {
    regular: CostLevel;
    medium: CostLevel;
    high: CostLevel;
    legacy: CostLevel;
}

export interface EstimationResponse {
    vthoPerGasAtSpeed?: number;
    estimatedGas?: number;
    rate?: number;
    transactionCost?: number;
    serviceFee?: number;
    totalGasUsed?: number;
}

export interface DepositAccount {
    depositAccount: string;
}

export function calculateTotalCost(
    baseCost: number,
    serviceFeeRate: number,
): number {
    return baseCost * (1 + serviceFeeRate);
}

export function formatGasCost(amount: number, decimals: number = 4): string {
    return amount.toFixed(decimals);
}
