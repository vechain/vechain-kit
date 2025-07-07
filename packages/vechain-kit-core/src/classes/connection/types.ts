import type { EventEmitter } from 'events';
import type {
    ConnectionState,
    LoginMethod,
    Connection,
    LoginResult,
} from '../../types/connection.js';

/**
 * Connection cache configuration
 */
export interface ConnectionCacheConfig {
    enabled: boolean;
    ttlHours: number;
    key?: string;
}

/**
 * Connection configuration
 */
export interface ConnectionConfig {
    enabledMethods: LoginMethod[];
    privyAppId?: string;
    dappKitConfig?: {
        nodeUrl: string;
        walletConnectProjectId?: string;
    };
    crossApp?: {
        appId: string;
        allowedApps?: string[];
    };
    analytics?: boolean;
    cacheOptions?: ConnectionCacheConfig;
}

/**
 * Connection event types
 */
export interface ConnectionEvents {
    connected: [connection: Connection];
    disconnected: [reason?: string];
    connectionChanged: [connection: Connection];
    connectionError: [error: Error];
    stateChanged: [state: ConnectionState];
}

/**
 * Connection manager interface
 */
export interface IConnectionManager extends EventEmitter {
    getConnectionState(): ConnectionState;
    getCurrentConnection(): Connection | null;
    isConnected(): boolean;
    getEnabledMethods(): LoginMethod[];
    isMethodAvailable(method: LoginMethod): boolean;
    connect(method: LoginMethod, params?: any): Promise<LoginResult>;
    disconnect(): Promise<void>;
    isLoading(method?: LoginMethod): boolean;
}