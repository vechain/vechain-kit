import { VeBetterIcon, VTHOLogo } from '@/assets';
import { VETLogo } from '@/assets/icons/VechainLogo/VETLogo';
import { VOT3Logo } from '@/assets/icons/VechainLogo/VOT3Logo';
import { getLocalStorageItem } from './ssrUtils';
import { GasTokenPreferences, GasTokenType, GasTokenInfo } from '@/types/gasToken';
import { getConfig } from '@/config';

export const TOKEN_LOGOS: Record<string, string> = {
    VET: 'https://cryptologos.cc/logos/vechain-vet-logo.png',
    VTHO: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3012.png',
    B3TR: 'https://vechain.github.io/token-registry/assets/3d55edb42b09a634f7f2f26756a02571de901a5b.png',
    VOT3: 'https://vechain.github.io/token-registry/assets/17ff70aa1d898bc97ad690dbfad1a3b5643f7e0b.png',
    veDelegate:
        'https://vechain.github.io/token-registry/assets/1c641b86096d56bf13d49f38388accd6db8b8b2e.png',
    USDGLO: 'https://raw.githubusercontent.com/vechain/app-hub/439fba60c80ba2521d435981102d88c4aec050d6/apps/org.glodollar.app/logo.png',
};

export const TOKEN_LOGO_COMPONENTS: Record<string, JSX.Element> = {
    VET: <VETLogo />,
    VTHO: <VTHOLogo />,
    B3TR: <VeBetterIcon />,
    VOT3: <VOT3Logo />,
};

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

export const VECHAIN_KIT_MIXPANEL_TOKENS = {
    development: 'e9627dff3f9ac07c28c28615fa86b181',
    production: '2c9e0d4c8a37e9f31e3d59361f48b0dc',
};

export const getVECHAIN_KIT_MIXPANEL_PROJECT_TOKEN = () => {
    const env = getENV();
    return env.isProduction
        ? VECHAIN_KIT_MIXPANEL_TOKENS.production
        : VECHAIN_KIT_MIXPANEL_TOKENS.development;
};

// Default to development token for SSR compatibility
export const VECHAIN_KIT_MIXPANEL_PROJECT_TOKEN = VECHAIN_KIT_MIXPANEL_TOKENS.development;

export const VECHAIN_KIT_MIXPANEL_PROJECT_NAME = 'vechain-kit';

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
        address: getConfig(process.env.NEXT_PUBLIC_NETWORK_TYPE as any || 'test').b3trContractAddress,
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
        address: getConfig(process.env.NEXT_PUBLIC_NETWORK_TYPE as any || 'test').vthoContractAddress,
        description: 'Pay gas with VTHO',
    },
};

export const showGasFees = (
    isConnectedWithPrivy: boolean,
    hasDelegatorUrl: boolean,
): boolean => {
    // Always show breakdown when applicable; user preference removed
    return isConnectedWithPrivy && !hasDelegatorUrl;
};
