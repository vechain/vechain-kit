import { ThorClient } from '@vechain/sdk-network';
import { ILogger } from '../interfaces/index.js';
import { createLogger } from '../utils/logger.js';
import {
    TransactionManager,
    TransactionManagerConfig,
    ISigningProvider,
} from './TransactionManager.js';
import {
    TransactionWrapper,
    MethodTransactionParams,
    MethodTransactionResult,
} from './TransactionWrapper.js';
import { TokenManager } from './TokenManager.js';
import { TokenWrapper, EnhancedTokenBalance } from './TokenWrapper.js';

/**
 * Main VeChainKit configuration
 */
export interface VeChainKitConfig {
    network?: 'main' | 'test' | 'solo';
    nodeUrl?: string;
    thorClient?: ThorClient;
    signingProvider?: ISigningProvider;
    logger?: ILogger;
}

/**
 * Main VeChainKit class that provides the clean, developer-friendly API
 *
 * Usage:
 * ```typescript
 * const kit = new VeChainKit({ network: 'main' });
 *
 * // Clean token API
 * const balance = await kit.tokens.getBalance('VTHO', userAddress);
 *
 * // Clean transaction API
 * const tx = await kit.transactions.send({
 *   to: tokenAddress,
 *   method: 'transfer',
 *   args: [recipient, amount],
 *   signerAddress: userAddress
 * });
 *
 * await tx.wait({
 *   onSent: (id) => console.log('Sent:', id),
 *   onConfirmed: (receipt) => console.log('Confirmed:', receipt)
 * });
 * ```
 */
export class VeChainKit {
    public readonly thor: ThorClient;
    public readonly tokens: VeChainKitTokens;
    public readonly transactions: VeChainKitTransactions;

    private logger: ILogger;
    private transactionManager: TransactionManager;
    private transactionWrapper: TransactionWrapper;
    private tokenManager: TokenManager;
    private tokenWrapper: TokenWrapper;

    constructor(config: VeChainKitConfig = {}) {
        this.logger = config.logger || createLogger('VeChainKit');

        // Initialize Thor client
        this.thor = config.thorClient || ThorClient.at(this.getNodeUrl(config));

        // Initialize core managers
        this.transactionManager = new TransactionManager({
            thorClient: this.thor,
            signingProvider: config.signingProvider,
            defaultGasLimit: 200000,
            gasEstimationBuffer: 1.2,
            monitoringInterval: 5000,
        });

        this.tokenManager = new TokenManager(this.logger);

        // Initialize wrappers for clean API
        this.transactionWrapper = new TransactionWrapper(
            this.transactionManager,
            this.thor,
        );
        this.tokenWrapper = new TokenWrapper(
            this.tokenManager,
            this.thor,
            config.network,
        );

        // Create public API interfaces
        this.tokens = new VeChainKitTokens(this.tokenWrapper);
        this.transactions = new VeChainKitTransactions(this.transactionWrapper);

        this.logger.info('VeChainKit initialized', {
            network: config.network || 'main',
            nodeUrl: this.thor.httpClient.baseURL,
            hasSigningProvider: !!config.signingProvider,
        });
    }

    /**
     * Get the appropriate node URL for the network
     */
    private getNodeUrl(config: VeChainKitConfig): string {
        if (config.nodeUrl) {
            return config.nodeUrl;
        }

        switch (config.network) {
            case 'test':
                return 'https://testnet.vechain.org';
            case 'solo':
                return 'http://localhost:8669';
            case 'main':
            default:
                return 'https://mainnet.vechain.org';
        }
    }
}

/**
 * Clean tokens API - provides simplified token operations
 */
class VeChainKitTokens {
    constructor(private tokenWrapper: TokenWrapper) {}

    /**
     * Get token balance with automatic symbol resolution
     *
     * @param tokenIdentifier Token address or symbol (e.g., 'VET', 'VTHO', '0x...')
     * @param accountAddress Account address to check balance for
     * @returns Enhanced token balance with symbol and formatting
     */
    async getBalance(
        tokenIdentifier: string,
        accountAddress: string,
    ): Promise<EnhancedTokenBalance> {
        return this.tokenWrapper.getBalance(tokenIdentifier, accountAddress);
    }

