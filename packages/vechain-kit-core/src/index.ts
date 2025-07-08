// Export main classes
export { VeChainKit, createVeChainKit } from './classes/VeChainKit.js';
export { VeChainKitFactory } from './classes/VeChainKitFactory.js';

// Export authentication system
export * from './classes/authentication/index.js';

// Export connection system  
export * from './classes/connection/index.js';

// Export interfaces
export type { ILogger } from './interfaces/index.js';

// Export utility functions
export { createLogger, LogLevel } from './utils/logger.js';

// Export configuration
export { ChainId } from './config/network.js';

// Export connection types
export type {
    ConnectionState,
    LoginMethod,
    Connection,
    LoginResult,
    AuthError,
    ErrorCategory,
} from './types/connection.js';