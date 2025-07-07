import { EventEmitter } from 'events';
import { ILogger } from '../interfaces/index.js';
import { createLogger } from '../utils/logger.js';
import type {
    LoginResult,
    Connection,
    AuthError,
    LoginMethod,
    ConnectionSource,
    ErrorCategory,
} from '../types/connection.js';

// Server auth types
type PrivyServerAuth = any;

/**
 * Server authentication configuration
 */
export interface ServerAuthConfig {
    privy: {
        appId: string;
        appSecret: string;
        environment?: 'production' | 'development';
    };
    analytics?: {
        enabled: boolean;
        trackingId?: string;
    };
}

/**
 * Server-side authentication manager for VeChain Kit
 * Uses Privy server SDK for token verification and user management
 */
export class ServerAuthManager extends EventEmitter {
    private logger: ILogger;
    private config: ServerAuthConfig;
    private privyServerAuth: PrivyServerAuth | null = null;

    constructor(config: ServerAuthConfig) {
        super();
        this.config = config;
        this.logger = createLogger('ServerAuthManager');
        this.initializeServerAuth();
    }

    /**
     * Verify a user's access token
     */
    async verifyAccessToken(accessToken: string): Promise<{
        success: boolean;
        user?: any;
        error?: AuthError;
    }> {
        if (!this.privyServerAuth) {
            return {
                success: false,
                error: {
                    code: 'SERVER_AUTH_NOT_INITIALIZED',
                    message: 'Server auth not initialized',
                    category: 'configuration_error',
                    retryable: false,
                    userFriendlyMessage: 'Authentication service not available',
                },
            };
        }

        try {
            const user = await this.privyServerAuth.verifyAuthToken(
                accessToken,
            );

            this.logger.info('Access token verified successfully', {
                userId: user.id,
            });

            return {
                success: true,
                user,
            };
        } catch (error) {
            const authError = this.createAuthError(error);
            this.logger.error(
                'Token verification failed',
                error instanceof Error ? error : new Error(String(error)),
            );

            return {
                success: false,
                error: authError,
            };
        }
    }

    /**
     * Get user by ID
     */
    async getUser(userId: string): Promise<{
        success: boolean;
        user?: any;
        error?: AuthError;
    }> {
        if (!this.privyServerAuth) {
            return {
                success: false,
                error: {
                    code: 'SERVER_AUTH_NOT_INITIALIZED',
                    message: 'Server auth not initialized',
                    category: 'configuration_error',
                    retryable: false,
                    userFriendlyMessage: 'Authentication service not available',
                },
            };
        }

        try {
            const user = await this.privyServerAuth.getUser(userId);

            this.logger.info('User retrieved successfully', { userId });

            return {
                success: true,
                user,
            };
        } catch (error) {
            const authError = this.createAuthError(error);
            this.logger.error(
                'Failed to get user',
                error instanceof Error ? error : new Error(String(error)),
            );

            return {
                success: false,
                error: authError,
            };
        }
    }

    /**
     * Create a Connection from verified user data
     */
    createConnectionFromUser(user: any): Connection | null {
        try {
            // Find embedded wallet in user's linked accounts
            const walletAccount = user.linked_accounts?.find(
                (acc: any) => acc.type === 'wallet' && 'address' in acc,
            );

            if (!walletAccount?.address) {
                this.logger.warn('No wallet address found for user', {
                    userId: user.id,
                });
                return null;
            }

            // Determine authentication method from user's accounts
            let method: LoginMethod = 'email'; // default
            let metadata: any = { userId: user.id };

            if (
                user.linked_accounts?.find((acc: any) => acc.type === 'email')
            ) {
                method = 'email';
                metadata.email = user.linked_accounts.find(
                    (acc: any) => acc.type === 'email',
                )?.address;
            } else if (
                user.linked_accounts?.find(
                    (acc: any) => acc.type === 'google_oauth',
                )
            ) {
                method = 'google';
                metadata.provider = 'google';
            } else if (
                user.linked_accounts?.find((acc: any) => acc.type === 'passkey')
            ) {
                method = 'passkey';
            }

            return {
                address: walletAccount.address,
                chainId: 100009, // VeChain mainnet
                source: 'privy',
                method,
                timestamp: Date.now(),
                metadata,
            };
        } catch (error) {
            this.logger.error(
                'Failed to create connection from user',
                error instanceof Error ? error : new Error(String(error)),
            );
            return null;
        }
    }

    /**
     * Initialize server authentication
     */
    private async initializeServerAuth(): Promise<void> {
        try {
            // Use eval to avoid TypeScript compile-time module resolution
            const importFn = new Function(
                'specifier',
                'return import(specifier)',
            );
            const privyModule = await importFn('@privy-io/server-auth').catch(
                (error: any) => {
                    this.logger.warn(
                        'Privy server auth module not available - install @privy-io/server-auth for server-side authentication',
                        {
                            error: error.message,
                        },
                    );
                    return null;
                },
            );

            if (!privyModule) {
                return;
            }

            const { PrivyApi } = privyModule;

            this.privyServerAuth = new PrivyApi({
                appId: this.config.privy.appId,
                appSecret: this.config.privy.appSecret,
            });

            this.logger.info('Privy server auth initialized', {
                appId: this.config.privy.appId,
                environment: this.config.privy.environment || 'production',
            });
        } catch (error) {
            this.logger.error(
                'Failed to initialize Privy server auth',
                error instanceof Error ? error : new Error(String(error)),
            );
        }
    }

    /**
     * Create standardized auth error
     */
    private createAuthError(error: any): AuthError {
        const message = error?.message || 'Server authentication failed';

        return {
            code: error?.code || 'SERVER_AUTH_ERROR',
            message,
            category: this.categorizeError(error),
            retryable: this.isRetryableError(error),
            userFriendlyMessage: this.getUserFriendlyMessage(error),
        };
    }

    /**
     * Categorize error for better handling
     */
    private categorizeError(error: any): ErrorCategory {
        const message = error?.message?.toLowerCase() || '';

        if (message.includes('invalid') || message.includes('expired')) {
            return 'provider_error';
        }
        if (message.includes('unauthorized') || message.includes('forbidden')) {
            return 'user_rejection';
        }
        if (message.includes('network') || message.includes('timeout')) {
            return 'network_error';
        }
        if (
            message.includes('configuration') ||
            message.includes('not initialized')
        ) {
            return 'configuration_error';
        }

        return 'unknown';
    }

    /**
     * Check if error is retryable
     */
    private isRetryableError(error: any): boolean {
        const message = error?.message?.toLowerCase() || '';

        // Invalid tokens are typically not retryable
        if (message.includes('invalid') || message.includes('expired')) {
            return false;
        }

        // Most other errors can be retried
        return true;
    }

    /**
     * Get user-friendly error message
     */
    private getUserFriendlyMessage(error: any): string {
        const message = error?.message?.toLowerCase() || '';

        if (message.includes('invalid') || message.includes('expired')) {
            return 'Session expired. Please log in again.';
        }
        if (message.includes('unauthorized') || message.includes('forbidden')) {
            return 'Access denied. Please check your permissions.';
        }
        if (message.includes('network') || message.includes('timeout')) {
            return 'Network error. Please check your connection and try again.';
        }

        return 'Authentication failed. Please try again.';
    }

    /**
     * Check if server auth is available
     */
    isAvailable(): boolean {
        return !!this.privyServerAuth;
    }
}
