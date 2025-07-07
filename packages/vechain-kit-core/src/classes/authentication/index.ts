// Export types and interfaces
export type {
    OAuthProvider,
    WalletProvider,
    AuthState,
    EmailAuthParams,
    OAuthAuthParams,
    DappKitAuthParams,
    CrossAppAuthParams,
    PasskeyAuthParams,
    AuthEvents,
    IAuthenticationManager,
} from './types.js';

export type { AuthProviderConfig } from './config.js';

// Export main authentication manager
export { AuthenticationManager } from './AuthenticationManager.js';

// Export individual authenticators (for advanced use cases)
export { EmailAuthenticator } from './EmailAuthenticator.js';
export { OAuthAuthenticator } from './OAuthAuthenticator.js';
export { PasskeyAuthenticator } from './PasskeyAuthenticator.js';
export { CrossAppAuthenticator } from './CrossAppAuthenticator.js';
export { DappKitAuthenticator } from './DappKitAuthenticator.js';

// Export utilities
export { ClientInitializer } from './ClientInitializer.js';