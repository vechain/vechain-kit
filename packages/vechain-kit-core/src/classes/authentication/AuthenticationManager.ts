import { EventEmitter } from 'events';
import { ILogger } from '../../interfaces/index.js';
import { createLogger } from '../../utils/logger.js';
import type {
    LoginResult,
    Connection,
    AuthError,
    LoginMethod,
    ErrorCategory,
} from '../../types/connection.js';
import type { AuthProviderConfig } from './config.js';
import type {
    AuthState,
    AuthEvents,
    IAuthenticationManager,
    EmailAuthParams,
    OAuthAuthParams,
    DappKitAuthParams,
    CrossAppAuthParams,
    PasskeyAuthParams,
    OAuthProvider,
} from './types.js';
import { EmailAuthenticator } from './EmailAuthenticator.js';
import { OAuthAuthenticator } from './OAuthAuthenticator.js';
import { DappKitAuthenticator } from './DappKitAuthenticator.js';
import { ClientInitializer } from './ClientInitializer.js';
import { ChainId } from '../../config/network.js';

/**
 * Handles authentication flows using various providers
 */
export class AuthenticationManager
    extends EventEmitter<AuthEvents>
    implements IAuthenticationManager
{
    private logger: ILogger;
    private config: AuthProviderConfig;
    private authStates: Map<string, AuthState> = new Map();
    private sessionTimeout: number = 10 * 60 * 1000; // 10 minutes

    // External service clients
    private privyClient: any | null = null;
    private dappKitClient: any = null;

    // Authenticators
    private emailAuthenticator: EmailAuthenticator | null = null;
    private oauthAuthenticator: OAuthAuthenticator | null = null;
    private dappKitAuthenticator: DappKitAuthenticator | null = null;

    // Utilities
    private clientInitializer: ClientInitializer;

    constructor(config: AuthProviderConfig) {
        super();
        this.config = config;
        this.logger = createLogger('AuthenticationManager');
        this.clientInitializer = new ClientInitializer(config);
        this.initializeClients();
        this.startSessionCleanup();
    }

    /**
     * Get the chain ID from the network configuration
     */
    private getChainId(): number {
        return this.config.network?.chainId || ChainId.MAINNET;
    }

    /**
     * Authenticate with email (Privy)
     */
    async authenticateWithEmail(params: EmailAuthParams): Promise<LoginResult> {
        const sessionId = this.generateSessionId('email');

        try {
            this.setAuthState(sessionId, {
                sessionId,
                method: 'email',
                step: 'initiated',
                data: { email: params.email },
                timestamp: Date.now(),
            });

            this.emit('auth:started', sessionId, 'email');

            if (!this.isMethodAvailable('email')) {
                throw new Error('Email authentication not configured');
            }

            if (!this.emailAuthenticator) {
                throw new Error('Email authenticator not initialized');
            }

            if (!params.code) {
                // Send verification code
                await this.emailAuthenticator.sendVerificationCode(
                    params.email,
                    sessionId,
                );

                this.setAuthState(sessionId, {
                    sessionId,
                    method: 'email',
                    step: 'verification',
                    data: { email: params.email },
                    timestamp: Date.now(),
                });

                this.emit('auth:verification', sessionId, {
                    email: params.email,
                });

                return {
                    success: false,
                    requiresVerification: true,
                    verificationData: { email: params.email },
                };
            } else {
                // Verify code and complete authentication
                const result =
                    await this.emailAuthenticator.verifyEmailAndComplete(
                        params.email,
                        params.code,
                        sessionId,
                        this.getChainId(),
                    );

                if (result.success && result.connection) {
                    this.setAuthState(sessionId, {
                        sessionId,
                        method: 'email',
                        step: 'completed',
                        data: result.connection,
                        timestamp: Date.now(),
                    });

                    this.emit('auth:success', sessionId, result.connection);

                    // Track analytics if enabled
                    if (this.config.analytics?.enabled) {
                        this.trackAuthEvent('email_verification_success', {
                            email: params.email,
                            sessionId,
                        });
                    }
                }

                return result;
            }
        } catch (error) {
            const authError = this.createAuthError(error, 'email');
            this.setAuthState(sessionId, {
                sessionId,
                method: 'email',
                step: 'failed',
                error: authError,
                timestamp: Date.now(),
            });

            this.emit('auth:failed', sessionId, authError);

            return {
                success: false,
                error: authError,
            };
        }
    }

    /**
     * Authenticate with OAuth provider (Privy)
     */
    async authenticateWithOAuth(params: OAuthAuthParams): Promise<LoginResult> {
        const sessionId = this.generateSessionId(`oauth-${params.provider}`);

        try {
            this.setAuthState(sessionId, {
                sessionId,
                method: 'google', // map to LoginMethod
                step: 'initiated',
                data: { provider: params.provider, scopes: params.scopes },
                timestamp: Date.now(),
            });

            this.emit('auth:started', sessionId, 'google');

            if (!this.isMethodAvailable('google')) {
                throw new Error('OAuth authentication not configured');
            }

            if (!this.oauthAuthenticator) {
                throw new Error('OAuth authenticator not initialized');
            }

            this.setAuthState(sessionId, {
                sessionId,
                method: 'google',
                step: 'pending',
                data: { provider: params.provider },
                timestamp: Date.now(),
            });

            this.emit('auth:step', sessionId, 'pending');

            // Execute OAuth flow
            const authResult = await this.oauthAuthenticator.executeOAuthFlow(
                params,
                sessionId,
            );

            if (authResult.success && authResult.connection) {
                this.setAuthState(sessionId, {
                    sessionId,
                    method: 'google',
                    step: 'completed',
                    data: authResult.connection,
                    timestamp: Date.now(),
                });

                this.emit('auth:success', sessionId, authResult.connection);
            }

            return authResult;
        } catch (error) {
            const authError = this.createAuthError(error, 'google');
            this.setAuthState(sessionId, {
                sessionId,
                method: 'google',
                step: 'failed',
                error: authError,
                timestamp: Date.now(),
            });

            this.emit('auth:failed', sessionId, authError);

            return {
                success: false,
                error: authError,
            };
        }
    }

    /**
     * Authenticate with DappKit wallet
     */
    async authenticateWithDappKit(
        params?: DappKitAuthParams,
    ): Promise<LoginResult> {
        const sessionId = this.generateSessionId('dappkit');

        try {
            this.setAuthState(sessionId, {
                sessionId,
                method: 'dappkit',
                step: 'initiated',
                data: params,
                timestamp: Date.now(),
            });

            this.emit('auth:started', sessionId, 'dappkit');

            if (!this.isMethodAvailable('dappkit')) {
                throw new Error('DappKit authentication not configured');
            }

            if (!this.dappKitAuthenticator) {
                throw new Error('DappKit authenticator not initialized');
            }

            this.setAuthState(sessionId, {
                sessionId,
                method: 'dappkit',
                step: 'pending',
                data: params,
                timestamp: Date.now(),
            });

            this.emit('auth:step', sessionId, 'pending');

            // Execute DappKit wallet connection
            const authResult =
                await this.dappKitAuthenticator.executeDappKitAuth(
                    params || {},
                    sessionId,
                );

            if (authResult.success && authResult.connection) {
                this.setAuthState(sessionId, {
                    sessionId,
                    method: 'dappkit',
                    step: 'completed',
                    data: authResult.connection,
                    timestamp: Date.now(),
                });

                this.emit('auth:success', sessionId, authResult.connection);
            }

            return authResult;
        } catch (error) {
            const authError = this.createAuthError(error, 'dappkit');
            this.setAuthState(sessionId, {
                sessionId,
                method: 'dappkit',
                step: 'failed',
                error: authError,
                timestamp: Date.now(),
            });

            this.emit('auth:failed', sessionId, authError);

            return {
                success: false,
                error: authError,
            };
        }
    }

    /**
     * Complete OAuth flow after redirect
     */
    async completeOAuthFlow(
        provider: OAuthProvider,
        authorizationCode: string,
    ): Promise<LoginResult> {
        if (!this.oauthAuthenticator) {
            throw new Error('OAuth authenticator not initialized');
        }

        return await this.oauthAuthenticator.completeOAuthFlow(
            provider,
            authorizationCode,
            this.getChainId(),
        );
    }

    /**
     * Get current authentication state for a session
     */
    getAuthState(sessionId: string): AuthState | null {
        return this.authStates.get(sessionId) || null;
    }

    /**
     * Clear authentication state for a session
     */
    clearAuthState(sessionId: string): void {
        this.authStates.delete(sessionId);
        this.logger.debug('Auth state cleared', { sessionId });
    }

    /**
     * Check if authentication method is available
     */
    isMethodAvailable(method: LoginMethod): boolean {
        switch (method) {
            case 'email':
            case 'google':
                return !!(this.config.privy?.appId && this.privyClient);
            case 'dappkit':
                return !!(this.config.dappKit?.nodeUrl && this.dappKitClient);
            default:
                return false;
        }
    }

    /**
     * Get active authentication sessions
     */
    getActiveSessions(): AuthState[] {
        return Array.from(this.authStates.values()).filter(
            (state) => state.step !== 'completed' && state.step !== 'failed',
        );
    }

    /**
     * Clear expired authentication sessions
     */
    clearExpiredSessions(): void {
        const now = Date.now();
        const expiredSessions: string[] = [];

        Array.from(this.authStates.entries()).forEach(([sessionId, state]) => {
            if (now - state.timestamp > this.sessionTimeout) {
                expiredSessions.push(sessionId);
            }
        });

        expiredSessions.forEach((sessionId) => {
            this.clearAuthState(sessionId);
        });

        if (expiredSessions.length > 0) {
            this.logger.debug('Cleared expired sessions', {
                count: expiredSessions.length,
                sessionIds: expiredSessions,
            });
        }
    }

    /**
     * Initialize external authentication clients
     */
    private async initializeClients(): Promise<void> {
        if (this.config.privy?.appId) {
            try {
                this.privyClient =
                    await this.clientInitializer.initializePrivyClient();
                this.emailAuthenticator = new EmailAuthenticator(
                    this.privyClient,
                );
                this.oauthAuthenticator = new OAuthAuthenticator(
                    this.privyClient,
                );
            } catch (error) {
                this.logger.warn('Failed to initialize Privy client', error);
            }
        }

        if (this.config.dappKit?.nodeUrl) {
            try {
                this.dappKitClient =
                    await this.clientInitializer.initializeDappKitClient();
                this.dappKitAuthenticator = new DappKitAuthenticator(
                    this.dappKitClient,
                );
            } catch (error) {
                this.logger.warn('Failed to initialize DappKit client', error);
            }
        }

        this.logger.info('Authentication clients initialized', {
            privyClient: !!this.privyClient,
            dappKit: !!this.dappKitClient,
        });
    }

    /**
     * Create standardized auth error
     */
    private createAuthError(error: any, method: LoginMethod): AuthError {
        const message = error?.message || 'Authentication failed';

        return {
            code: error?.code || 'AUTH_ERROR',
            message,
            category: this.categorizeError(error, method),
            retryable: this.isRetryableError(error),
            userFriendlyMessage: this.getUserFriendlyMessage(error, method),
        };
    }

    /**
     * Categorize error for better handling
     */
    private categorizeError(error: any, method: LoginMethod): ErrorCategory {
        const message = error?.message?.toLowerCase() || '';

        if (message.includes('rejected') || message.includes('cancelled')) {
            return 'user_rejection';
        }
        if (message.includes('popup') || message.includes('blocked')) {
            return 'popup_blocked';
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

        // User rejections are typically not retryable automatically
        if (message.includes('rejected') || message.includes('cancelled')) {
            return false;
        }

        // Most other errors can be retried
        return true;
    }

    /**
     * Get user-friendly error message
     */
    private getUserFriendlyMessage(error: any, method: LoginMethod): string {
        const message = error?.message?.toLowerCase() || '';

        if (message.includes('rejected') || message.includes('cancelled')) {
            return 'Authentication was cancelled. Please try again.';
        }
        if (message.includes('popup') || message.includes('blocked')) {
            return 'Please allow popups in your browser and try again.';
        }
        if (message.includes('network') || message.includes('timeout')) {
            return 'Network error. Please check your connection and try again.';
        }

        return `Failed to authenticate with ${method}. Please try again.`;
    }

    /**
     * Set authentication state
     */
    private setAuthState(sessionId: string, state: AuthState): void {
        this.authStates.set(sessionId, state);
        this.emit('auth:step', sessionId, state.step);
        this.logger.debug('Auth state updated', {
            sessionId,
            method: state.method,
            step: state.step,
        });
    }

    /**
     * Generate unique session ID
     */
    private generateSessionId(method: string): string {
        return `${method}-${Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 9)}`;
    }

    /**
     * Start session cleanup interval
     */
    private startSessionCleanup(): void {
        setInterval(() => {
            this.clearExpiredSessions();
        }, 5 * 60 * 1000);
    }

    /**
     * Track authentication events for analytics
     */
    private trackAuthEvent(event: string, data: any): void {
        if (!this.config.analytics?.enabled) {
            return;
        }

        try {
            // TODO: Implement analytics tracking
            this.logger.debug('Auth event tracked', { event, data });
        } catch (error) {
            this.logger.warn('Failed to track auth event', {
                event,
                error: error instanceof Error ? error.message : String(error),
            });
        }
    }
}
