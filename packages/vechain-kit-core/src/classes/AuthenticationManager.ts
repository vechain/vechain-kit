import { EventEmitter } from 'events';
import { ILogger } from '../interfaces/index.js';
import { createLogger } from '../utils/logger.js';
import type {
    LoginResult,
    Connection,
    AuthError,
    LoginMethod,
    ConnectionSource,
} from '../types/connection.js';
import type {
    AuthProviderConfig,
    OAuthProvider,
    WalletProvider,
    AuthState,
    EmailAuthParams,
    OAuthAuthParams,
    DappKitAuthParams,
    CrossAppAuthParams,
    PasskeyAuthParams,
    AuthEvents,
    IAuthenticationManager,
    PrivyClientAuth,
} from '../types/authentication.js';
import { ICrossAppProvider } from './CrossAppProvider.js';
import {
    WalletProviderFactory,
    WalletProviderType,
    IWalletProvider,
} from './WalletProviders.js';

/**
 * Browser-focused auth mgr for VeChain Kit
 * Handles auth flows using Privy client SDK
 * Designed for browser envs and UI interactions
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
    private privyClient: PrivyClientAuth | null = null;
    private dappKitClient: any = null;
    private crossAppProvider: ICrossAppProvider | null = null;

    constructor(config: AuthProviderConfig) {
        super();
        this.config = config;
        this.logger = createLogger('AuthenticationManager');
        this.initializeClients();
        this.startSessionCleanup();
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

            if (!params.code) {
                // Send verification code
                await this.sendEmailVerificationCode(params.email, sessionId);

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
                return await this.verifyEmailAndComplete(
                    params.email,
                    params.code,
                    sessionId,
                );
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

            this.setAuthState(sessionId, {
                sessionId,
                method: 'google',
                step: 'pending',
                data: { provider: params.provider },
                timestamp: Date.now(),
            });

            this.emit('auth:step', sessionId, 'pending');

            // Execute OAuth flow
            const authResult = await this.executeOAuthFlow(params, sessionId);

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
     * Authenticate with passkey (Privy)
     */
    async authenticateWithPasskey(
        params?: PasskeyAuthParams,
    ): Promise<LoginResult> {
        const sessionId = this.generateSessionId('passkey');

        try {
            this.setAuthState(sessionId, {
                sessionId,
                method: 'passkey',
                step: 'initiated',
                data: params,
                timestamp: Date.now(),
            });

            this.emit('auth:started', sessionId, 'passkey');

            if (!this.isMethodAvailable('passkey')) {
                throw new Error('Passkey authentication not configured');
            }

            this.setAuthState(sessionId, {
                sessionId,
                method: 'passkey',
                step: 'pending',
                data: params,
                timestamp: Date.now(),
            });

            this.emit('auth:step', sessionId, 'pending');

            // Execute passkey authentication
            const authResult = await this.executePasskeyAuth(params, sessionId);

            if (authResult.success && authResult.connection) {
                this.setAuthState(sessionId, {
                    sessionId,
                    method: 'passkey',
                    step: 'completed',
                    data: authResult.connection,
                    timestamp: Date.now(),
                });

                this.emit('auth:success', sessionId, authResult.connection);
            }

            return authResult;
        } catch (error) {
            const authError = this.createAuthError(error, 'passkey');
            this.setAuthState(sessionId, {
                sessionId,
                method: 'passkey',
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
     * Authenticate with VeChain ecosystem (Cross-app)
     */
    async authenticateWithVeChain(
        params?: CrossAppAuthParams,
    ): Promise<LoginResult> {
        const sessionId = this.generateSessionId('vechain');

        try {
            this.setAuthState(sessionId, {
                sessionId,
                method: 'vechain',
                step: 'initiated',
                data: params,
                timestamp: Date.now(),
            });

            this.emit('auth:started', sessionId, 'vechain');

            if (!this.isMethodAvailable('vechain')) {
                throw new Error(
                    'VeChain cross-app authentication not configured',
                );
            }

            this.setAuthState(sessionId, {
                sessionId,
                method: 'vechain',
                step: 'pending',
                data: params,
                timestamp: Date.now(),
            });

            this.emit('auth:step', sessionId, 'pending');

            // Execute VeChain cross-app authentication
            const authResult = await this.executeCrossAppAuth(
                params || {},
                sessionId,
            );

            if (authResult.success && authResult.connection) {
                this.setAuthState(sessionId, {
                    sessionId,
                    method: 'vechain',
                    step: 'completed',
                    data: authResult.connection,
                    timestamp: Date.now(),
                });

                this.emit('auth:success', sessionId, authResult.connection);
            }

            return authResult;
        } catch (error) {
            const authError = this.createAuthError(error, 'vechain');
            this.setAuthState(sessionId, {
                sessionId,
                method: 'vechain',
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

            this.setAuthState(sessionId, {
                sessionId,
                method: 'dappkit',
                step: 'pending',
                data: params,
                timestamp: Date.now(),
            });

            this.emit('auth:step', sessionId, 'pending');

            // Execute DappKit wallet connection
            const authResult = await this.executeDappKitAuth(
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
        if (!this.privyClient) {
            throw new Error('Privy client not available');
        }

        try {
            const result = await this.privyClient.auth.oauth.loginWithCode(
                authorizationCode,
                '',
                provider,
            );

            // Create embedded wallet if user doesn't have one
            let walletAddress: string | undefined;
            const walletAccount = result.user.linked_accounts?.find(
                (acc: any) => acc.type === 'wallet',
            );
            if (walletAccount && 'address' in walletAccount) {
                walletAddress = walletAccount.address;
            }

            if (!walletAddress) {
                const walletResult =
                    await this.privyClient.embeddedWallet.create({});
                const newWalletAccount =
                    walletResult.user.linked_accounts?.find(
                        (acc: any) => acc.type === 'wallet',
                    );
                if (newWalletAccount && 'address' in newWalletAccount) {
                    walletAddress = newWalletAccount.address;
                }
            }

            if (!walletAddress) {
                throw new Error('Failed to create or find wallet address');
            }

            const connection: Connection = {
                address: walletAddress,
                chainId: 100009, // VeChain mainnet
                source: 'privy',
                method: 'oauth',
                timestamp: Date.now(),
                metadata: { provider, userId: result.user.id },
            };

            return {
                success: true,
                connection,
            };
        } catch (error) {
            const authError = this.createAuthError(error, 'oauth');
            return {
                success: false,
                error: authError,
            };
        }
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
            case 'passkey':
            case 'oauth':
                return !!(this.config.privy?.appId && this.privyClient);
            case 'vechain':
                return !!(this.config.crossApp?.appId && this.crossAppProvider);
            case 'dappkit':
            case 'walletconnect':
                return !!(this.config.dappKit?.nodeUrl && this.dappKitClient);
            case 'ecosystem':
                return !!(
                    this.config.crossApp?.allowedApps?.length &&
                    this.crossAppProvider
                );
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
    private initializeClients(): void {
        // Initialize Privy client
        if (this.config.privy?.appId) {
            this.initializePrivyClient();
        }

        // Initialize DappKit client
        if (this.config.dappKit?.nodeUrl) {
            this.initializeDappKitClient();
        }

        // Initialize Cross-app client
        if (this.config.crossApp?.appId) {
            this.initializeCrossAppClient();
        }

        this.logger.info('Authentication clients initialized', {
            privyClient: !!this.privyClient,
            dappKit: !!this.dappKitClient,
            crossApp: !!this.crossAppProvider,
        });
    }

    /**
     * Initialize Privy client for browser environment
     */
    private async initializePrivyClient(): Promise<void> {
        try {
            if (!this.config.privy?.appId) {
                throw new Error('Privy app ID is required');
            }

            const { default: Privy } = await import('@privy-io/js-sdk-core');

            this.privyClient = new Privy({
                appId: this.config.privy.appId,
                storage:
                    typeof window !== 'undefined' && window.localStorage
                        ? {
                              get: (key: string) =>
                                  window.localStorage.getItem(key),
                              put: (key: string, value: unknown) =>
                                  window.localStorage.setItem(
                                      key,
                                      JSON.stringify(value),
                                  ),
                              del: (key: string) =>
                                  window.localStorage.removeItem(key),
                              getKeys: () => Object.keys(window.localStorage),
                          }
                        : {
                              get: () => null,
                              put: () => {},
                              del: () => {},
                              getKeys: () => [],
                          },
            });

            this.logger.info('Privy client SDK initialized', {
                appId: this.config.privy.appId,
            });
        } catch (error) {
            this.logger.error(
                'Failed to initialize Privy client',
                error instanceof Error ? error : new Error(String(error)),
            );
        }
    }

    /**
     * Initialize DappKit client
     */
    private initializeDappKitClient(): void {
        try {
            // In real implementation, this would create the actual DappKit client
            // this.dappKitClient = new DappKitClient({
            //   nodeUrl: this.config.dappKit.nodeUrl,
            //   walletConnectProjectId: this.config.dappKit.walletConnectProjectId,
            //   supportedWallets: this.config.dappKit.supportedWallets || ['veworld', 'sync2']
            // });

            this.logger.info('DappKit client initialized', {
                nodeUrl: this.config.dappKit?.nodeUrl,
                supportedWallets: this.config.dappKit?.supportedWallets || [
                    'veworld',
                    'sync2',
                ],
            });

            // Mock successful initialization
            this.dappKitClient = { initialized: true };
        } catch (error) {
            this.logger.error(
                'Failed to initialize DappKit client',
                error instanceof Error ? error : new Error(String(error)),
            );
        }
    }

    /**
     * Initialize Cross-app client
     */
    private initializeCrossAppClient(): void {
        try {
            // In real implementation, this would create the actual Cross-app client
            // this.crossAppClient = new CrossAppClient({
            //   appId: this.config.crossApp.appId,
            //   allowedApps: this.config.crossApp.allowedApps,
            //   environment: this.config.crossApp.environment || 'production'
            // });

            this.logger.info('Cross-app client initialized', {
                appId: this.config.crossApp?.appId,
                allowedApps: this.config.crossApp?.allowedApps?.length || 0,
                environment: this.config.crossApp?.environment || 'production',
            });

            // Mock successful initialization
            // this.crossAppProvider = new CrossAppProvider({});
        } catch (error) {
            this.logger.error(
                'Failed to initialize Cross-app client',
                error instanceof Error ? error : new Error(String(error)),
            );
        }
    }

    /**
     * Send email verification code
     */
    private async sendEmailVerificationCode(
        email: string,
        sessionId: string,
    ): Promise<void> {
        if (!this.privyClient) {
            throw new Error('Privy client not available');
        }

        try {
            await this.privyClient.auth.email.sendCode(email);

            this.logger.info('Email verification code sent', {
                email,
                sessionId,
            });

            // Track analytics if enabled
            if (this.config.analytics?.enabled) {
                this.trackAuthEvent('email_code_sent', { email, sessionId });
            }
        } catch (error) {
            this.logger.error(
                `Failed to send email verification for ${email} (session: ${sessionId})`,
                error instanceof Error ? error : new Error(String(error)),
            );
            throw error;
        }
    }

    /**
     * Verify email code and complete authentication
     */
    private async verifyEmailAndComplete(
        email: string,
        code: string,
        sessionId: string,
    ): Promise<LoginResult> {
        if (!this.privyClient) {
            throw new Error('Privy client not available');
        }

        try {
            this.setAuthState(sessionId, {
                sessionId,
                method: 'email',
                step: 'pending',
                data: { email, code },
                timestamp: Date.now(),
            });

            this.emit('auth:step', sessionId, 'pending');

            const result = await this.privyClient.auth.email.loginWithCode(
                email,
                code,
            );

            // Create embedded wallet if user doesn't have one
            let walletAddress: string | undefined;
            const walletAccount = result.user.linked_accounts?.find(
                (acc: any) => acc.type === 'wallet',
            );
            if (walletAccount && 'address' in walletAccount) {
                walletAddress = walletAccount.address;
            }

            if (!walletAddress) {
                const walletResult =
                    await this.privyClient.embeddedWallet.create({});
                const newWalletAccount =
                    walletResult.user.linked_accounts?.find(
                        (acc: any) => acc.type === 'wallet',
                    );
                if (newWalletAccount && 'address' in newWalletAccount) {
                    walletAddress = newWalletAccount.address;
                }
            }

            if (!walletAddress) {
                throw new Error('Failed to create or find wallet address');
            }

            const connection: Connection = {
                address: walletAddress,
                chainId: 100009, // VeChain mainnet
                source: 'privy',
                method: 'email',
                timestamp: Date.now(),
                metadata: { email, userId: result.user.id },
            };

            this.setAuthState(sessionId, {
                sessionId,
                method: 'email',
                step: 'completed',
                data: connection,
                timestamp: Date.now(),
            });

            this.emit('auth:success', sessionId, connection);

            // Track analytics if enabled
            if (this.config.analytics?.enabled) {
                this.trackAuthEvent('email_verification_success', {
                    email,
                    sessionId,
                });
            }

            return {
                success: true,
                connection,
            };
        } catch (error) {
            this.logger.error(
                `Email verification failed for ${email} (session: ${sessionId})`,
                error instanceof Error ? error : new Error(String(error)),
            );

            // Track analytics if enabled
            if (this.config.analytics?.enabled) {
                this.trackAuthEvent('email_verification_failed', {
                    email,
                    sessionId,
                    error,
                });
            }

            throw error;
        }
    }

    /**
     * Execute OAuth authentication flow
     */
    private async executeOAuthFlow(
        params: OAuthAuthParams,
        sessionId: string,
    ): Promise<LoginResult> {
        if (!this.privyClient) {
            throw new Error('Privy client not available');
        }

        try {
            // OAuth flow - UI layer should handle redirects/popups
            // Generate OAuth URL that UI can use for redirect
            const result = await this.privyClient.auth.oauth.generateURL(
                params.provider,
                params.redirectUrl || 'http://localhost:3000',
            );

            // Return OAuth URL for UI to handle redirect
            return {
                success: false,
                requiresVerification: true,
                verificationData: {
                    authUrl: result.url,
                },
            };
        } catch (error) {
            throw error;
        }
    }

    /**
     * Execute passkey authentication
     */
    private async executePasskeyAuth(
        params: PasskeyAuthParams | undefined,
        sessionId: string,
    ): Promise<LoginResult> {
        if (!this.privyClient) {
            throw new Error('Privy client not available');
        }

        try {
            // Passkey requires WebAuthn which should be handled by UI layer
            // This is a placeholder - UI should handle the WebAuthn ceremony
            throw new Error(
                'Passkey authentication should be handled by UI layer',
            );
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get wallet provider for a specific type
     */
    getWalletProvider(type: WalletProviderType): IWalletProvider | null {
        return WalletProviderFactory.getProvider(type);
    }

    /**
     * Get all available wallet providers
     */
    getAvailableProviders(): IWalletProvider[] {
        return WalletProviderFactory.getAllProviders();
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
    private categorizeError(
        error: any,
        method: LoginMethod,
    ): import('./ConnectionManager.js').ErrorCategory {
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
        // Clean up expired sessions every 5 minutes
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
            // In real implementation, this would send to analytics service
            this.logger.debug('Auth event tracked', { event, data });
        } catch (error) {
            this.logger.warn('Failed to track auth event', {
                event,
                error: error instanceof Error ? error.message : String(error),
            });
        }
    }

    /**
     * Set the cross-app provider (called from React layer for Privy)
     */
    setCrossAppProvider(provider: ICrossAppProvider): void {
        this.crossAppProvider = provider;
        this.logger.info('Cross-app provider configured');
    }

    /**
     * Execute cross-app authentication using the configured provider
     * @private
     */
    private async executeCrossAppAuth(
        params: CrossAppAuthParams,
        sessionId: string,
    ): Promise<LoginResult> {
        if (!this.crossAppProvider) {
            throw new Error(
                'Cross-app provider not configured. Call setCrossAppProvider() first.',
            );
        }

        try {
            this.logger.info('Executing cross-app authentication', {
                sessionId,
                appId: params.appId,
            });

            const result = await this.crossAppProvider.login(
                params.appId || this.config.crossApp?.appId || '',
            );

            if (result.success && result.address) {
                return {
                    success: true,
                    connection: {
                        address: result.address,
                        chainId: 100009, // VeChain testnet
                        source: 'cross-app' as ConnectionSource,
                        method: 'cross-app' as LoginMethod,
                        timestamp: Date.now(),
                        metadata: {
                            sessionId: sessionId,
                            appId: result.appId,
                            crossAppProvider:
                                this.crossAppProvider?.constructor.name,
                        },
                    },
                    user: {
                        id: result.address,
                        wallet: {
                            address: result.address,
                            walletClientType: 'crossApp',
                        },
                    },
                };
            } else {
                return {
                    success: false,
                    error: this.createAuthError(
                        {
                            code: 'CROSS_APP_AUTH_FAILED',
                            message:
                                result.error ||
                                'Cross-app authentication failed',
                            retryable: true,
                        },
                        'cross-app' as LoginMethod,
                    ),
                };
            }
        } catch (error) {
            this.logger.error(
                'Cross-app authentication failed',
                error instanceof Error ? error : new Error(String(error)),
            );
            return {
                success: false,
                error: this.createAuthError(
                    {
                        code: 'CROSS_APP_AUTH_ERROR',
                        message:
                            error instanceof Error
                                ? error.message
                                : String(error),
                        retryable: true,
                    },
                    'cross-app' as LoginMethod,
                ),
            };
        }
    }

    /**
     * Execute DappKit authentication
     * @private
     */
    private async executeDappKitAuth(
        params: DappKitAuthParams,
        sessionId: string,
    ): Promise<LoginResult> {
        // Placeholder implementation - would integrate with DappKit
        this.logger.info('Executing DappKit authentication', { sessionId });
        throw new Error('DappKit authentication not yet implemented');
    }
}
