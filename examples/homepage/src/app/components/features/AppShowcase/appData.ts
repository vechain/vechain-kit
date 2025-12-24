import { TFunction } from 'i18next';

export interface AppData {
    id: string;
    name: string;
    logo: string;
    image: string;
    tag: string;
    description: string;
    url: string;
}

export const getApps = (t: TFunction): AppData[] => [
    {
        id: 'velottery',
        name: 'VeLottery',
        logo: 'https://api.gateway-proxy.vechain.org/ipfs/bafybeigtlombd3jplbq33k2m2p5cbrbniznv4fnr3bbh2hxxackh5bpcqy/media/logo.png',
        image: 'https://api.gateway-proxy.vechain.org/ipfs/bafybeigtlombd3jplbq33k2m2p5cbrbniznv4fnr3bbh2hxxackh5bpcqy/media/ve_world_banner.png',
        tag: t('Gaming'),
        description: t(
            'Uses VeChain Kit end-to-end: login, wallet, hooks, and transaction components.',
        ),
        url: 'https://velottery.vet/',
    },
    {
        id: 'vebetter',
        name: 'VeBetter',
        logo: 'https://prod-vechainkit-docs-images-bucket.s3.eu-west-1.amazonaws.com/vebetter-512x512.png',
        image: 'https://governance.vebetterdao.org/assets/images/platform_page.webp',
        tag: t('DAO'),
        description: t(
            'VeChain Kit UI is fully integrated into the app, using a bottom sheet UX on mobile to enhance the user experience.',
        ),
        url: 'https://governance.vebetterdao.org/',
    },
    {
        id: 'cleanify',
        name: 'Cleanify',
        logo: 'https://api.gateway-proxy.vechain.org/ipfs/bafybeicvr6ivkwv2iygkgcijbmjaorfyi4gui2bjskhwuitop7n3tqo24m/media/logo.png',
        image: 'https://api.gateway-proxy.vechain.org/ipfs/bafybeicvr6ivkwv2iygkgcijbmjaorfyi4gui2bjskhwuitop7n3tqo24m/media/ve_world_featured_image.png',
        tag: t('Sustainability'),
        description: t(
            'Uses its own Privy setup for social login OAuth2 based methods like Google and Apple.',
        ),
        url: 'https://app.cleanify.vet/',
    },
    {
        id: 'stargate',
        name: 'StarGate',
        logo: 'https://prod-vechainkit-docs-images-bucket.s3.eu-west-1.amazonaws.com/stargate-icon.png',
        image: 'https://prod-vechainkit-docs-images-bucket.s3.eu-west-1.amazonaws.com/banner.png',
        tag: t('Staking'),
        description: t(
            'Supports only VeWorld, WalletConnect, and Sync2 wallets, and fully integrates VeChain Kit UI into the app to enhance the user experience Profile and Wallet modals.',
        ),
        url: 'https://app.stargate.vechain.org/',
    },

    {
        id: 'betterswap',
        name: 'BetterSwap',
        logo: 'https://api.gateway-proxy.vechain.org/ipfs/bafybeifqy6ojar5aryglbbpvsm7pqz4tn76ruf5nh4vwsb4lc6um5ehvfi/media/logo.png',
        image: 'https://api.gateway-proxy.vechain.org/ipfs/bafybeifqy6ojar5aryglbbpvsm7pqz4tn76ruf5nh4vwsb4lc6um5ehvfi/media/ve_world_featured_image.png',
        tag: t('DeFi'),
        description: t(
            'Uses VeChain Kit to allow social login users to trade on the platform.',
        ),
        url: 'https://www.betterswap.io',
    },
    {
        id: 'vetrade',
        name: 'VeTrade',
        logo: 'https://api.gateway-proxy.vechain.org/ipfs/bafybeihgqfn2fjdjg5pcfdygwbhl5e56vmkvj6rm3dzw4fqfxz6v5njf2u/media/logo.jpeg',
        image: 'https://api.gateway-proxy.vechain.org/ipfs/bafybeihgqfn2fjdjg5pcfdygwbhl5e56vmkvj6rm3dzw4fqfxz6v5njf2u/media/ve_world_banner.jpeg',
        tag: t('Trading'),
        description: t(
            'Uses VeChain Kit only for the login flow and for the hooks to manage transactions.',
        ),
        url: 'https://vetrade.vet/',
    },
    {
        id: 'solarwise',
        name: 'Solarwise',
        logo: 'https://api.gateway-proxy.vechain.org/ipfs/bafybeibdjnbjssp66rssj7gmmnsd3l3ljdmckxxxrouosx2dtuapzyxarq/media/logo.png',
        image: 'https://api.gateway-proxy.vechain.org/ipfs/bafybeibdjnbjssp66rssj7gmmnsd3l3ljdmckxxxrouosx2dtuapzyxarq/media/ve_world_featured_image.png',
        tag: t('Energy'),
        description: t(
            'Lightweight integration to allow social login users to use the platform and manage their energy assets.',
        ),
        url: 'https://app.solarwise.vet/',
    },
];
