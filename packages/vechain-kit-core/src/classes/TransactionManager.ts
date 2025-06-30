import { EventEmitter } from 'events';
import { ILogger, ITransactionManager } from '../interfaces/index.js';
import { createLogger } from '../utils/logger.js';
import { TransactionClause } from '@vechain/sdk-core';
import { ThorClient } from '@vechain/sdk-network';

/**
 * Transaction states for tracking transaction lifecycle
 */
export type TransactionState =
    | 'idle'
    | 'building'
    | 'estimating'
    | 'signing'
    | 'broadcasting'
    | 'pending'
    | 'confirmed'
    | 'failed'
    | 'cancelled';

/**
 * Transaction error categories
 */
export type TransactionErrorCategory =
    | 'gas_estimation_failed'
    | 'insufficient_funds'
    | 'user_rejected'
    | 'network_error'
    | 'contract_error'
    | 'unknown';

/**
 * Transaction error details
 */
export interface TransactionErrorDetails {
    code: string;
    message: string;
    category: TransactionErrorCategory;
    retryable: boolean;
    userFriendlyMessage: string;
    originalError?: any;
}

/**
 * Transaction parameters for sending transactions
 */
export interface TransactionParams {
    clauses:
        | TransactionClause[]
        | (() => TransactionClause[])
        | (() => Promise<TransactionClause[]>);
    signerAddress: string;
    maxGas?: number;
    delegated?: boolean;
    privyOptions?: {
        title?: string;
        description?: string;
        buttonText?: string;
    };
}

/**
 * Transaction result from broadcasting
 */
export interface TransactionResult {
    id: string;
    clauses: TransactionClause[];
    timestamp: number;
    status: TransactionState;
}

/**
 * Tracked transaction with lifecycle management
 */
export class TrackedTransaction extends EventEmitter {
    public readonly id: string;
    public readonly clauses: TransactionClause[];
    public readonly timestamp: number;
    private _status: TransactionState = 'pending';
    private _error: TransactionErrorDetails | null = null;
    private _receipt: any = null;
    private logger: ILogger;

    constructor(result: TransactionResult) {
        super();
        this.id = result.id;
        this.clauses = result.clauses;
        this.timestamp = result.timestamp;
        this._status = result.status;
        this.logger = createLogger(`TrackedTransaction:${this.id.slice(0, 8)}`);
    }

    get status(): TransactionState {
        return this._status;
    }

    get error(): TransactionErrorDetails | null {
        return this._error;
    }

    get receipt(): any {
        return this._receipt;
    }

    get isPending(): boolean {
        return [
            'building',
            'estimating',
            'signing',
            'broadcasting',
            'pending',
        ].includes(this._status);
    }

    get isComplete(): boolean {
        return ['confirmed', 'failed', 'cancelled'].includes(this._status);
    }

    updateStatus(
        status: TransactionState,
        error?: TransactionErrorDetails,
        receipt?: any,
    ): void {
        const previousStatus = this._status;
        this._status = status;

        if (error) {
            this._error = error;
        }

        if (receipt) {
            this._receipt = receipt;
        }

        this.logger.debug('Status updated', {
            from: previousStatus,
            to: status,
            hasError: !!error,
            hasReceipt: !!receipt,
        });

        this.emit('statusChange', {
            status,
            previousStatus,
            error,
            receipt,
            transaction: this,
        });

        if (status === 'confirmed') {
            this.emit('confirmed', { receipt, transaction: this });
        } else if (status === 'failed') {
            this.emit('failed', { error, transaction: this });
        } else if (status === 'cancelled') {
            this.emit('cancelled', { transaction: this });
        }
    }

    /**
     * Wait for transaction to complete with optional callbacks
     */
    async wait(options?: {
        onSent?: (id: string) => void;
        onConfirmed?: (receipt: any) => void;
        onFailed?: (error: TransactionErrorDetails) => void;
        onCancelled?: () => void;
        timeout?: number;
    }): Promise<any> {
        return new Promise((resolve, reject) => {
            const timeout = options?.timeout || 300000; // 5 minutes default
            let timeoutId: NodeJS.Timeout;

            const cleanup = () => {
                if (timeoutId) clearTimeout(timeoutId);
                this.removeAllListeners('confirmed');
                this.removeAllListeners('failed');
                this.removeAllListeners('cancelled');
            };

            // Set timeout
            if (timeout > 0) {
                timeoutId = setTimeout(() => {
                    cleanup();
                    reject(new Error('Transaction wait timeout'));
                }, timeout);
            }

            // Handle completion events
            this.once('confirmed', ({ receipt }) => {
                cleanup();
                options?.onConfirmed?.(receipt);
                resolve(receipt);
            });

            this.once('failed', ({ error }) => {
                cleanup();
                options?.onFailed?.(error);
                reject(error);
            });

            this.once('cancelled', () => {
                cleanup();
                options?.onCancelled?.();
                reject(new Error('Transaction cancelled'));
            });

            // If already complete, handle immediately
            if (this._status === 'confirmed') {
                cleanup();
                options?.onConfirmed?.(this._receipt);
                resolve(this._receipt);
            } else if (this._status === 'failed') {
                cleanup();
                options?.onFailed?.(this._error!);
                reject(this._error);
            } else if (this._status === 'cancelled') {
                cleanup();
                options?.onCancelled?.();
                reject(new Error('Transaction cancelled'));
            }

            // Trigger onSent if transaction is already sent
            if (['pending', 'confirmed', 'failed'].includes(this._status)) {
                options?.onSent?.(this.id);
            }
        });
    }
}

