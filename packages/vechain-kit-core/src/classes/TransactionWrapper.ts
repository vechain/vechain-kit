import { TransactionClause } from '@vechain/sdk-core';
import { ThorClient } from '@vechain/sdk-network';
import { Interface } from 'ethers';
import {
    TransactionManager,
    TransactionParams,
    TrackedTransaction,
} from './TransactionManager.js';
import { ILogger } from '../interfaces/index.js';
import { createLogger } from '../utils/logger.js';

/**
 * Common ERC20 ABI for method encoding
 */
const ERC20_ABI = [
    {
        constant: false,
        inputs: [
            { name: '_to', type: 'address' },
            { name: '_value', type: 'uint256' },
        ],
        name: 'transfer',
        outputs: [{ name: '', type: 'bool' }],
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            { name: '_spender', type: 'address' },
            { name: '_value', type: 'uint256' },
        ],
        name: 'approve',
        outputs: [{ name: '', type: 'bool' }],
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            { name: '_from', type: 'address' },
            { name: '_to', type: 'address' },
            { name: '_value', type: 'uint256' },
        ],
        name: 'transferFrom',
        outputs: [{ name: '', type: 'bool' }],
        type: 'function',
    },
    {
        constant: true,
        inputs: [{ name: '_owner', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: '', type: 'uint256' }],
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'decimals',
        outputs: [{ name: '', type: 'uint8' }],
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'symbol',
        outputs: [{ name: '', type: 'string' }],
        type: 'function',
    },
];

/**
 * Parameters for method-based transaction sending
 */
export interface MethodTransactionParams {
    to: string;
    method: string;
    args: any[];
    value?: string;
    signerAddress: string;
    maxGas?: number;
    delegated?: boolean;
    abi?: any[];
    privyOptions?: {
        title?: string;
        description?: string;
        buttonText?: string;
    };
}

/**
 * Enhanced transaction result with method call context
 */
export interface MethodTransactionResult extends TrackedTransaction {
    readonly methodCall: {
        to: string;
        method: string;
        args: any[];
        encodedData: string;
    };
}

/**
 * TransactionWrapper provides a clean method-calling API on top of TransactionManager
 *
 * Instead of manually building clauses, developers can call:
 * ```typescript
 * const tx = await wrapper.send({
 *   to: tokenAddress,
 *   method: 'transfer',
 *   args: [recipient, amount],
 *   signerAddress: '0x...'
 * });
 * ```
 */
export class TransactionWrapper {
    private transactionManager: TransactionManager;
    private thor: ThorClient;
    private logger: ILogger;
    private erc20Interface: Interface;
    private customInterfaces: Map<string, Interface> = new Map();

    constructor(transactionManager: TransactionManager, thor: ThorClient) {
        this.transactionManager = transactionManager;
        this.thor = thor;
        this.logger = createLogger('TransactionWrapper');
        this.erc20Interface = new Interface(ERC20_ABI);
    }

    /**
     * Register a custom ABI for a specific contract address
     */
    registerABI(contractAddress: string, abi: any[]): void {
        this.customInterfaces.set(
            contractAddress.toLowerCase(),
            new Interface(abi),
        );
        this.logger.debug('Custom ABI registered', { contractAddress });
    }

    /**
     * Send a transaction using method name and arguments
     *
     * @param params Method transaction parameters
     * @returns TrackedTransaction with method call context
     */
    async send(
        params: MethodTransactionParams,
    ): Promise<MethodTransactionResult> {
        this.logger.info('Initiating method-based transaction', {
            to: params.to,
            method: params.method,
            args: params.args.map((a) => a.toString()),
            signerAddress: params.signerAddress,
        });

        try {
            // Build the transaction clause from method call
            const clause = await this.buildClauseFromMethod(params);

            // Convert to TransactionManager params
            const txParams: TransactionParams = {
                clauses: [clause],
                signerAddress: params.signerAddress,
                maxGas: params.maxGas,
                delegated: params.delegated,
                privyOptions: params.privyOptions,
            };

            // Send through existing TransactionManager
            const trackedTx = await this.transactionManager.send(txParams);

            // Enhance with method call context
            const enhancedTx = this.enhanceWithMethodContext(
                trackedTx,
                params,
                clause.data!,
            );

            this.logger.info('Method-based transaction initiated', {
                txId: trackedTx.id,
                method: params.method,
                to: params.to,
            });

            return enhancedTx;
        } catch (error) {
            this.logger.error(
                'Method-based transaction failed',
                error instanceof Error ? error : new Error(String(error)),
            );
            throw error;
        }
    }

