export * from './NetworkManager.js';
export * from './SmartAccountManager.js';
export * from './TransactionBuilder.js';
export * from './TransactionManager.js';
export * from './TransactionWrapper.js';
export * from './TokenTransferManager.js';
export * from './TokenManager.js';
export * from './TokenWrapper.js';
export * from './CrossAppProvider.js';
export * from './ConnectionManager.js';
export * from './AuthenticationManager.js';
export * from './ServerAuthManager.js';
export * from './VeChainKit.js';

// Export original factory with different name to avoid conflicts
export { VeChainKitFactory as OriginalVeChainKitFactory, createVeChainKit as originalCreateVeChainKit } from './VeChainKitFactory.js';

// Export wallet providers with specific naming to avoid conflicts
export type { SigningOptions as TransactionSigningOptions } from './TransactionManager.js';
export {
    type IWalletProvider,
    type WalletProviderType,
    WalletProviderFactory,
    DappKitWalletProvider,
    PrivyWalletProvider,
    CrossAppWalletProvider,
    type SigningOptions as WalletSigningOptions,
} from './WalletProviders.js';