/**
 * Configuration for TransactionManager
 */
export interface TransactionManagerConfig {
    defaultGasLimit?: number;
    gasEstimationBuffer?: number; // Percentage buffer for gas estimation (e.g., 1.2 for 20% buffer)
    retryAttempts?: number;
    retryDelay?: number;
    monitoringInterval?: number;
    enableFeeDelegation?: boolean;
    delegatorUrl?: string;
    thorClient?: ThorClient;
    signingProvider?: ISigningProvider;
}

/**
 * Signing provider interface for different wallet types
 */
export interface ISigningProvider {
    signTransaction(
        clauses: TransactionClause[],
        options: SigningOptions,
    ): Promise<string>;
    getAddress(): Promise<string>;
    isAvailable(): Promise<boolean>;
}

/**
 * Signing options
 */
export interface SigningOptions {
    gas?: number;
    dependsOn?: string;
    expiration?: number;
    comment?: string;
    delegated?: boolean;
    privyOptions?: {
        title?: string;
        description?: string;
        buttonText?: string;
    };
}

/**
 * Core transaction manager for VeChain Kit
 * Handles transaction lifecycle without framework dependencies
 */
export class TransactionManager
    extends EventEmitter
    implements ITransactionManager
{
    private pendingTransactions: Map<string, TrackedTransaction> = new Map();
    private logger: ILogger;
    private config: TransactionManagerConfig;
    private monitoringInterval: NodeJS.Timeout | null = null;

    constructor(config: TransactionManagerConfig = {}) {
        super();
        this.logger = createLogger('TransactionManager');
        this.config = {
            defaultGasLimit: 200000,
            gasEstimationBuffer: 1.2,
            retryAttempts: 3,
            retryDelay: 2000,
            monitoringInterval: 5000,
            enableFeeDelegation: false,
            ...config,
        };

        this.startMonitoring();
    }

    /**
     * Send a transaction with full lifecycle management
     */
    async send(params: TransactionParams): Promise<TrackedTransaction> {
        this.logger.info('Initiating transaction', {
            signerAddress: params.signerAddress,
            clauseCount: Array.isArray(params.clauses)
                ? params.clauses.length
                : 'dynamic',
            maxGas: params.maxGas,
            delegated: params.delegated,
        });

        try {
            // Resolve clauses if function
            const clauses =
                typeof params.clauses === 'function'
                    ? await params.clauses()
                    : params.clauses;

            if (!clauses.length) {
                throw new Error('No clauses provided for transaction');
            }

            // Create initial tracked transaction
            const result: TransactionResult = {
                id: this.generateTransactionId(),
                clauses,
                timestamp: Date.now(),
                status: 'building',
            };

            const trackedTx = new TrackedTransaction(result);
            this.pendingTransactions.set(trackedTx.id, trackedTx);

            // Emit transaction started event
            this.emit('transactionStarted', trackedTx);

            // Execute transaction flow
            await this.executeTransactionFlow(trackedTx, params);

            return trackedTx;
        } catch (error) {
            this.logger.error(
                'Transaction initiation failed',
                error instanceof Error ? error : new Error(String(error)),
            );
            throw this.createTransactionError(error, 'unknown');
        }
    }

    /**
     * Get a tracked transaction by ID
     */
    getTransaction(id: string): TrackedTransaction | null {
        return this.pendingTransactions.get(id) || null;
    }

    /**
     * Get all pending transactions
     */
    getPendingTransactions(): TrackedTransaction[] {
        return Array.from(this.pendingTransactions.values()).filter(
            (tx) => tx.isPending,
        );
    }

    /**
     * Cancel a pending transaction
     */
    async cancelTransaction(id: string): Promise<boolean> {
        const tx = this.pendingTransactions.get(id);
        if (!tx || !tx.isPending) {
            return false;
        }

        this.logger.info('Cancelling transaction', { id });
        tx.updateStatus('cancelled');
        this.pendingTransactions.delete(id);

        this.emit('transactionCancelled', tx);
        return true;
    }

    /**
     * Clear completed transactions from memory
     */
    clearCompletedTransactions(): number {
        const completed = Array.from(this.pendingTransactions.entries()).filter(
            ([_, tx]) => tx.isComplete,
        );

        completed.forEach(([id]) => {
            this.pendingTransactions.delete(id);
        });

        this.logger.debug('Cleared completed transactions', {
            count: completed.length,
        });
        return completed.length;
    }

    /**
     * Get transaction statistics
     */
    getStats(): {
        pending: number;
        completed: number;
        failed: number;
        total: number;
    } {
        const transactions = Array.from(this.pendingTransactions.values());
        return {
            pending: transactions.filter((tx) => tx.isPending).length,
            completed: transactions.filter((tx) => tx.status === 'confirmed')
                .length,
            failed: transactions.filter((tx) => tx.status === 'failed').length,
            total: transactions.length,
        };
    }

    /**
     * Execute the full transaction flow
     */
    private async executeTransactionFlow(
        trackedTx: TrackedTransaction,
        params: TransactionParams,
    ): Promise<void> {
        try {
            // Gas estimation phase
            trackedTx.updateStatus('estimating');
            const estimatedGas = await this.estimateGas(
                trackedTx.clauses,
                params.signerAddress,
            );
            const gasLimit =
                params.maxGas ||
                Math.floor(estimatedGas * this.config.gasEstimationBuffer!);

            // Signing phase
            trackedTx.updateStatus('signing');
            const signedTx = await this.signTransaction(
                trackedTx.clauses,
                params,
                gasLimit,
            );

            // Broadcasting phase
            trackedTx.updateStatus('broadcasting');
            const txId = await this.broadcastTransaction(signedTx);

            // Update with actual transaction ID from blockchain
            (trackedTx as any).id = txId;
            this.pendingTransactions.delete(trackedTx.id);
            this.pendingTransactions.set(txId, trackedTx);

            trackedTx.updateStatus('pending');
            this.emit('transactionBroadcast', trackedTx);
        } catch (error) {
            const txError = this.createTransactionError(
                error,
                this.categorizeError(error),
            );
            trackedTx.updateStatus('failed', txError);
            this.emit('transactionFailed', trackedTx);
        }
    }

    /**
     * Estimate gas for transaction clauses using VeChain SDK
     */
    private async estimateGas(
        clauses: TransactionClause[],
        signerAddress: string,
    ): Promise<number> {
        try {
            if (this.config.thorClient) {
                const gasResult =
                    await this.config.thorClient.transactions.estimateGas(
                        clauses,
                        signerAddress,
                    );

                this.logger.debug('Gas estimation successful', {
                    estimatedGas: gasResult.totalGas,
                    clauseCount: clauses.length,
                    caller: signerAddress,
                });

                return gasResult.totalGas > 0
                    ? gasResult.totalGas
                    : this.config.defaultGasLimit!;
            }

            // Fallback to default if no Thor client
            this.logger.warn(
                'No Thor client available, using default gas limit',
            );
            return this.config.defaultGasLimit!;
        } catch (error) {
            this.logger.warn('Gas estimation failed, using default', {
                error: error instanceof Error ? error.message : String(error),
                defaultGas: this.config.defaultGasLimit,
                caller: signerAddress,
            });
            return this.config.defaultGasLimit!;
        }
    }

    /**
     * Sign transaction with appropriate method
     */
    private async signTransaction(
        clauses: TransactionClause[],
        params: TransactionParams,
        gasLimit: number,
    ): Promise<string> {
        if (!this.config.signingProvider) {
            throw new Error('No signing provider configured');
        }

        try {
            const signingOptions: SigningOptions = {
                gas: gasLimit,
                delegated: params.delegated,
                privyOptions: params.privyOptions,
            };

            const signedTx = await this.config.signingProvider.signTransaction(
                clauses,
                signingOptions,
            );

            this.logger.debug('Transaction signed successfully', {
                gasLimit,
                clauseCount: clauses.length,
                delegated: params.delegated,
            });

            return signedTx;
        } catch (error) {
            this.logger.error(
                'Transaction signing failed',
                error instanceof Error ? error : new Error(String(error)),
            );
            throw error;
        }
    }

    /**
     * Broadcast signed transaction using VeChain SDK
     */
    private async broadcastTransaction(signedTx: string): Promise<string> {
        if (!this.config.thorClient) {
            throw new Error('No Thor client configured for broadcasting');
        }

        try {
            const result =
                await this.config.thorClient.transactions.sendRawTransaction(
                    signedTx,
                );

            this.logger.info('Transaction broadcasted successfully', {
                txId: result.id,
            });

            // Note: VeChain SDK's sendRawTransaction returns transaction ID
            // Revert checking happens during monitoring phase

            return result.id;
        } catch (error) {
            this.logger.error(
                'Transaction broadcasting failed',
                error instanceof Error ? error : new Error(String(error)),
            );
            throw error;
        }
    }

    /**
     * Monitor pending transactions
     */
    private startMonitoring(): void {
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
        }

        this.monitoringInterval = setInterval(() => {
            this.monitorPendingTransactions();
        }, this.config.monitoringInterval);
    }

    /**
     * Check status of pending transactions
     */
    private async monitorPendingTransactions(): Promise<void> {
        const pending = this.getPendingTransactions();
        if (pending.length === 0) return;

        this.logger.debug('Monitoring pending transactions', {
            count: pending.length,
        });

        for (const tx of pending) {
            try {
                // Check transaction status on blockchain
                if (this.config.thorClient && tx.status === 'pending') {
                    const receipt = await this.config.thorClient.transactions
                        .getTransactionReceipt(tx.id)
                        .catch(() => null);

                    if (receipt) {
                        if (receipt.reverted) {
                            tx.updateStatus(
                                'failed',
                                this.createTransactionError(
                                    new Error('Transaction reverted'),
                                    'contract_error',
                                ),
                                receipt,
                            );
                        } else {
                            tx.updateStatus('confirmed', undefined, receipt);
                        }
                        continue;
                    }
                }

                // Timeout old transactions
                const age = Date.now() - tx.timestamp;
                if (age > 300000) {
                    // 5 minutes
                    this.logger.warn('Transaction timeout', { id: tx.id, age });
                    tx.updateStatus(
                        'failed',
                        this.createTransactionError(
                            new Error('Transaction timeout'),
                            'network_error',
                        ),
                    );
                }
            } catch (error) {
                this.logger.error(
                    'Error monitoring transaction',
                    error instanceof Error ? error : new Error(String(error)),
                );
            }
        }
    }

    /**
     * Create standardized transaction error
     */
    private createTransactionError(
        error: any,
        category: TransactionErrorCategory,
    ): TransactionErrorDetails {
        const message = error instanceof Error ? error.message : String(error);

        return {
            code: `TX_${category.toUpperCase()}`,
            message,
            category,
            retryable: ['network_error', 'gas_estimation_failed'].includes(
                category,
            ),
            userFriendlyMessage: this.getUserFriendlyErrorMessage(
                category,
                message,
            ),
            originalError: error,
        };
    }

    /**
     * Categorize errors for better handling
     */
    private categorizeError(error: any): TransactionErrorCategory {
        const message = error instanceof Error ? error.message : String(error);
        const lowerMessage = message.toLowerCase();

        if (
            lowerMessage.includes('user rejected') ||
            lowerMessage.includes('cancelled')
        ) {
            return 'user_rejected';
        } else if (
            lowerMessage.includes('gas') ||
            lowerMessage.includes('out of gas')
        ) {
            return 'gas_estimation_failed';
        } else if (
            lowerMessage.includes('insufficient') ||
            lowerMessage.includes('balance')
        ) {
            return 'insufficient_funds';
        } else if (
            lowerMessage.includes('network') ||
            lowerMessage.includes('connection')
        ) {
            return 'network_error';
        } else if (
            lowerMessage.includes('revert') ||
            lowerMessage.includes('contract')
        ) {
            return 'contract_error';
        }

        return 'unknown';
    }

    /**
     * Generate user-friendly error messages
     */
    private getUserFriendlyErrorMessage(
        category: TransactionErrorCategory,
        originalMessage: string,
    ): string {
        switch (category) {
            case 'user_rejected':
                return 'Transaction was cancelled by user';
            case 'insufficient_funds':
                return 'Insufficient funds to complete transaction';
            case 'gas_estimation_failed':
                return 'Unable to estimate transaction cost';
            case 'network_error':
                return 'Network connection error. Please try again.';
            case 'contract_error':
                return 'Smart contract execution failed';
            default:
                return 'Transaction failed. Please try again.';
        }
    }

    /**
     * Generate unique transaction ID
     */
    private generateTransactionId(): string {
        return `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Cleanup resources
     */
    destroy(): void {
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            this.monitoringInterval = null;
        }

        this.pendingTransactions.clear();
        this.removeAllListeners();

        this.logger.info('TransactionManager destroyed');
    }
}