    /**
     * Convenience method for ERC20 token transfers
     */
    async transferToken(
        tokenAddress: string,
        recipient: string,
        amount: string,
        signerAddress: string,
        options: Partial<MethodTransactionParams> = {},
    ): Promise<MethodTransactionResult> {
        return this.send({
            to: tokenAddress,
            method: 'transfer',
            args: [recipient, amount],
            signerAddress,
            ...options,
        });
    }

    /**
     * Convenience method for ERC20 token approvals
     */
    async approveToken(
        tokenAddress: string,
        spender: string,
        amount: string,
        signerAddress: string,
        options: Partial<MethodTransactionParams> = {},
    ): Promise<MethodTransactionResult> {
        return this.send({
            to: tokenAddress,
            method: 'approve',
            args: [spender, amount],
            signerAddress,
            ...options,
        });
    }

    /**
     * Build a transaction clause from method call parameters
     */
    private async buildClauseFromMethod(
        params: MethodTransactionParams,
    ): Promise<TransactionClause> {
        // Get the appropriate interface for encoding
        const contractInterface = this.getContractInterface(
            params.to,
            params.abi,
        );

        // Encode the method call
        const encodedData = contractInterface.encodeFunctionData(
            params.method,
            params.args,
        );

        this.logger.debug('Method encoded to transaction data', {
            method: params.method,
            args: params.args.map((a) => a.toString()),
            encodedData: encodedData.slice(0, 20) + '...',
        });

        // Build the clause
        const clause: TransactionClause = {
            to: params.to,
            value: params.value || '0x0',
            data: encodedData,
        };

        return clause;
    }

    /**
     * Get the appropriate contract interface for method encoding
     */
    private getContractInterface(
        contractAddress: string,
        customAbi?: any[],
    ): Interface {
        // Use custom ABI if provided
        if (customAbi) {
            return new Interface(customAbi);
        }

        // Check for registered custom interface
        const customInterface = this.customInterfaces.get(
            contractAddress.toLowerCase(),
        );
        if (customInterface) {
            return customInterface;
        }

        // Default to ERC20 ABI
        return this.erc20Interface;
    }

    /**
     * Enhance TrackedTransaction with method call context
     */
    private enhanceWithMethodContext(
        trackedTx: TrackedTransaction,
        params: MethodTransactionParams,
        encodedData: string,
    ): MethodTransactionResult {
        // Add method call information to the tracked transaction
        const enhanced = trackedTx as MethodTransactionResult;

        (enhanced as any).methodCall = {
            to: params.to,
            method: params.method,
            args: params.args,
            encodedData,
        };

        return enhanced;
    }

    /**
     * Get transaction statistics from underlying TransactionManager
     */
    getStats() {
        return this.transactionManager.getStats();
    }

    /**
     * Get a tracked transaction by ID
     */
    getTransaction(id: string): TrackedTransaction | null {
        return this.transactionManager.getTransaction(id);
    }

    /**
     * Get all pending transactions
     */
    getPendingTransactions(): TrackedTransaction[] {
        return this.transactionManager.getPendingTransactions();
    }

    /**
     * Cancel a pending transaction
     */
    async cancelTransaction(id: string): Promise<boolean> {
        return this.transactionManager.cancelTransaction(id);
    }

    /**
     * Clear completed transactions
     */
    clearCompletedTransactions(): number {
        return this.transactionManager.clearCompletedTransactions();
    }
}
