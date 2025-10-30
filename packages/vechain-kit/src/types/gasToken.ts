export type GasTokenType = 'B3TR' | 'VET' | 'VTHO';

export type TransactionSpeed = 'regular' | 'medium' | 'high';

export interface GasTokenInfo {
    type: GasTokenType;
    name: string;
    symbol: string;
    address?: string;
    description: string;
}

export interface GasTokenPreferences {
    tokenPriority: GasTokenType[];
    availableGasTokens: GasTokenType[];
    excludedTokens: GasTokenType[];
    alwaysConfirm: boolean;
    gasTokenToUse: GasTokenType;
}

export interface GasTokenEstimate {
    token: GasTokenType;
    cost: string;
    available: boolean;
    balance?: string;
}

export interface GasTokenSelection {
    selectedToken: GasTokenType;
    cost: string;
    hasServiceFee: boolean;
}
