import type { EventEmitter } from 'events';
import type {
    LoginResult,
    Connection,
    AuthError,
    LoginMethod,
} from './connection.js';

/**
 * Browser authentication provider configuration
 */
export interface AuthProviderConfig {
    privy?: {
        appId: string;
        clientId?: string;
        environment?: 'production' | 'development';
    };
    dappKit?: {
        nodeUrl: string;
        walletConnectProjectId?: string;
        supportedWallets?: WalletProvider[];
    };
    crossApp?: {
        appId: string;
        allowedApps?: string[];
        environment?: 'production' | 'development';
    };
    analytics?: {
        enabled: boolean;
        trackingId?: string;
    };
}

/**
 * OAuth provider types
 */
export type OAuthProvider =
    | 'google'
    | 'twitter'
    | 'apple'
    | 'discord'
    | 'github';

/**
 * Wallet provider types for DappKit
 */
export type WalletProvider = 'veworld' | 'sync2' | 'walletconnect' | 'auto';

/**
 * Authentication state for multi-step flows
 */
export interface AuthState {
    sessionId: string;
    method: LoginMethod;
    step: 'initiated' | 'pending' | 'verification' | 'completed' | 'failed';
    data?: any;
    error?: AuthError;
    timestamp: number;
}

/**
 * Email authentication parameters
 */
export interface EmailAuthParams {
    email: string;
    code?: string;
}

/**
 * OAuth authentication parameters
 */
export interface OAuthAuthParams {
    provider: OAuthProvider;
    redirectUrl?: string;
    scopes?: string[];
}

/**
 * DappKit authentication parameters
 */
export interface DappKitAuthParams {
    walletType?: WalletProvider;
    chainId?: number;
    requiredMethods?: string[];
}

/**
 * Cross-app authentication parameters
 */
export interface CrossAppAuthParams {
    appId?: string;
    metadata?: {
        name?: string;
        description?: string;
        url?: string;
        logoUrl?: string;
    };
}

/**
 * Passkey authentication parameters
 */
export interface PasskeyAuthParams {
    challenge?: string;
    userDisplayName?: string;
}

/**
 * Authentication event types
 */
export interface AuthEvents {
    'auth:started': [sessionId: string, method: LoginMethod];
    'auth:step': [sessionId: string, step: AuthState['step']];
    'auth:success': [sessionId: string, connection: Connection];
    'auth:failed': [sessionId: string, error: AuthError];
    'auth:verification': [sessionId: string, data: any];
}

/**
 * Authentication manager interface
 */
export interface IAuthenticationManager {
    authenticateWithEmail(params: EmailAuthParams): Promise<LoginResult>;
    authenticateWithOAuth(params: OAuthAuthParams): Promise<LoginResult>;
    authenticateWithPasskey(params?: PasskeyAuthParams): Promise<LoginResult>;
    authenticateWithVeChain(params?: CrossAppAuthParams): Promise<LoginResult>;
    authenticateWithDappKit(params?: DappKitAuthParams): Promise<LoginResult>;
    completeOAuthFlow(
        provider: OAuthProvider,
        authorizationCode: string,
    ): Promise<LoginResult>;
    getAuthState(sessionId: string): AuthState | null;
    clearAuthState(sessionId: string): void;
    isMethodAvailable(method: LoginMethod): boolean;
}

/**
 * Browser-focused Privy client type
 */
export type PrivyClientAuth = any;
