import type {
    ConnectionState,
    Connection,
    LoginMethod,
    LoginResult,
} from '../types/connection.js';
import type {
    EmailAuthParams,
    OAuthAuthParams,
    DappKitAuthParams,
    AuthState,
} from '../types/authentication.js';

/**
 * Logger interface for debugging
 */
export interface ILogger {
    debug(message: string, ...args: unknown[]): void;
    info(message: string, ...args: unknown[]): void;
    warn(message: string, ...args: unknown[]): void;
    error(message: string, ...args: unknown[]): void;
}

/**
 * Connection manager interface
 */
export interface IConnectionManager {
    getConnectionState(): ConnectionState;
    getCurrentConnection(): Connection | null;
    isConnected(): boolean;
    getEnabledMethods(): LoginMethod[];
    isMethodAvailable(method: LoginMethod): boolean;
    getLoadingState(key: string): boolean;
    connect(method: LoginMethod, params?: any): Promise<LoginResult>;
    disconnect(): Promise<void>;
    verifyEmailCode(email: string, code: string): Promise<LoginResult>;
    reconnect(): Promise<LoginResult>;
}

/**
 * Authentication manager interface
 */
export interface IAuthenticationManager {
    authenticateWithEmail(params: EmailAuthParams): Promise<LoginResult>;
    authenticateWithOAuth(params: OAuthAuthParams): Promise<LoginResult>;
    authenticateWithDappKit(params?: DappKitAuthParams): Promise<LoginResult>;
    getAuthState(sessionId: string): AuthState | null;
    clearAuthState(sessionId: string): void;
    isMethodAvailable(method: LoginMethod): boolean;
}

/**
 * Cache interface
 */
export interface ICache<T> {
    get(key: string): T | undefined;
    set(key: string, value: T, ttl?: number): void;
    has(key: string): boolean;
    delete(key: string): void;
    clear(): void;
}
