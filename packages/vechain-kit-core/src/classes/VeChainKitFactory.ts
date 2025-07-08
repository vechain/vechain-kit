import { ThorClient } from '@vechain/sdk-network';
import { ILogger } from '../interfaces/index.js';
import { createLogger } from '../utils/logger.js';
import { VeChainKit, VeChainKitConfig } from './VeChainKit.js';
import { AuthenticationManager } from './authentication/AuthenticationManager.js';
import { ConnectionManager } from './connection/ConnectionManager.js';
import type { ConnectionConfig } from './connection/types.js';
import type { AuthProviderConfig } from './authentication/config.js';

/**
 * Configuration for VeChain Kit Factory initialization
 */
export interface VeChainKitFactoryConfig {
    // Network configuration
    thorClient?: ThorClient;
    nodeUrl?: string;
    network?: 'main' | 'test' | 'solo';

    // Authentication configuration
    authentication?: AuthProviderConfig;
    connection?: ConnectionConfig;

    // Global configuration
    logger?: ILogger;
    analytics?: {
        enabled?: boolean;
    };
}

/**
 * Factory for creating VeChainKit instances with dependency injection
 */
export class VeChainKitFactory {
    public readonly config: VeChainKitFactoryConfig;
    private logger: ILogger;

    constructor(config: VeChainKitFactoryConfig) {
        this.config = config;
        this.logger = config.logger || createLogger('VeChainKitFactory');
    }

    /**
     * Create a VeChainKit instance
     */
    createKit(): VeChainKit {
        const kitConfig: VeChainKitConfig = {
            network: this.config.network,
            nodeUrl: this.config.nodeUrl,
            thorClient: this.config.thorClient,
            logger: this.logger
        };

        return new VeChainKit(kitConfig);
    }

    /**
     * Create an authentication manager
     */
    createAuthenticationManager(): AuthenticationManager {
        if (!this.config.authentication) {
            throw new Error('Authentication configuration is required');
        }
        return new AuthenticationManager(this.config.authentication);
    }

    /**
     * Create a connection manager
     */
    createConnectionManager(): ConnectionManager {
        const connectionConfig: ConnectionConfig = {
            enabledMethods: ['email', 'google', 'oauth', 'dappkit'],
            ...this.config.connection,
        };
        return new ConnectionManager(connectionConfig);
    }

    /**
     * Create factory for mainnet
     */
    static forMainnet(config: Omit<VeChainKitFactoryConfig, 'network'> = {}): VeChainKitFactory {
        return new VeChainKitFactory({
            ...config,
            network: 'main'
        });
    }

    /**
     * Create factory for testnet
     */
    static forTestnet(config: Omit<VeChainKitFactoryConfig, 'network'> = {}): VeChainKitFactory {
        return new VeChainKitFactory({
            ...config,
            network: 'test'
        });
    }

    /**
     * Create factory for solo network
     */
    static forSolo(config: Omit<VeChainKitFactoryConfig, 'network'> = {}): VeChainKitFactory {
        return new VeChainKitFactory({
            ...config,
            network: 'solo'
        });
    }

    /**
     * Create factory with custom configuration
     */
    static create(config: VeChainKitFactoryConfig): VeChainKitFactory {
        return new VeChainKitFactory(config);
    }
}

/**
 * Create a VeChainKit instance with simplified configuration
 */
export function createVeChainKit(config?: VeChainKitConfig): VeChainKit {
    return new VeChainKit(config);
}