import { EventEmitter } from 'events';
import { ILogger, IConnectionManager } from '../interfaces/index.js';
import { createLogger } from '../utils/logger.js';
import type {
    ConnectionState,
    LoginMethod,
    ConnectionSource,
    Connection,
    LoginResult,
    AuthError,
    ErrorCategory,
} from '../types/connection.js';


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
 * Core connection manager for VeChain Kit
 * Handles all wallet connection flows without framework dependencies
 */
export class ConnectionManager
    extends EventEmitter
    implements IConnectionManager
{
    private connectionState: ConnectionState = 'disconnected';
    private currentConnection: Connection | null = null;
    private loadingStates: Map<string, boolean> = new Map();
    private logger: ILogger;
    private config: ConnectionConfig;
    private cacheKey: string;
    private cacheTTL: number;

    constructor(config: ConnectionConfig) {
        super();

        this.logger = createLogger('ConnectionManager');

        // Check if localStorage is available for default cache config
        const storageAvailable = this.isStorageAvailable();

        // Default cache config - disabled if localStorage unavailable
        const defaultCacheConfig: ConnectionCacheConfig = {
            enabled: storageAvailable,
            ttlHours: 24,
            key: 'vechain_kit_connection',
        };

        this.config = {
            cacheOptions: defaultCacheConfig,
            ...config,
        };

        this.cacheKey =
            this.config.cacheOptions?.key || 'vechain_kit_connection';
        this.cacheTTL =
            (this.config.cacheOptions?.ttlHours || 24) * 60 * 60 * 1000;

        if (this.config.cacheOptions?.enabled) {
            this.logger.debug('Connection caching enabled', {
                ttlHours: this.config.cacheOptions.ttlHours,
                cacheKey: this.cacheKey,
                storageAvailable,
            });
            this.loadConnectionCache();
        } else {
            this.logger.debug('Connection caching disabled', {
                storageAvailable,
                explicitlyDisabled: config.cacheOptions?.enabled === false,
            });
        }
    }

    /**
     * Get the current connection state
     */
    getConnectionState(): ConnectionState {
        return this.connectionState;
    }

    /**
     * Get the current connection information
     */
    getCurrentConnection(): Connection | null {
        return this.currentConnection;
    }

    /**
     * Check if currently connected
     */
    isConnected(): boolean {
        return (
            this.connectionState === 'connected' &&
            this.currentConnection !== null
        );
    }

    /**
     * Get enabled login methods based on configuration
     */
    getEnabledMethods(): LoginMethod[] {
        return this.config.enabledMethods.filter((method) =>
            this.isMethodAvailable(method),
        );
    }

    /**
     * Check if a specific login method is available
     */
    isMethodAvailable(method: LoginMethod): boolean {
        switch (method) {
            case 'email':
            case 'google':
            case 'passkey':
            case 'oauth':
                return !!this.config.privyAppId;
            case 'vechain':
                return !!this.config.crossApp?.appId;
            case 'dappkit':
            case 'walletconnect':
                return !!this.config.dappKitConfig;
            case 'ecosystem':
                return !!this.config.crossApp?.allowedApps?.length;
            default:
                return false;
        }
    }

    /**
     * Get loading state for a specific operation
     */
    getLoadingState(key: string): boolean {
        return this.loadingStates.get(key) || false;
    }

    /**
     * Connect using specified method
     */
    async connect(method: LoginMethod, params?: any): Promise<LoginResult> {
        this.logger.info('Attempting connection', { method, params });

        try {
            this.setConnectionState('connecting');
            this.setLoadingState(method, true);

            const result = await this.executeConnectionMethod(method, params);

            if (result.success && result.connection) {
                this.setCurrentConnection(result.connection);
                this.setConnectionState('connected');
                this.saveConnectionCache(result.connection);

                this.logger.info('Connection successful', {
                    method,
                    address: result.connection.address,
                });
            } else {
                this.setConnectionState('failed');
                this.logger.warn('Connection failed', {
                    method,
                    error: result.error,
                });
            }

            return result;
        } catch (error) {
            const authError = this.handleConnectionError(error, method);
            this.setConnectionState('failed');
            this.logger.error('Connection error', {
                method: method,
                error: error instanceof Error ? error.message : String(error),
            } as any);

            return {
                success: false,
                error: authError,
            };
        } finally {
            this.setLoadingState(method, false);
        }
    }

    /**
     * Disconnect current connection
     */
    async disconnect(): Promise<void> {
        this.logger.info('Disconnecting', {
            connection: this.currentConnection?.address,
        });

        try {
            if (this.currentConnection) {
                await this.executeDisconnection(this.currentConnection.source);
            }

            this.setCurrentConnection(null);
            this.setConnectionState('disconnected');
            this.clearConnectionCache();

            this.logger.info('Disconnection successful');
        } catch (error) {
            this.logger.error('Disconnection error', {
                error: error instanceof Error ? error.message : String(error),
            } as any);
            throw error;
        }
    }

    /**
     * Verify email code for email login
     */
    async verifyEmailCode(email: string, code: string): Promise<LoginResult> {
        this.logger.info('Verifying email code', { email });

        try {
            this.setLoadingState('email-verification', true);

            // This would integrate with Privy's verification
            const result = await this.executeEmailVerification(email, code);

            if (result.success && result.connection) {
                this.setCurrentConnection(result.connection);
                this.setConnectionState('connected');
                this.saveConnectionCache(result.connection);
            }

            return result;
        } catch (error) {
            const authError = this.handleConnectionError(error, 'email');
            return {
                success: false,
                error: authError,
            };
        } finally {
            this.setLoadingState('email-verification', false);
        }
    }

    /**
     * Reconnect using cached connection
     */
    async reconnect(): Promise<LoginResult> {
        const cached = this.loadConnectionCache();
        if (!cached) {
            return {
                success: false,
                error: {
                    code: 'NO_CACHED_CONNECTION',
                    message: 'No cached connection found',
                    category: 'configuration_error',
                    retryable: false,
                    userFriendlyMessage: 'Please connect your wallet',
                },
            };
        }

        this.logger.info('Attempting reconnection', {
            method: cached.method,
            address: cached.address,
        });

        this.setConnectionState('reconnecting');
        return this.connect(cached.method);
    }

    /**
     * Execute specific connection method
     */
    private async executeConnectionMethod(
        method: LoginMethod,
        params?: any,
    ): Promise<LoginResult> {
        switch (method) {
            case 'email':
                return this.connectWithEmail(params?.email);
            case 'google':
            case 'oauth':
                return this.connectWithOAuth(params?.provider || 'google');
            case 'vechain':
                return this.connectWithVeChain();
            case 'passkey':
                return this.connectWithPasskey();
            case 'dappkit':
                return this.connectWithDappKit(params?.walletType);
            case 'walletconnect':
                return this.connectWithWalletConnect();
            case 'ecosystem':
                return this.connectWithEcosystem(params?.appId);
            default:
                throw new Error(`Unsupported connection method: ${method}`);
        }
    }

    /**
     * Email connection implementation
     */
    private async connectWithEmail(email: string): Promise<LoginResult> {
        if (!email) {
            throw new Error('Email is required for email login');
        }

        // This would integrate with Privy's email authentication
        // For now, return a placeholder that indicates verification is needed
        return {
            success: false,
            requiresVerification: true,
            verificationData: { email },
        };
    }

    /**
     * OAuth connection implementation
     */
    private async connectWithOAuth(
        provider: string = 'google',
    ): Promise<LoginResult> {
        // This would integrate with Privy's OAuth flows
        // Placeholder implementation
        throw new Error('OAuth connection not yet implemented');
    }

    /**
     * VeChain ecosystem connection implementation
     */
    private async connectWithVeChain(): Promise<LoginResult> {
        // This would integrate with VeChain's cross-app SDK
        // Placeholder implementation
        throw new Error('VeChain connection not yet implemented');
    }

    /**
     * Passkey connection implementation
     */
    private async connectWithPasskey(): Promise<LoginResult> {
        // This would integrate with Privy's passkey authentication
        // Placeholder implementation
        throw new Error('Passkey connection not yet implemented');
    }

    /**
     * DappKit connection implementation
     */
    private async connectWithDappKit(
        walletType?: string,
    ): Promise<LoginResult> {
        // This would integrate with VeChain DappKit
        // Placeholder implementation
        throw new Error('DappKit connection not yet implemented');
    }

    /**
     * WalletConnect implementation
     */
    private async connectWithWalletConnect(): Promise<LoginResult> {
        // This would integrate with WalletConnect
        // Placeholder implementation
        throw new Error('WalletConnect not yet implemented');
    }

    /**
     * Ecosystem app connection implementation
     */
    private async connectWithEcosystem(appId: string): Promise<LoginResult> {
        // This would integrate with VeChain ecosystem apps
        // Placeholder implementation
        throw new Error('Ecosystem connection not yet implemented');
    }

    /**
     * Execute disconnection for specific source
     */
    private async executeDisconnection(
        source: ConnectionSource,
    ): Promise<void> {
        switch (source) {
            case 'dappkit':
                // Disconnect from DappKit
                break;
            case 'privy':
                // Disconnect from Privy
                break;
            case 'cross-app':
                // Disconnect from cross-app
                break;
            case 'walletconnect':
                // Disconnect from WalletConnect
                break;
        }
    }

    /**
     * Execute email verification
     */
    private async executeEmailVerification(
        email: string,
        code: string,
    ): Promise<LoginResult> {
        // This would integrate with Privy's verification API
        // Placeholder implementation
        throw new Error('Email verification not yet implemented');
    }

    /**
     * Handle connection errors
     */
    private handleConnectionError(error: any, method: LoginMethod): AuthError {
        // Categorize and format errors for user-friendly display
        const message = error?.message || 'Unknown error occurred';

        let category: ErrorCategory = 'unknown';
        let userFriendlyMessage = 'Connection failed. Please try again.';
        let retryable = true;

        if (message.includes('rejected') || message.includes('denied')) {
            category = 'user_rejection';
            userFriendlyMessage = 'Connection was cancelled.';
            retryable = false;
        } else if (message.includes('popup') || message.includes('blocked')) {
            category = 'popup_blocked';
            userFriendlyMessage = 'Please allow popups and try again.';
        } else if (message.includes('network') || message.includes('timeout')) {
            category = 'network_error';
            userFriendlyMessage =
                'Network error. Please check your connection.';
        }

        return {
            code: error?.code || 'CONNECTION_ERROR',
            message,
            category,
            retryable,
            userFriendlyMessage,
        };
    }

    /**
     * Set connection state and emit events
     */
    private setConnectionState(state: ConnectionState): void {
        const previousState = this.connectionState;
        this.connectionState = state;

        if (previousState !== state) {
            this.emit('connectionStateChange', state, previousState);
            this.logger.debug('Connection state changed', {
                from: previousState,
                to: state,
            });
        }
    }

    /**
     * Set current connection and emit events
     */
    private setCurrentConnection(connection: Connection | null): void {
        const previous = this.currentConnection;
        this.currentConnection = connection;

        this.emit('connectionChange', connection, previous);

        if (connection) {
            this.emit('connected', connection);
        } else if (previous) {
            this.emit('disconnected', previous);
        }
    }

    /**
     * Set loading state for specific operation
     */
    private setLoadingState(key: string, loading: boolean): void {
        const wasLoading = this.loadingStates.get(key);
        this.loadingStates.set(key, loading);

        if (wasLoading !== loading) {
            this.emit('loadingStateChange', key, loading);
        }
    }

    /**
     * Check if localStorage is available
     */
    private isStorageAvailable(): boolean {
        try {
            if (typeof window === 'undefined' || !window.localStorage) {
                return false;
            }
            // Test if we can actually write to localStorage
            const testKey = '__vechain_kit_storage_test__';
            localStorage.setItem(testKey, 'test');
            localStorage.removeItem(testKey);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Save connection to cache
     */
    private saveConnectionCache(connection: Connection): void {
        if (!this.config.cacheOptions?.enabled) {
            return;
        }

        try {
            if (!this.isStorageAvailable()) {
                this.logger.warn('localStorage not available, skipping cache');
                return;
            }

            const cacheData = {
                ...connection,
                timestamp: Date.now(),
            };

            localStorage.setItem(this.cacheKey, JSON.stringify(cacheData));

            this.logger.debug('Connection cached', {
                address: connection.address,
                cacheKey: this.cacheKey,
            });
        } catch (error) {
            this.logger.warn('Failed to cache connection', {
                error: error instanceof Error ? error.message : String(error),
            });
        }
    }

    /**
     * Load connection from cache
     */
    private loadConnectionCache(): Connection | null {
        if (!this.config.cacheOptions?.enabled) {
            return null;
        }

        try {
            if (!this.isStorageAvailable()) {
                this.logger.debug(
                    'localStorage not available, skipping cache load',
                );
                return null;
            }

            const cached = localStorage.getItem(this.cacheKey);
            if (!cached) {
                this.logger.debug('No cached connection found');
                return null;
            }

            const connection = JSON.parse(cached) as Connection;

            // Validate cached connection structure
            if (!this.isValidCachedConnection(connection)) {
                this.logger.warn(
                    'Invalid cached connection structure, clearing cache',
                );
                this.clearConnectionCache();
                return null;
            }

            // Check if cache is still valid
            if (Date.now() - connection.timestamp > this.cacheTTL) {
                this.logger.debug('Cached connection expired, clearing cache');
                this.clearConnectionCache();
                return null;
            }

            this.logger.debug('Connection loaded from cache', {
                address: connection.address,
                age: Math.round(
                    (Date.now() - connection.timestamp) / 1000 / 60,
                ),
                cacheKey: this.cacheKey,
            });

            return connection;
        } catch (error) {
            this.logger.warn('Failed to load cached connection', {
                error: error instanceof Error ? error.message : String(error),
            });
            return null;
        }
    }

    /**
     * Validate cached connection structure
     */
    private isValidCachedConnection(connection: any): connection is Connection {
        return (
            connection &&
            typeof connection === 'object' &&
            typeof connection.address === 'string' &&
            typeof connection.chainId === 'number' &&
            typeof connection.source === 'string' &&
            typeof connection.method === 'string' &&
            typeof connection.timestamp === 'number' &&
            connection.address.length > 0
        );
    }

    /**
     * Clear connection cache
     */
    private clearConnectionCache(): void {
        if (!this.config.cacheOptions?.enabled) {
            return;
        }

        try {
            if (!this.isStorageAvailable()) {
                this.logger.debug(
                    'localStorage not available, skipping cache clear',
                );
                return;
            }

            localStorage.removeItem(this.cacheKey);
            this.logger.debug('Connection cache cleared', {
                cacheKey: this.cacheKey,
            });
        } catch (error) {
            this.logger.warn('Failed to clear connection cache', {
                error: error instanceof Error ? error.message : String(error),
            });
        }
    }

    /**
     * Get cache configuration
     */
    getCacheConfig(): ConnectionCacheConfig {
        return (
            this.config.cacheOptions || {
                enabled: false,
                ttlHours: 24,
            }
        );
    }

    /**
     * Check if caching is currently working
     */
    isCacheEnabled(): boolean {
        return !!(
            this.config.cacheOptions?.enabled && this.isStorageAvailable()
        );
    }

    /**
     * Update cache configuration
     */
    updateCacheConfig(config: Partial<ConnectionCacheConfig>): void {
        this.config.cacheOptions = {
            enabled: true,
            ttlHours: 24,
            ...this.config.cacheOptions,
            ...config,
        };

        if (config.ttlHours) {
            this.cacheTTL = config.ttlHours * 60 * 60 * 1000;
        }

        if (config.key) {
            this.cacheKey = config.key;
        }

        this.logger.debug('Cache configuration updated', {
            config: this.config.cacheOptions,
        });
    }
}
