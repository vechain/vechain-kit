import { EventEmitter } from 'events';
import { ILogger } from '../../interfaces/index.js';
import { createLogger } from '../../utils/logger.js';
import type {
    ConnectionState,
    LoginMethod,
    Connection,
    LoginResult,
    AuthError,
    ErrorCategory,
} from '../../types/connection.js';
import { AuthenticationManager } from '../authentication/index.js';
import type {
    ConnectionConfig,
    ConnectionEvents,
    IConnectionManager,
} from './types.js';
import { ConnectionCache } from './ConnectionCache.js';
import { ConnectionStateManager } from './ConnectionStateManager.js';
import { MethodAvailability } from './MethodAvailability.js';

/**
 * Core connection manager for VeChain Kit
 * Handles all wallet connection flows without framework dependencies
 */
export class ConnectionManager
    extends EventEmitter<ConnectionEvents>
    implements IConnectionManager
{
    private logger: ILogger;
    private config: ConnectionConfig;
    private authenticationManager: AuthenticationManager | null = null;

    // Component managers
    private cache: ConnectionCache;
    private stateManager: ConnectionStateManager;
    private methodAvailability: MethodAvailability;

    constructor(config: ConnectionConfig) {
        super();
        this.logger = createLogger('ConnectionManager');
        this.config = this.validateAndNormalizeConfig(config);

        // Initialize component managers
        this.cache = new ConnectionCache(
            this.config.cacheOptions || { enabled: false, ttlHours: 24 },
        );
        this.stateManager = new ConnectionStateManager();
        this.methodAvailability = new MethodAvailability(this.config);

        // Forward events from state manager
        this.stateManager.on('connected', (connection) => {
            this.emit('connected', connection);
            this.cache.saveConnection(connection);
        });

        this.stateManager.on('disconnected', (reason) => {
            this.emit('disconnected', reason);
            this.cache.clearCache();
        });

        this.stateManager.on('connectionChanged', (connection) => {
            this.emit('connectionChanged', connection);
            this.cache.saveConnection(connection);
        });

        this.stateManager.on('connectionError', (error) => {
            this.emit('connectionError', error);
        });

        this.stateManager.on('stateChanged', (state) => {
            // Forward state change events if needed
        });

        // Try to restore cached connection
        this.initializeFromCache();

        this.logger.info('ConnectionManager initialized', {
            enabledMethods: this.config.enabledMethods,
            cacheEnabled: this.config.cacheOptions?.enabled,
            analyticsEnabled: this.config.analytics,
        });
    }

    /**
     * Get the current connection state
     */
    getConnectionState(): ConnectionState {
        return this.stateManager.getConnectionState();
    }

    /**
     * Get the current connection information
     */
    getCurrentConnection(): Connection | null {
        return this.stateManager.getCurrentConnection();
    }

    /**
     * Check if currently connected
     */
    isConnected(): boolean {
        return this.stateManager.isConnected();
    }

    /**
     * Get enabled login methods based on configuration
     */
    getEnabledMethods(): LoginMethod[] {
        return this.methodAvailability.getEnabledMethods();
    }

    /**
     * Check if a specific login method is available
     */
    isMethodAvailable(method: LoginMethod): boolean {
        return this.methodAvailability.isMethodAvailable(method);
    }

    /**
     * Check if a method is currently loading
     */
    isLoading(method?: LoginMethod): boolean {
        return this.stateManager.isLoading(method);
    }

    /**
     * Connect using specified method
     */
    async connect(method: LoginMethod, params?: any): Promise<LoginResult> {
        this.logger.info('Connection attempt started', {
            method,
            currentState: this.getConnectionState(),
            hasParams: !!params,
        });

        // Validate method availability
        if (!this.isMethodAvailable(method)) {
            const error = this.createConnectionError(
                `Login method '${method}' is not available`,
                'configuration_error',
                method,
            );
            this.stateManager.handleError(error, method);
            return { success: false, error };
        }

        // Check if already loading this method
        if (this.isLoading(method)) {
            const error = this.createConnectionError(
                `Connection with '${method}' already in progress`,
                'user_rejection',
                method,
            );
            return { success: false, error };
        }

        try {
            // Set loading state
            this.stateManager.setLoading(method, true);
            this.stateManager.setConnectionState('connecting');

            // Get or create authentication manager
            const authManager = await this.getAuthenticationManager();

            // Execute authentication based on method
            const result = await this.executeAuthentication(
                authManager,
                method,
                params,
            );

            if (result.success && result.connection) {
                this.stateManager.setConnectionState(
                    'connected',
                    result.connection,
                );
                this.logger.info('Connection successful', {
                    method,
                    address: result.connection.address,
                    source: result.connection.source,
                });

                // Track analytics if enabled
                if (this.config.analytics) {
                    this.trackConnectionEvent('connection_success', {
                        method,
                        source: result.connection.source,
                        chainId: result.connection.chainId,
                    });
                }
            } else {
                this.stateManager.setConnectionState('disconnected');
                this.logger.warn('Connection failed', {
                    method,
                    error: result.error?.message,
                });

                // Track analytics if enabled
                if (this.config.analytics) {
                    this.trackConnectionEvent('connection_failed', {
                        method,
                        error: result.error?.code,
                        category: result.error?.category,
                    });
                }
            }

            return result;
        } catch (error) {
            const connectionError = this.createConnectionError(
                error instanceof Error ? error.message : String(error),
                'unknown',
                method,
            );

            this.stateManager.setConnectionState('disconnected');
            this.stateManager.handleError(connectionError, method);

            this.logger.error('Connection attempt failed', {
                method,
                error: connectionError.message,
            });

            return { success: false, error: connectionError };
        } finally {
            // Always clear loading state
            this.stateManager.setLoading(method, false);
        }
    }

    /**
     * Disconnect current connection
     */
    async disconnect(): Promise<void> {
        const currentConnection = this.getCurrentConnection();

        if (!currentConnection) {
            this.logger.debug('No active connection to disconnect');
            return;
        }

        this.logger.info('Disconnecting', {
            address: currentConnection.address,
            source: currentConnection.source,
        });

        try {
            // Clear all loading states
            this.stateManager.clearAllLoading();

            // Set disconnected state
            this.stateManager.setConnectionState(
                'disconnected',
                undefined,
                'user_requested',
            );

            // Track analytics if enabled
            if (this.config.analytics) {
                this.trackConnectionEvent('disconnection', {
                    source: currentConnection.source,
                    method: currentConnection.method,
                });
            }

            this.logger.info('Disconnected successfully');
        } catch (error) {
            this.logger.error('Error during disconnection', {
                error: error instanceof Error ? error.message : String(error),
            });
            throw error;
        }
    }

    /**
     * Get detailed status of all methods
     */
    getMethodsStatus() {
        return this.methodAvailability.getMethodsStatus();
    }

    /**
     * Get connection cache information
     */
    getCacheInfo() {
        return this.cache.getCacheInfo();
    }

    /**
     * Get current state summary
     */
    getStateSummary() {
        const stateSummary = this.stateManager.getStateSummary();
        const methodsStatus = this.getMethodsStatus();
        const cacheInfo = this.getCacheInfo();

        return {
            ...stateSummary,
            enabledMethods: this.getEnabledMethods(),
            methodsStatus,
            cacheInfo,
        };
    }

    /**
     * Update configuration
     */
    updateConfig(newConfig: Partial<ConnectionConfig>): void {
        this.config = this.validateAndNormalizeConfig({
            ...this.config,
            ...newConfig,
        });

        this.methodAvailability.updateConfig(this.config);

        this.logger.info('Configuration updated', {
            enabledMethods: this.config.enabledMethods,
        });
    }

    /**
     * Initialize from cached connection
     */
    private initializeFromCache(): void {
        const cachedConnection = this.cache.loadConnection();

        if (cachedConnection) {
            this.stateManager.setConnectionState('connected', cachedConnection);
            this.logger.info('Restored connection from cache', {
                address: cachedConnection.address,
                source: cachedConnection.source,
                method: cachedConnection.method,
            });
        }
    }

    /**
     * Get or create authentication manager
     */
    private async getAuthenticationManager(): Promise<AuthenticationManager> {
        if (!this.authenticationManager) {
            // Create authentication config from connection config
            const authConfig = {
                privy: this.config.privyAppId
                    ? { appId: this.config.privyAppId }
                    : undefined,
                dappKit: this.config.dappKitConfig,
                crossApp: this.config.crossApp,
                analytics: this.config.analytics
                    ? { enabled: true }
                    : undefined,
            };

            this.authenticationManager = new AuthenticationManager(authConfig);
            this.logger.debug('Authentication manager created');
        }

        return this.authenticationManager;
    }

    /**
     * Execute authentication based on method
     */
    private async executeAuthentication(
        authManager: AuthenticationManager,
        method: LoginMethod,
        params: any,
    ): Promise<LoginResult> {
        switch (method) {
            case 'email':
                return await authManager.authenticateWithEmail(params);
            case 'google':
            case 'oauth':
                return await authManager.authenticateWithOAuth(params);
            case 'dappkit':
                return await authManager.authenticateWithDappKit(params);
            default:
                throw new Error(`Unsupported authentication method: ${method}`);
        }
    }

    /**
     * Create standardized connection error
     */
    private createConnectionError(
        message: string,
        category: ErrorCategory,
        method?: LoginMethod,
    ): AuthError {
        return {
            code: 'CONNECTION_ERROR',
            message,
            category,
            retryable: category !== 'configuration_error',
            userFriendlyMessage: this.getUserFriendlyErrorMessage(
                category,
                method,
            ),
        };
    }

    /**
     * Get user-friendly error message
     */
    private getUserFriendlyErrorMessage(
        category: ErrorCategory,
        method?: LoginMethod,
    ): string {
        switch (category) {
            case 'configuration_error':
                return `${method} is not properly configured. Please check your settings.`;
            case 'user_rejection':
                return 'Connection was cancelled. Please try again.';
            case 'network_error':
                return 'Network error. Please check your connection and try again.';
            case 'popup_blocked':
                return 'Please allow popups in your browser and try again.';
            default:
                return `Failed to connect${
                    method ? ` with ${method}` : ''
                }. Please try again.`;
        }
    }

    /**
     * Validate and normalize configuration
     */
    private validateAndNormalizeConfig(
        config: ConnectionConfig,
    ): ConnectionConfig {
        const validation = this.methodAvailability?.validateConfig() || {
            valid: true,
            warnings: [],
            errors: [],
        };

        if (!validation.valid) {
            this.logger.warn('Configuration validation failed', {
                errors: validation.errors,
                warnings: validation.warnings,
            });
        }

        // Set default cache config if not provided
        const defaultCacheConfig = {
            enabled: this.isStorageAvailable(),
            ttlHours: 24,
            key: 'vechain_kit_connection',
        };

        return {
            cacheOptions: defaultCacheConfig,
            ...config,
        };
    }

    /**
     * Check if localStorage is available
     */
    private isStorageAvailable(): boolean {
        try {
            if (typeof window === 'undefined' || !window.localStorage) {
                return false;
            }

            const testKey = '__vechain_storage_test__';
            window.localStorage.setItem(testKey, 'test');
            window.localStorage.removeItem(testKey);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Track connection events for analytics
     */
    private trackConnectionEvent(event: string, data: any): void {
        if (!this.config.analytics) return;

        try {
            // TODO: Implement analytics tracking
            this.logger.debug('Connection event tracked', { event, data });
        } catch (error) {
            this.logger.warn('Failed to track connection event', {
                event,
                error: error instanceof Error ? error.message : String(error),
            });
        }
    }
}
