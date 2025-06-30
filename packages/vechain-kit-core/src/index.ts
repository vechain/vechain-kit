export * from './classes/index.js';
export * from './utils/index.js';
export * from './config/index.js';
export * from './contracts/index.js';
export type {
    INetworkManager,
    ISmartAccountManager,
    ITransactionBuilder,
    ITransactionManager,
    ITokenManager,
    IConnectionManager,
    IAuthenticationManager,
    ILogger,
    ICache,
    IEventEmitter,
    NetworkInfo,
    SmartAccountInfo,
    TransactionBody,
    TransactionOptions,
    TokenBalance,
    TokenInfo,
} from './interfaces/index.js';
export * from './errors/index.js';

// Export types explicitly to avoid conflicts with interfaces
export type {
    LegalDocument,
    EnrichedLegalDocument,
    LegalDocumentAgreement,
    LegalDocumentType,
    LegalDocumentSource,
} from './types/index.js';

// Export utility functions
export { createLogger, LogLevel } from './utils/logger.js';
export { MemoryCache, createCacheKey, Cacheable } from './utils/cache.js';

// Export main VeChainKit class - the new clean API
export {
    VeChainKit,
    VeChainKitFactory,
    createVeChainKit,
} from './classes/VeChainKit.js';

// Export wallet providers with proper type exports
export type {
    IWalletProvider,
    WalletProviderType,
    SigningOptions as WalletSigningOptions,
} from './classes/WalletProviders.js';
export {
    WalletProviderFactory,
    DappKitWalletProvider,
    PrivyWalletProvider,
    CrossAppWalletProvider,
} from './classes/WalletProviders.js';
