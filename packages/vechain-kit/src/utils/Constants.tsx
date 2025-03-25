import { VeBetterIcon, VTHOLogo } from '@/assets';
import { VETLogo } from '@/assets/icons/VechainLogo/VETLogo';
import { VOT3Logo } from '@/assets/icons/VechainLogo/VOT3Logo';

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

export const ENV = {
    isDevelopment:
        localStorage.getItem(VECHAIN_KIT_STORAGE_KEYS.NETWORK) === 'test',
    isProduction:
        localStorage.getItem(VECHAIN_KIT_STORAGE_KEYS.NETWORK) === 'main',
};

export const VECHAIN_KIT_MIXPANEL_TOKENS = {
    development: 'e9627dff3f9ac07c28c28615fa86b181',
    production: '2c9e0d4c8a37e9f31e3d59361f48b0dc',
};

export const VECHAIN_KIT_MIXPANEL_PROJECT_TOKEN = ENV.isProduction
    ? VECHAIN_KIT_MIXPANEL_TOKENS.production
    : VECHAIN_KIT_MIXPANEL_TOKENS.development;

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
];
