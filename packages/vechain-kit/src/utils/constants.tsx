import { getLocalStorageItem } from './ssrUtils';
import {
    GasTokenPreferences,
    GasTokenType,
    GasTokenInfo,
} from '@/types/gasToken';
import { getConfig } from '@/config';

export const VECHAIN_PRIVY_APP_ID = 'cm4wxxujb022fyujl7g0thb21';

export const notFoundImage =
    'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png';

export enum TogglePassportCheck {
    WhitelistCheck = 1,
    BlacklistCheck = 2,
    SignalingCheck = 3,
    ParticipationScoreCheck = 4,
    GmOwnershipCheck = 5,
}

export const VECHAIN_KIT_STORAGE_KEYS = {
    NETWORK: 'vechain-kit:network',
};

// SSR-safe ENV getter function
export const getENV = () => {
    // During SSR, always return safe defaults
    if (typeof window === 'undefined') {
        return {
            isDevelopment: false,
            isProduction: true,
        };
    }

    // In browser, check localStorage using SSR-safe utility
    const network = getLocalStorageItem(VECHAIN_KIT_STORAGE_KEYS.NETWORK);
    return {
        isDevelopment: network === 'test',
        isProduction: network === 'main',
    };
};

// For backward compatibility, create a getter-based ENV object
// This ensures ENV properties are evaluated lazily and won't crash during SSR
export const ENV = {
    get isDevelopment() {
        return getENV().isDevelopment;
    },
    get isProduction() {
        return getENV().isProduction;
    },
};

export const getGenericDelegatorUrl = () => {
    const env = getENV();
    return env.isProduction
        ? 'https://mainnet.delegator.vechain.org/api/v1/'
        : 'https://testnet.delegator.vechain.org/api/v1/'; // or url to your delegator
};

export type PrivyEcosystemApp = {
    id: string;
    name: string;
    website: string;
};

export const DEFAULT_PRIVY_ECOSYSTEM_APPS: PrivyEcosystemApp[] = [
    {
        id: 'clz41gcg00e4ay75dmq3uzzgr',
        name: 'Cleanify',
        website: 'https://app.cleanify.vet',
    },
    {
        id: 'cm153hrup0817axti38avlfyg',
        name: 'GreenCart',
        website: 'https://greencart.ai',
    },
    {
        id: 'clv9sfos20j6x1431ga80d95f',
        name: 'Mughsot',
        website: 'https://mugshot.vet/',
    },
    {
        id: 'cm4l8tiai070i108zo17oieyc',
        name: 'EVearn',
        website: 'https://evearn.io',
    },
];

//Hardcoded for displaying in the "Terms and Privacy" agreements modal
export const VECHAIN_KIT_TERMS_CONFIG = {
    url: 'https://vechainkit.vechain.org/terms',
    version: 1,
    required: true,
    displayName: 'Vechain Kit Terms',
};

//Hardcoded for showing up if allowAnalytics is true
//So we ask users if they agree with data tracking
export const VECHAIN_KIT_COOKIES_CONFIG = {
    url: 'https://vechainkit.vechain.org/cookies',
    version: 1,
    required: false,
    displayName: 'Vechain Kit Cookies',
};

export const DEFAULT_GAS_TOKEN_PREFERENCES: GasTokenPreferences = {
    tokenPriority: ['VET', 'B3TR', 'VTHO'],
    availableGasTokens: ['VET', 'B3TR', 'VTHO'],
    excludedTokens: [],
    alwaysConfirm: false,
    gasTokenToUse: 'VET',
};

export const SUPPORTED_GAS_TOKENS: Record<GasTokenType, GasTokenInfo> = {
    B3TR: {
        type: 'B3TR',
        name: 'B3TR Token',
        symbol: 'B3TR',
        address: getConfig(
            (process.env.NEXT_PUBLIC_NETWORK_TYPE as any) || 'test',
        ).b3trContractAddress,
        description: 'Pay gas with B3TR',
    },
    VET: {
        type: 'VET',
        name: 'VET Token',
        symbol: 'VET',
        description: 'Pay gas with VET',
    },
    VTHO: {
        type: 'VTHO',
        name: 'VTHO Token',
        symbol: 'VTHO',
        address: getConfig(
            (process.env.NEXT_PUBLIC_NETWORK_TYPE as any) || 'test',
        ).vthoContractAddress,
        description: 'Pay gas with VTHO',
    },
};
