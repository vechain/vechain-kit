import { ThorClient } from '@vechain/sdk-network';
import { ILogger } from '../interfaces/index.js';
import { createLogger } from '../utils/logger.js';
import { Address, Units, FixedPointNumber } from '@vechain/sdk-core';

/**
 * Main VeChainKit configuration
 */
export interface VeChainKitConfig {
    network?: 'main' | 'test' | 'solo';
    nodeUrl?: string;
    thorClient?: ThorClient;
    logger?: ILogger;
}

/**
 * Simplified VeChainKit class for basic blockchain operations
 */
export class VeChainKit {
    public readonly thor: ThorClient;
    private logger: ILogger;
    private config: VeChainKitConfig;
    private eventListeners: Map<string, Function[]> = new Map();

    // Utility modules
    public readonly utils = {
        isValidAddress: (address: string): boolean => {
            try {
                Address.of(address);
                return true;
            } catch {
                return false;
            }
        },
        fromWei: (wei: string): string => {
            return Units.formatEther(FixedPointNumber.of(wei)).toString();
        },
        toWei: (vet: string): string => {
            return Units.parseEther(vet).toString();
        }
    };

    public readonly tokens = {
        getBalance: async (token: string, address: string): Promise<string> => {
            const addr = Address.of(address);
            if (token === 'VET') {
                const account = await this.thor.accounts.getAccount(addr);
                return account.balance;
            }
            if (token === 'VTHO') {
                const account = await this.thor.accounts.getAccount(addr);
                return account.energy;
            }
            throw new Error(`Token ${token} not supported`);
        }
    };

    public readonly transactions = {
        buildTransaction: async (params: any) => {
            return {
                to: params.to,
                value: params.value,
                data: params.data,
                gas: 21000,
                chainTag: params.chainTag
            };
        }
    };

    constructor(config: VeChainKitConfig = {}) {
        this.config = config;
        this.logger = config.logger || createLogger('VeChainKit');

        // Initialize Thor client
        this.thor = config.thorClient || ThorClient.at(this.getNodeUrl(config));

        this.logger.info('VeChainKit initialized', {
            network: config.network || 'main',
            nodeUrl: this.thor.httpClient.baseURL,
        });
    }

    /**
     * Get the network name
     */
    get network(): string {
        return this.config.network || 'test';
    }

    /**
     * Get the node URL
     */
    get nodeUrl(): string {
        return this.thor.httpClient.baseURL;
    }

    /**
     * Get the chain ID
     */
    getChainId(): number {
        switch (this.network) {
            case 'main':
                return 100009; // Mainnet
            case 'test':
                return 100010; // Testnet
            case 'solo':
                return 100011; // Solo
            default:
                return 100010; // Default to testnet
        }
    }

    /**
     * Get the network type
     */
    getNetworkType(): string {
        return this.network;
    }

    /**
     * Add event listener
     */
    on(event: string, listener: Function): void {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event)!.push(listener);
    }

    /**
     * Remove event listener
     */
    off(event: string, listener: Function): void {
        const listeners = this.eventListeners.get(event);
        if (listeners) {
            const index = listeners.indexOf(listener);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        }
    }

    /**
     * Emit event
     */
    emit(event: string, ...args: any[]): void {
        const listeners = this.eventListeners.get(event);
        if (listeners) {
            listeners.forEach(listener => listener(...args));
        }
    }

    /**
     * Get the appropriate node URL for the network
     */
    private getNodeUrl(config: VeChainKitConfig): string {
        if (config.nodeUrl) {
            return config.nodeUrl;
        }

        switch (config.network) {
            case 'main':
                return 'https://mainnet.vechain.org';
            case 'test':
                return 'https://testnet.vechain.org';
            case 'solo':
                return 'http://localhost:8669';
            default:
                return 'https://testnet.vechain.org';
        }
    }
}

/**
 * Create a VeChainKit instance with simplified configuration
 */
export function createVeChainKit(config?: VeChainKitConfig): VeChainKit {
    return new VeChainKit(config);
}