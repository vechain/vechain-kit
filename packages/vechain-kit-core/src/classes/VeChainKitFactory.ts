import { ThorClient } from '@vechain/sdk-network';
import { ILogger } from '../interfaces/index.js';
import { createLogger } from '../utils/logger.js';
import {
    TransactionManager,
    TransactionManagerConfig,
    ISigningProvider,
} from './TransactionManager.js';
import { TokenTransferManager } from './TokenTransferManager.js';
import {
    AuthenticationManager,
    AuthProviderConfig,
} from './AuthenticationManager.js';
import { ServerAuthManager, ServerAuthConfig } from './ServerAuthManager.js';
import { ConnectionManager, ConnectionConfig } from './ConnectionManager.js';

/**
 * Configuration for VeChain Kit initialization
 */
export interface VeChainKitConfig {
    // Network configuration
    thorClient?: ThorClient;
    nodeUrl?: string;
    network?: 'main' | 'test' | 'solo';

    // Authentication configuration
    authentication?: AuthProviderConfig;
    serverAuth?: ServerAuthConfig;
    connection?: ConnectionConfig;

    // Transaction configuration
    transaction?: Omit<
        TransactionManagerConfig,
        'thorClient' | 'signingProvider'
    >;
    signingProvider?: ISigningProvider;

    // Global configuration
    logger?: ILogger;
    enableAnalytics?: boolean;
}

/**
 * Factory for creating and configuring VeChain Kit managers
 * Ensures proper dependency injection and reduces setup complexity
 */
export class VeChainKitFactory {
    private logger: ILogger;
    private thorClient?: ThorClient;

    constructor(private config: VeChainKitConfig) {
        this.logger = config.logger || createLogger('VeChainKitFactory');
        this.thorClient = config.thorClient;

        this.logger.info('VeChain Kit Factory initialized', {
            network: config.network,
            hasThorClient: !!config.thorClient,
            hasSigningProvider: !!config.signingProvider,
            analyticsEnabled: config.enableAnalytics,
        });
    }

    /**
     * Create a fully configured TransactionManager
     */
    createTransactionManager(): TransactionManager {
        const config: TransactionManagerConfig = {
            ...this.config.transaction,
            thorClient: this.thorClient,
            signingProvider: this.config.signingProvider,
        };

        return new TransactionManager(config);
    }

    /**
     * Create a TokenTransferManager with TransactionManager dependency
     */
    createTokenTransferManager(): TokenTransferManager {
        const transactionManager = this.createTransactionManager();
        return new TokenTransferManager(transactionManager);
    }

    /**
     * Create an AuthenticationManager for browser environments
     */
    createAuthenticationManager(): AuthenticationManager {
        if (!this.config.authentication) {
            throw new Error(
                'Authentication configuration required for AuthenticationManager',
            );
        }

        return new AuthenticationManager(this.config.authentication);
    }

    /**
     * Create a ServerAuthManager for server environments
     */
    createServerAuthManager(): ServerAuthManager {
        if (!this.config.serverAuth) {
            throw new Error(
                'Server auth configuration required for ServerAuthManager',
            );
        }

        return new ServerAuthManager(this.config.serverAuth);
    }

    /**
     * Create a ConnectionManager
     */
    createConnectionManager(): ConnectionManager {
        if (!this.config.connection) {
            throw new Error(
                'Connection configuration required for ConnectionManager',
            );
        }

        return new ConnectionManager(this.config.connection);
    }

    /**
     * Create a complete kit with all managers
     */
    createKit() {
        return {
            transactionManager: this.createTransactionManager(),
            tokenTransferManager: this.createTokenTransferManager(),
            authenticationManager: this.config.authentication
                ? this.createAuthenticationManager()
                : null,
            serverAuthManager: this.config.serverAuth
                ? this.createServerAuthManager()
                : null,
            connectionManager: this.config.connection
                ? this.createConnectionManager()
                : null,
            thorClient: this.thorClient,
        };
    }

    /**
     * Update Thor client for all future manager instances
     */
    updateThorClient(thorClient: ThorClient): void {
        this.thorClient = thorClient;
        this.logger.info('Thor client updated');
    }

    /**
     * Create factory with sensible defaults for different environments
     */
    static forMainnet(
        overrides?: Partial<VeChainKitConfig>,
    ): VeChainKitFactory {
        return new VeChainKitFactory({
            network: 'main',
            nodeUrl: 'https://mainnet.vechain.org',
            transaction: {
                defaultGasLimit: 200000,
                gasEstimationBuffer: 1.2,
                monitoringInterval: 5000,
            },
            ...overrides,
        });
    }

    static forTestnet(
        overrides?: Partial<VeChainKitConfig>,
    ): VeChainKitFactory {
        return new VeChainKitFactory({
            network: 'test',
            nodeUrl: 'https://testnet.vechain.org',
            transaction: {
                defaultGasLimit: 200000,
                gasEstimationBuffer: 1.2,
                monitoringInterval: 5000,
            },
            ...overrides,
        });
    }

    static forSolo(
        nodeUrl: string,
        overrides?: Partial<VeChainKitConfig>,
    ): VeChainKitFactory {
        return new VeChainKitFactory({
            network: 'solo',
            nodeUrl,
            transaction: {
                defaultGasLimit: 200000,
                gasEstimationBuffer: 1.1,
                monitoringInterval: 2000,
            },
            ...overrides,
        });
    }
}

/**
 * Convenience function for quick setup
 */
export function createVeChainKit(config: VeChainKitConfig) {
    const factory = new VeChainKitFactory(config);
    return factory.createKit();
}
