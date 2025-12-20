export interface AppData {
    id: string;
    name: string;
    logo: string;
    image: string;
    tag: string;
    description: string;
    url: string;
}

export const apps: AppData[] = [
    {
        id: 'stargate',
        name: 'StarGate',
        logo: 'https://prod-vechainkit-docs-images-bucket.s3.eu-west-1.amazonaws.com/stargate-icon.png',
        image: 'https://prod-vechainkit-docs-images-bucket.s3.eu-west-1.amazonaws.com/banner.png',
        tag: 'Staking',
        description: `• Supports VeWorld, WalletConnect, and Sync2 wallets (only).
• VeChain Kit UI is fully integrated into the app.
• Uses VeChain Kit hooks for transaction management.
• Uses custom transaction flows and components.`,
        url: 'https://app.stargate.vechain.org/',
    },
    {
        id: 'vebetter',
        name: 'VeBetter',
        logo: 'https://prod-vechainkit-docs-images-bucket.s3.eu-west-1.amazonaws.com/vebetter-512x512.png',
        image: 'https://governance.vebetterdao.org/assets/images/platform_page.webp',
        tag: 'DAO',
        description: `• Supports all login methods.
• VeChain Kit UI is fully integrated into the app.
• Uses a bottom sheet UX on mobile.
• Uses VeChain Kit hooks for transaction management.
• Uses custom transaction flows and components.`,
        url: 'https://governance.vebetterdao.org/',
    },
    {
        id: 'cleanify',
        name: 'Cleanify',
        logo: 'https://api.gateway-proxy.vechain.org/ipfs/bafybeicvr6ivkwv2iygkgcijbmjaorfyi4gui2bjskhwuitop7n3tqo24m/media/logo.png',
        image: 'https://api.gateway-proxy.vechain.org/ipfs/bafybeicvr6ivkwv2iygkgcijbmjaorfyi4gui2bjskhwuitop7n3tqo24m/media/ve_world_featured_image.png',
        tag: 'Sustainability',
        description: `• Uses its own Privy setup.
• Supports Google OAuth login and VeWorld login.
• Implements custom login, wallet management, and transaction flows (no VeChain Kit UI).
• Uses VeChain Kit UI only for the "Receive" and "Send" screens.
• Uses VeChain Kit hooks for transaction management.`,
        url: 'https://cleanify.vet/',
    },
    {
        id: 'betterswap',
        name: 'BetterSwap',
        logo: 'https://api.gateway-proxy.vechain.org/ipfs/bafybeifqy6ojar5aryglbbpvsm7pqz4tn76ruf5nh4vwsb4lc6um5ehvfi/media/logo.png',
        image: 'https://api.gateway-proxy.vechain.org/ipfs/bafybeifqy6ojar5aryglbbpvsm7pqz4tn76ruf5nh4vwsb4lc6um5ehvfi/media/ve_world_featured_image.png',
        tag: 'DeFi',
        description: `• Supports all login methods.
• Uses the login and wallet modals.
• Uses VeChain Kit hooks for transaction management.
• Uses custom transaction flows and components.`,
        url: 'https://www.betterswap.io',
    },
    {
        id: 'vetrade',
        name: 'VeTrade',
        logo: 'https://api.gateway-proxy.vechain.org/ipfs/bafybeihgqfn2fjdjg5pcfdygwbhl5e56vmkvj6rm3dzw4fqfxz6v5njf2u/media/logo.jpeg',
        image: 'https://api.gateway-proxy.vechain.org/ipfs/bafybeihgqfn2fjdjg5pcfdygwbhl5e56vmkvj6rm3dzw4fqfxz6v5njf2u/media/ve_world_banner.jpeg',
        tag: 'Trading',
        description: `• Uses VeChain Kit UI only for the "Login" screen.
• Uses VeChain Kit hooks.`,
        url: 'https://vetrade.vet/',
    },
    {
        id: 'velottery',
        name: 'VeLottery',
        logo: 'https://api.gateway-proxy.vechain.org/ipfs/bafybeigtlombd3jplbq33k2m2p5cbrbniznv4fnr3bbh2hxxackh5bpcqy/media/logo.png',
        image: 'https://api.gateway-proxy.vechain.org/ipfs/bafybeigtlombd3jplbq33k2m2p5cbrbniznv4fnr3bbh2hxxackh5bpcqy/media/ve_world_banner.png',
        tag: 'Gaming',
        description: `• Uses VeChain Kit end-to-end: login, wallet, hooks, and transaction components.`,
        url: 'https://velottery.vet/',
    },
    {
        id: 'solarwise',
        name: 'Solarwise',
        logo: 'https://api.gateway-proxy.vechain.org/ipfs/bafybeibdjnbjssp66rssj7gmmnsd3l3ljdmckxxxrouosx2dtuapzyxarq/media/logo.png',
        image: 'https://api.gateway-proxy.vechain.org/ipfs/bafybeibdjnbjssp66rssj7gmmnsd3l3ljdmckxxxrouosx2dtuapzyxarq/media/ve_world_featured_image.png',
        tag: 'Energy',
        description: `• Lightweight integration for social login.
• Uses the login and wallet modals.`,
        url: 'https://app.solarwise.vet/',
    },
];
