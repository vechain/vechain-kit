// Export types and interfaces
export type {
    ConnectionCacheConfig,
    ConnectionConfig,
    ConnectionEvents,
    IConnectionManager,
} from './types.js';

// Export main connection manager
export { ConnectionManager } from './ConnectionManager.js';

// Export component managers (for advanced use cases)
export { ConnectionCache } from './ConnectionCache.js';
export { ConnectionStateManager } from './ConnectionStateManager.js';
export { MethodAvailability } from './MethodAvailability.js';