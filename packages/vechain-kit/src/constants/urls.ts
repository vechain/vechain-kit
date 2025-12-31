// Base URLs only (scheme + host). No paths here by request.

// GitHub
export const APP_HUB_GITHUB_API_BASE_URL =
    'https://api.github.com/repos/vechain/app-hub';
export const APP_HUB_GITHUB_RAW_REPO_BASE_URL =
    'https://raw.githubusercontent.com/vechain/app-hub';
// Include the repo prefix so callers only append branch/sha + path (not owner/repo every time)
// Privy
export const PRIVY_STATUS_BASE_URL = 'https://status.privy.io';
export const PRIVY_AUTH_BASE_URL = 'https://auth.privy.io';

// VeChain / Infra
export const VECHAIN_MAINNET_NODE_BASE_URL = 'https://mainnet.vechain.org';
export const VECHAIN_TESTNET_NODE_BASE_URL = 'https://testnet.vechain.org';
export const VECHAIN_KIT_WEBSITE_BASE_URL = 'https://vechainkit.vechain.org';
export const VECHAIN_KIT_DOCS_BASE_URL = 'https://docs.vechainkit.vechain.org';

export const VECHAIN_GATEWAY_PROXY_BASE_URL =
    'https://api.gateway-proxy.vechain.org';
export const VECHAIN_GATEWAY_PROXY_DEV_BASE_URL =
    'https://api.dev.gateway-proxy.vechain.org';

// VNS (GraphQL)
export const GRAPH_VET_BASE_URL = 'https://graph.vet';

// VET Domains
export const VET_DOMAINS_BASE_URL = 'https://vet.domains';
export const VET_DOMAINS_TESTNET_BASE_URL = 'https://testnet.vet.domains';

// Delegator
export const GENERIC_DELEGATOR_MAINNET_URL =
    'https://mainnet.delegator.vechain.org';
export const GENERIC_DELEGATOR_TESTNET_URL =
    'https://testnet.delegator.vechain.org';

// Explorers
export const VECHAIN_EXPLORER_BASE_URL = 'https://explore.vechain.org';
export const VECHAIN_EXPLORER_TESTNET_BASE_URL =
    'https://explore-testnet.vechain.org';
export const VECHAINSTATS_BASE_URL = 'https://vechainstats.com';

// Ecosystem / partners
export const VEBETTERDAO_GOVERNANCE_BASE_URL =
    'https://governance.vebetterdao.org';
export const VECHAIN_ENERGY_SWAP_BASE_URL = 'https://swap.vechain.energy';
export const VETRADE_BASE_URL = 'https://vetrade.vet';

// Ecosystem app websites
export const CLEANIFY_APP_BASE_URL = 'https://app.cleanify.vet';
export const GREENCART_BASE_URL = 'https://greencart.ai';
export const MUGSHOT_BASE_URL = 'https://mugshot.vet';
export const EVEARN_BASE_URL = 'https://evearn.io';

// VeChain docs
export const VECHAIN_DOCS_BASE_URL = 'https://docs.vechain.org';

// Token registry / assets
export const VECHAIN_TOKEN_REGISTRY_ASSETS_BASE_URL =
    'https://vechain.github.io/token-registry/assets';
export const COINMARKETCAP_STATIC_BASE_URL = 'https://s2.coinmarketcap.com';
export const IMAGE_NOT_FOUND_URL =
    'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png';

// Image / asset CDNs used in UI
export const VECHAIN_KIT_DOCS_IMAGES_S3_BASE_URL =
    'https://prod-vechainkit-docs-images-bucket.s3.eu-west-1.amazonaws.com';
export const PRIVY_MINTLIFY_ASSETS_S3_BASE_URL =
    'https://mintlify.s3.us-west-1.amazonaws.com';

// Social / sharing
export const X_BASE_URL = 'https://x.com';
export const TWITTER_BASE_URL = 'https://twitter.com';
export const TELEGRAM_BASE_URL = 'https://telegram.me';
export const WHATSAPP_BASE_URL = 'https://wa.me';

// Storage / content addressing
export const ARWEAVE_GATEWAY_BASE_URL = 'https://arweave.net';
