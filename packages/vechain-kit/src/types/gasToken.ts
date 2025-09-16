import { getConfig } from "@/config";
export type GasTokenType = 'B3TR' | 'VET';

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
    showCostBreakdown: boolean;
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

export const DEFAULT_GAS_TOKEN_PREFERENCES: GasTokenPreferences = {
    tokenPriority: ['VET', 'B3TR'],
    availableGasTokens: ['VET', 'B3TR'],
    excludedTokens: [],
    alwaysConfirm: false,
    showCostBreakdown: false,
};

export const SUPPORTED_GAS_TOKENS: Record<GasTokenType, GasTokenInfo> = {
    B3TR: {
        type: 'B3TR',
        name: 'B3TR Token',
        symbol: 'B3TR',
        address: getConfig(process.env.NEXT_PUBLIC_NETWORK_TYPE as any || 'test').b3trContractAddress,
        description: 'Pay gas with B3TR',
    },
    VET: {
        type: 'VET',
        name: 'VET Token',
        symbol: 'VET',
        description: 'Pay gas with VET',
    },
};
