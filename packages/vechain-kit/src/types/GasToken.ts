export type GasTokenType = 'VTHO' | 'B3TR' | 'VET';

export interface GasTokenInfo {
    type: GasTokenType;
    name: string;
    symbol: string;
    address?: string;
    isNative: boolean;
    description: string;
}

export interface GasTokenPreferences {
    tokenPriority: GasTokenType[];
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
    tokenPriority: ['VTHO', 'B3TR', 'VET'],
    excludedTokens: [],
    alwaysConfirm: false,
    showCostBreakdown: false,
};

export const SUPPORTED_GAS_TOKENS: Record<GasTokenType, GasTokenInfo> = {
    VTHO: {
        type: 'VTHO',
        name: 'VTHO Token',
        symbol: 'VTHO',
        isNative: true,
        description: 'Native gas token',
    },
    B3TR: {
        type: 'B3TR',
        name: 'B3TR Token',
        symbol: 'B3TR',
        address: '0x5ef79995FE8a89e0812330E4378eB2660ceDe699',
        isNative: false,
        description: 'Pay gas with B3TR',
    },
    VET: {
        type: 'VET',
        name: 'VET Token',
        symbol: 'VET',
        isNative: false,
        description: 'Pay gas with VET',
    },
};