    /**
     * Get multiple token balances efficiently
     */
    async getBalances(
        tokenIdentifiers: string[],
        accountAddress: string,
    ): Promise<EnhancedTokenBalance[]> {
        return this.tokenWrapper.getBalances(tokenIdentifiers, accountAddress);
    }

    /**
     * Get balances for all common tokens on the current network
     */
    async getCommonBalances(
        accountAddress: string,
    ): Promise<EnhancedTokenBalance[]> {
        return this.tokenWrapper.getCommonTokenBalances(accountAddress);
    }

    /**
     * Get token metadata information
     */
    async getInfo(tokenIdentifier: string) {
        return this.tokenWrapper.getTokenInfo(tokenIdentifier);
    }

    /**
     * Add a custom token configuration
     */
    addToken(
        symbol: string,
        config: { address: string; name: string; decimals: number },
    ) {
        this.tokenWrapper.addToken(symbol, { ...config, symbol });
    }
}

/**
 * Clean transactions API - provides simplified transaction operations
 */
class VeChainKitTransactions {
    constructor(private transactionWrapper: TransactionWrapper) {}

    /**
     * Send a transaction using method name and arguments
     *
     * @param params Method transaction parameters
     * @returns Tracked transaction with lifecycle management
     */
    async send(
        params: Omit<MethodTransactionParams, 'abi'>,
    ): Promise<MethodTransactionResult> {
        return this.transactionWrapper.send(params);
    }

    /**
     * Transfer tokens with simplified API
     */
    async transferToken(
        tokenAddress: string,
        recipient: string,
        amount: string,
        signerAddress: string,
        options?: { maxGas?: number; delegated?: boolean },
    ): Promise<MethodTransactionResult> {
        return this.transactionWrapper.transferToken(
            tokenAddress,
            recipient,
            amount,
            signerAddress,
            options,
        );
    }

    /**
     * Approve token spending with simplified API
     */
    async approveToken(
        tokenAddress: string,
        spender: string,
        amount: string,
        signerAddress: string,
        options?: { maxGas?: number; delegated?: boolean },
    ): Promise<MethodTransactionResult> {
        return this.transactionWrapper.approveToken(
            tokenAddress,
            spender,
            amount,
            signerAddress,
            options,
        );
    }

    /**
     * Get transaction by ID
     */
    getTransaction(id: string) {
        return this.transactionWrapper.getTransaction(id);
    }

    /**
     * Get all pending transactions
     */
    getPendingTransactions() {
        return this.transactionWrapper.getPendingTransactions();
    }

    /**
     * Cancel a pending transaction
     */
    async cancelTransaction(id: string): Promise<boolean> {
        return this.transactionWrapper.cancelTransaction(id);
    }

    /**
     * Get transaction statistics
     */
    getStats() {
        return this.transactionWrapper.getStats();
    }

    /**
     * Clear completed transactions from memory
     */
    clearCompleted(): number {
        return this.transactionWrapper.clearCompletedTransactions();
    }
}

/**
 * Convenience function for quick VeChainKit setup
 */
export function createVeChainKit(config: VeChainKitConfig = {}): VeChainKit {
    return new VeChainKit(config);
}

/**
 * Factory methods for common configurations
 */
export class VeChainKitFactory {
    static forMainnet(overrides: Partial<VeChainKitConfig> = {}): VeChainKit {
        return new VeChainKit({
            network: 'main',
            ...overrides,
        });
    }

    static forTestnet(overrides: Partial<VeChainKitConfig> = {}): VeChainKit {
        return new VeChainKit({
            network: 'test',
            ...overrides,
        });
    }

    static forSolo(
        nodeUrl: string,
        overrides: Partial<VeChainKitConfig> = {},
    ): VeChainKit {
        return new VeChainKit({
            network: 'solo',
            nodeUrl,
            ...overrides,
        });
    }
}
