import { VeBetterIcon, VTHOLogo } from '@/assets';
import { VETLogo } from '@/assets/icons/VechainLogo/VETLogo';
import { VOT3Logo } from '@/assets/icons/VechainLogo/VOT3Logo';
import { getLocalStorageItem } from './ssrUtils';
import {
    GasTokenPreferences,
    GasTokenType,
    GasTokenInfo,
} from '@/types/gasToken';
import { getConfig } from '@/config';
import {
    GENERIC_DELEGATOR_MAINNET_URL,
    GENERIC_DELEGATOR_TESTNET_URL,
    VECHAIN_KIT_WEBSITE_BASE_URL,
    COINMARKETCAP_STATIC_BASE_URL,
    VECHAIN_TOKEN_REGISTRY_ASSETS_BASE_URL,
    IMAGE_NOT_FOUND_URL,
    CLEANIFY_APP_BASE_URL,
    EVEARN_BASE_URL,
    GREENCART_BASE_URL,
    MUGSHOT_BASE_URL,
} from '@/constants';

/** Tokens that cannot be swapped or transferred (e.g. governance voting tokens) */
export const NON_TRANSFERABLE_TOKEN_SYMBOLS: readonly string[] = ['VOT3'];

export const TOKEN_LOGOS: Record<string, string> = {
    VET: new URL(
        '/static/img/coins/64x64/3077.png',
        COINMARKETCAP_STATIC_BASE_URL,
    ).toString(),
    VTHO: new URL(
        '/static/img/coins/64x64/3012.png',
        COINMARKETCAP_STATIC_BASE_URL,
    ).toString(),
    B3TR: new URL(
        '/static/img/coins/64x64/33509.png',
        COINMARKETCAP_STATIC_BASE_URL,
    ).toString(),
    VOT3: new URL(
        '/17ff70aa1d898bc97ad690dbfad1a3b5643f7e0b.png',
        COINMARKETCAP_STATIC_BASE_URL,
    ).toString(),
    veDelegate: new URL(
        '1c641b86096d56bf13d49f38388accd6db8b8b2e.png',
        VECHAIN_TOKEN_REGISTRY_ASSETS_BASE_URL,
    ).toString(),
    USDGLO: new URL(
        '/static/img/coins/64x64/23888.png',
        COINMARKETCAP_STATIC_BASE_URL,
    ).toString(),
    SASS: new URL(
        'https://prod-vechainkit-docs-images-bucket.s3.eu-west-1.amazonaws.com/sass-token-image.png',
    ).toString(),
};

export const TOKEN_LOGO_COMPONENTS: Record<string, JSX.Element> = {
    VET: <VETLogo />,
    VTHO: <VTHOLogo />,
    B3TR: <VeBetterIcon />,
    VOT3: <VOT3Logo />,
};

export const VECHAIN_PRIVY_APP_ID = 'cm4wxxujb022fyujl7g0thb21';

export const notFoundImage = IMAGE_NOT_FOUND_URL;

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
        ? `${GENERIC_DELEGATOR_MAINNET_URL}/api/v1/`
        : `${GENERIC_DELEGATOR_TESTNET_URL}/api/v1/`; // or url to your delegator
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
        website: CLEANIFY_APP_BASE_URL,
    },
    {
        id: 'cm153hrup0817axti38avlfyg',
        name: 'GreenCart',
        website: GREENCART_BASE_URL,
    },
    {
        id: 'clv9sfos20j6x1431ga80d95f',
        name: 'Mughsot',
        website: MUGSHOT_BASE_URL,
    },
    {
        id: 'cm4l8tiai070i108zo17oieyc',
        name: 'EVearn',
        website: EVEARN_BASE_URL,
    },
];

//Hardcoded for displaying in the "Terms and Privacy" agreements modal
export const VECHAIN_KIT_TERMS_CONFIG = {
    url: new URL('terms', VECHAIN_KIT_WEBSITE_BASE_URL).toString(),
    version: 1,
    required: true,
    displayName: 'Vechain Kit Terms',
};

//Hardcoded for showing up if allowAnalytics is true
//So we ask users if they agree with data tracking
export const VECHAIN_KIT_COOKIES_CONFIG = {
    url: new URL('cookies', VECHAIN_KIT_WEBSITE_BASE_URL).toString(),
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
