/**
 * Connection states for wallet connections
 */
export type ConnectionState =
    | 'disconnected'
    | 'connecting'
    | 'connected'
    | 'failed'
    | 'reconnecting';

/**
 * Available login methods
 */
export type LoginMethod =
    | 'email'
    | 'google'
    | 'dappkit'
    | 'oauth';

/**
 * Connection source types
 */
export type ConnectionSource =
    | 'dappkit'
    | 'privy'
    | 'cross-app'
    | 'walletconnect';

/**
 * Connection information
 */
export interface Connection {
    address: string;
    chainId: number;
    source: ConnectionSource;
    method: LoginMethod;
    timestamp: number;
    metadata?: {
        walletType?: string;
        appId?: string;
        email?: string;
        userId?: string;
        provider?: string;
        sessionId?: string;
        crossAppProvider?: string;
        [key: string]: any;
    };
}

/**
 * Login result from authentication attempt
 */
export interface LoginResult {
    success: boolean;
    connection?: Connection;
    error?: AuthError;
    requiresVerification?: boolean;
    verificationData?: {
        email?: string;
        code?: string;
        authUrl?: string;
        provider?: string;
        state?: string;
        [key: string]: any;
    };
    user?: {
        id: string;
        wallet?: {
            address: string;
            walletClientType?: string;
        };
        [key: string]: any;
    };
}

/**
 * Authentication error types
 */
export interface AuthError extends Error {
    code: string;
    message: string;
    category: ErrorCategory;
    retryable: boolean;
    userFriendlyMessage: string;
}

/**
 * Error category types
 */
export type ErrorCategory =
    | 'user_rejection'
    | 'popup_blocked'
    | 'network_error'
    | 'configuration_error'
    | 'provider_error'
    | 'unknown';