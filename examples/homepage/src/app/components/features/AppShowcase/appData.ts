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
            '• Uses VeChain Kit end-to-end: login, wallet, hooks, and transaction components.',
        ),
        url: 'https://velottery.vet/',
    },
    {
        id: 'cleanify',
        name: 'Cleanify',
        logo: 'https://api.gateway-proxy.vechain.org/ipfs/bafybeicvr6ivkwv2iygkgcijbmjaorfyi4gui2bjskhwuitop7n3tqo24m/media/logo.png',
        image: 'https://api.gateway-proxy.vechain.org/ipfs/bafybeicvr6ivkwv2iygkgcijbmjaorfyi4gui2bjskhwuitop7n3tqo24m/media/ve_world_featured_image.png',
        tag: t('Sustainability'),
        description: t(
            '• Uses its own Privy setup.\n• Supports Google OAuth login and VeWorld login.\n• Implements custom login, wallet management, and transaction flows (no VeChain Kit UI).\n• Uses VeChain Kit UI only for the "Receive" and "Send" screens.\n• Uses VeChain Kit hooks for transaction management.',
        ),
        url: 'https://cleanify.vet/',
    },
    {
        id: 'stargate',
        name: 'StarGate',
        logo: 'https://prod-vechainkit-docs-images-bucket.s3.eu-west-1.amazonaws.com/stargate-icon.png',
        image: 'https://prod-vechainkit-docs-images-bucket.s3.eu-west-1.amazonaws.com/banner.png',
        tag: t('Staking'),
        description: t(
            '• Supports VeWorld, WalletConnect, and Sync2 wallets (only).\n• VeChain Kit UI is fully integrated into the app.\n• Uses VeChain Kit hooks for transaction management.\n• Uses custom transaction flows and components.',
        ),
        url: 'https://app.stargate.vechain.org/',
    },
    {
        id: 'vebetter',
        name: 'VeBetter',
        logo: 'https://prod-vechainkit-docs-images-bucket.s3.eu-west-1.amazonaws.com/vebetter-512x512.png',
        image: 'https://governance.vebetterdao.org/assets/images/platform_page.webp',
        tag: t('DAO'),
        description: t(
            '• Supports all login methods.\n• VeChain Kit UI is fully integrated into the app.\n• Uses a bottom sheet UX on mobile.\n• Uses VeChain Kit hooks for transaction management.\n• Uses custom transaction flows and components.',
        ),
        url: 'https://governance.vebetterdao.org/',
    },

    {
        id: 'betterswap',
        name: 'BetterSwap',
        logo: 'https://api.gateway-proxy.vechain.org/ipfs/bafybeifqy6ojar5aryglbbpvsm7pqz4tn76ruf5nh4vwsb4lc6um5ehvfi/media/logo.png',
        image: 'https://api.gateway-proxy.vechain.org/ipfs/bafybeifqy6ojar5aryglbbpvsm7pqz4tn76ruf5nh4vwsb4lc6um5ehvfi/media/ve_world_featured_image.png',
        tag: t('DeFi'),
        description: t(
            '• Supports all login methods.\n• Uses the login and wallet modals.\n• Uses VeChain Kit hooks for transaction management.\n• Uses custom transaction flows and components.',
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
            '• Uses VeChain Kit UI only for the "Login" screen.\n• Uses VeChain Kit hooks.',
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
            '• Lightweight integration for social login.\n• Uses the login and wallet modals.',
        ),
        url: 'https://app.solarwise.vet/',
    },
];
