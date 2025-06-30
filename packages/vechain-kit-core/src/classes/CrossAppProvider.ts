import { ILogger } from '../interfaces/index.js';
import { createLogger } from '../utils/logger.js';

/**
 * Generic cross-app authentication result
 */
export interface CrossAppAuthResult {
    success: boolean;
    address?: string;
    appId?: string;
    error?: string;
}

/**
 * Generic cross-app provider interface
 * Implementations can plug in Privy, WalletConnect, or other cross-app protocols
 */
export interface ICrossAppProvider {
    /**
     * Authenticate with a specific app
     */
    login(
        appId: string,
        options?: { timeout?: number },
    ): Promise<CrossAppAuthResult>;

    /**
     * Disconnect from all apps
     */
    logout(): Promise<void>;

    /**
     * Sign a message using the connected app
     */
    signMessage(message: string): Promise<string>;

    /**
     * Sign typed data using the connected app
     */
    signTypedData(data: any): Promise<string>;

    /**
     * Check if currently connected to any app
     */
    isConnected(): boolean;

    /**
     * Get the currently connected app ID
     */
    getConnectedAppId(): string | null;

    /**
     * Get available app connectors
     */
    getAvailableApps(): string[];
}

/**
 * Cross-app provider configuration
 */
export interface CrossAppProviderConfig {
    /**
     * List of supported app IDs
     */
    supportedApps: string[];

    /**
     * Default timeout for authentication requests
     */
    defaultTimeout?: number;

    /**
     * Logger instance
     */
    logger?: ILogger;
}

/**
 * Base cross-app provider with common functionality
 * Specific implementations (Privy, WalletConnect) extend this
 */
export abstract class BaseCrossAppProvider implements ICrossAppProvider {
    protected logger: ILogger;
    protected config: CrossAppProviderConfig;
    protected connectedAppId: string | null = null;

    constructor(config: CrossAppProviderConfig) {
        this.config = config;
        this.logger = config.logger || createLogger('CrossAppProvider');
    }

    abstract login(
        appId: string,
        options?: { timeout?: number },
    ): Promise<CrossAppAuthResult>;
    abstract logout(): Promise<void>;
    abstract signMessage(message: string): Promise<string>;
    abstract signTypedData(data: any): Promise<string>;

    isConnected(): boolean {
        return this.connectedAppId !== null;
    }

    getConnectedAppId(): string | null {
        return this.connectedAppId;
    }

    getAvailableApps(): string[] {
        return [...this.config.supportedApps];
    }

    /**
     * Validate app ID is supported
     */
    protected validateAppId(appId: string): void {
        if (!this.config.supportedApps.includes(appId)) {
            throw new Error(
                `Unsupported app ID: ${appId}. Supported apps: ${this.config.supportedApps.join(
                    ', ',
                )}`,
            );
        }
    }

    /**
     * Set connected app ID
     */
    protected setConnectedApp(appId: string | null): void {
        this.connectedAppId = appId;
        this.logger.debug('Connected app changed', { appId });
    }
}

/**
 * Privy cross-app provider implementation (non-React)
 * This is a bridge to the React-based Privy implementation
 */
export class PrivyCrossAppProvider extends BaseCrossAppProvider {
    private privyBridge: any; // Bridge to React Privy implementation

    constructor(config: CrossAppProviderConfig & { privyBridge?: any }) {
        super(config);
        this.privyBridge = config.privyBridge;
    }

    async login(
        appId: string,
        options?: { timeout?: number },
    ): Promise<CrossAppAuthResult> {
        this.validateAppId(appId);

        try {
            this.logger.info('Initiating Privy cross-app login', { appId });

            if (!this.privyBridge) {
                throw new Error(
                    'Privy bridge not configured. Please set up PrivyCrossAppProvider in your React app.',
                );
            }

            // Call the bridge to the React Privy implementation
            const result = await this.privyBridge.login(appId, options);

            if (result.success && result.address) {
                this.setConnectedApp(appId);
                this.logger.info('Privy cross-app login successful', {
                    appId,
                    address: result.address,
                });
            }

            return result;
        } catch (error) {
            this.logger.error(
                'Privy cross-app login failed',
                error instanceof Error ? error : new Error(String(error)),
            );
            return {
                success: false,
                error: error instanceof Error ? error.message : String(error),
            };
        }
    }

    async logout(): Promise<void> {
        try {
            if (this.privyBridge) {
                await this.privyBridge.logout();
            }
            this.setConnectedApp(null);
            this.logger.info('Privy cross-app logout successful');
        } catch (error) {
            this.logger.error(
                'Privy cross-app logout failed',
                error instanceof Error ? error : new Error(String(error)),
            );
            throw error;
        }
    }

    async signMessage(message: string): Promise<string> {
        if (!this.isConnected()) {
            throw new Error('No app connected for signing');
        }

        if (!this.privyBridge) {
            throw new Error('Privy bridge not configured');
        }

        try {
            const signature = await this.privyBridge.signMessage(message);
            this.logger.debug('Message signed successfully');
            return signature;
        } catch (error) {
            this.logger.error(
                'Message signing failed',
                error instanceof Error ? error : new Error(String(error)),
            );
            throw error;
        }
    }

    async signTypedData(data: any): Promise<string> {
        if (!this.isConnected()) {
            throw new Error('No app connected for signing');
        }

        if (!this.privyBridge) {
            throw new Error('Privy bridge not configured');
        }

        try {
            const signature = await this.privyBridge.signTypedData(data);
            this.logger.debug('Typed data signed successfully');
            return signature;
        } catch (error) {
            this.logger.error(
                'Typed data signing failed',
                error instanceof Error ? error : new Error(String(error)),
            );
            throw error;
        }
    }

    /**
     * Set the bridge to the React Privy implementation
     * This is called from the React side to connect the two layers
     */
    setBridge(bridge: any): void {
        this.privyBridge = bridge;
        this.logger.info('Privy bridge connected');
    }
}

/**
 * Factory for creating cross-app providers
 */
export class CrossAppProviderFactory {
    /**
     * Create a Privy cross-app provider
     */
    static createPrivyProvider(
        config: CrossAppProviderConfig & { privyBridge?: any },
    ): PrivyCrossAppProvider {
        return new PrivyCrossAppProvider(config);
    }

    /**
     * Create a mock provider for testing
     */
    static createMockProvider(
        config: CrossAppProviderConfig,
    ): ICrossAppProvider {
        return new MockCrossAppProvider(config);
    }
}

/**
 * Mock cross-app provider for testing and development
 */
class MockCrossAppProvider extends BaseCrossAppProvider {
    async login(appId: string): Promise<CrossAppAuthResult> {
        this.validateAppId(appId);
        this.setConnectedApp(appId);

        return {
            success: true,
            address: '0x1234567890123456789012345678901234567890',
            appId,
        };
    }

    async logout(): Promise<void> {
        this.setConnectedApp(null);
    }

    async signMessage(message: string): Promise<string> {
        if (!this.isConnected()) {
            throw new Error('No app connected');
        }
        return '0xmocksignature' + message.length;
    }

    async signTypedData(data: any): Promise<string> {
        if (!this.isConnected()) {
            throw new Error('No app connected');
        }
        return '0xmocktypedsignature' + JSON.stringify(data).length;
    }
}
