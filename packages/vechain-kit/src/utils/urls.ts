/**
 * Centralized URL constants for VeChain Kit.
 *
 * Notes:
 * - Keep this file as a pure constant module (no imports) to avoid circular deps.
 * - We intentionally do NOT include XML namespaces (e.g. `http://www.w3.org/...`) or `data:` URIs here.
 */
export const ARWEAVE_BASE_URL = 'https://arweave.net/' as const;

export const VECHAIN_ENERGY_SWAP_URL = 'https://swap.vechain.energy/' as const;

export const MAINNET_GENERIC_DELEGATOR_URL =
    'https://mainnet.delegator.vechain.org/api/v1/' as const;
export const TESTNET_GENERIC_DELEGATOR_URL =
    'https://testnet.delegator.vechain.org/api/v1/' as const;

export const GITHUB_API_BASE_URL = 'https://api.github.com' as const;
export const APP_HUB_RAW_BASE_URL =
    'https://raw.githubusercontent.com/vechain/app-hub/master' as const;
export const VECHAIN_KIT_RELEASES_TAG_BASE_URL =
    'https://github.com/vechain/vechain-kit/releases/tag/' as const;

export const IMAGE_NOT_FOUND_URL =
    'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png' as const;
export const PRIVY_VECHAIN_CONNECTOR_ICON_URL =
    'https://imagedelivery.net/oHBRUd2clqykxgDWmeAyLg/661dd77c-2f9d-40e7-baa1-f4e24fd7bf00/icon' as const;
export const VECHAIN_KIT_DOCS_IMAGES_BUCKET_BASE_URL =
    'https://prod-vechainkit-docs-images-bucket.s3.eu-west-1.amazonaws.com' as const;
export const VEBETTERDAO_LOGO_URL = 'https://i.ibb.co/cgJBj83/vbd.png' as const;

export const CLEANIFY_APP_URL = 'https://app.cleanify.vet' as const;
export const GREENCART_APP_URL = 'https://greencart.ai' as const;
export const MUGSHOT_APP_URL = 'https://mugshot.vet/' as const;
export const EVEARN_APP_URL = 'https://evearn.io' as const;

export const MAINNET_EXPLORER_URL = 'https://explore.vechain.org' as const;
export const TESTNET_EXPLORER_URL =
    'https://explore-testnet.vechain.org' as const;
export const TESTNET_INSIGHT_EXPLORER_URL =
    'https://insight.vecha.in/#/test' as const;
export const VECHAINSTATS_URL = 'https://vechainstats.com' as const;
export const VECHAINSTATS_TRANSACTION_URL =
    'https://vechainstats.com/transaction' as const;
export const TESTNET_EXPLORER_TRANSACTIONS_URL =
    'https://explore-testnet.vechain.org/transactions' as const;

export const THOR_MAINNET_URLS = [
    'https://mainnet.vechain.org',
    'https://vethor-node.vechain.com',
    'https://mainnet.veblocks.net',
    'https://mainnet.vecha.in',
] as const;

export const THOR_TESTNET_URLS = [
    'https://testnet.vechain.org',
    'https://vethor-node-test.vechaindev.com',
    'https://sync-testnet.veblocks.net',
    'https://testnet.vecha.in',
] as const;

export const THOR_SOLO_URLS = ['http://localhost:8669'] as const;

export const PRIVY_STATUS_SUMMARY_URL =
    'https://status.privy.io/summary.json' as const;
export const PRIVY_AUTH_APP_INFO_BASE_URL =
    'https://auth.privy.io/api/v1/apps/' as const;

export const X_PROFILE_BASE_URL = 'https://x.com/' as const;
export const TWITTER_INTENT_TWEET_TEXT_BASE_URL =
    'https://twitter.com/intent/tweet?text=' as const;
export const WHATSAPP_SHARE_TEXT_BASE_URL = 'https://wa.me/?text=' as const;
export const TELEGRAM_SHARE_URL_BASE_URL =
    'https://telegram.me/share/url?url=' as const;

export const VETRADE_QUOTE_VCK_URL =
    'https://vetrade.vet/api/quote/vck' as const;

export const TOKEN_REGISTRY_BASE_URL =
    'https://vechain.github.io/token-registry/' as const;
export const TOKEN_REGISTRY_PLACEHOLDER_ICON_FILE =
    'b74678c3e1d0cbdd76c81579f6d2b551c4704811.png' as const;

export const VEBETTERDAO_GOVERNANCE_URL =
    'https://governance.vebetterdao.org/' as const;
export const VEBETTERDAO_GOVERNANCE_NO_TRAILING_SLASH_URL =
    'https://governance.vebetterdao.org' as const;

export const VECHAIN_KIT_BASE_URL = 'https://vechainkit.vechain.org' as const;
export const VECHAIN_KIT_TERMS_URL =
    'https://vechainkit.vechain.org/terms' as const;
export const VECHAIN_KIT_COOKIES_URL =
    'https://vechainkit.vechain.org/cookies' as const;
export const VECHAIN_KIT_DOCS_URL =
    'https://docs.vechainkit.vechain.org/' as const;

export const MAINNET_GATEWAY_PROXY_IPFS_BASE_URL =
    'https://api.gateway-proxy.vechain.org/ipfs' as const;
export const MAINNET_GATEWAY_PROXY_PINNING_URL =
    'https://api.gateway-proxy.vechain.org/api/v1/pinning/pinFileToIPFS' as const;
export const DEV_GATEWAY_PROXY_IPFS_BASE_URL =
    'https://api.dev.gateway-proxy.vechain.org/ipfs' as const;
export const DEV_GATEWAY_PROXY_PINNING_URL =
    'https://api.dev.gateway-proxy.vechain.org/api/v1/pinning/pinFileToIPFS' as const;

export const MAINNET_INDEXER_BASE_URL =
    'https://indexer.mainnet.vechain.org/api/v1' as const;
export const TESTNET_INDEXER_BASE_URL =
    'https://indexer.testnet.vechain.org/api/v1' as const;
export const B3TR_MAINNET_INDEXER_BASE_URL =
    'https://b3tr.mainnet.vechain.org/api/v1' as const;
export const B3TR_TESTNET_INDEXER_BASE_URL =
    'https://b3tr.testnet.vechain.org/api/v1' as const;
export const VNS_GRAPHQL_INDEXER_URL =
    'https://graph.vet/subgraphs/name/vns' as const;

export const VET_DOMAINS_URL = 'https://vet.domains' as const;
export const VET_DOMAINS_AVATAR_MAINNET_API_URL =
    'https://vet.domains/api/avatar' as const;
export const VET_DOMAINS_AVATAR_TESTNET_API_URL =
    'https://testnet.vet.domains/api/avatar' as const;
export const VET_DOMAINS_WALLETCONNECT_IMAGE_URL =
    'https://vet.domains/assets/walletconnect.png' as const;
