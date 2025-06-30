import { ThorClient } from '@vechain/sdk-network';
import {
    TransactionClause,
    Address,
    VET,
    Clause,
    Units,
} from '@vechain/sdk-core';
import type { TransactionOptions } from '../interfaces/index.js';

export class TransactionBuilder {
    private clauses: TransactionClause[] = [];
    private options: TransactionOptions = {};

    addClause(clause: TransactionClause): this {
        this.clauses.push(clause);
        return this;
    }

    addClauses(clauses: TransactionClause[]): this {
        this.clauses.push(...clauses);
        return this;
    }

    setGas(gas: number): this {
        this.options.gas = gas;
        return this;
    }

    setDependsOn(txId: string): this {
        this.options.dependsOn = txId;
        return this;
    }

    setExpiration(blocks: number): this {
        this.options.expiration = blocks;
        return this;
    }

    async estimateGas(thor: ThorClient, caller?: string): Promise<number> {
        if (this.clauses.length === 0) {
            throw new Error('No clauses to estimate gas for');
        }

        try {
            const gasResult = await thor.transactions.estimateGas(
                this.clauses,
                caller,
            );

            return gasResult.totalGas;
        } catch (error) {
            // Fallback to basic estimation
            return this.clauses.length * 21000;
        }
    }

    build() {
        return {
            clauses: [...this.clauses],
            options: { ...this.options },
        };
    }

    reset(): this {
        this.clauses = [];
        this.options = {};
        return this;
    }

    static createTransferClause(to: string, amount: string): TransactionClause {
        const toAddress = Address.of(to);
        const vetAmount = VET.of(amount, Units.ether);

        const clause = Clause.transferVET(toAddress, vetAmount);

        return {
            to: clause.to,
            value: clause.value,
            data: clause.data,
        };
    }

    static createContractCallClause(
        to: string,
        data: string,
        value: string = '0',
    ): TransactionClause {
        const toAddress = Address.of(to);
        const vetValue = VET.of(value, Units.wei);

        return {
            to: toAddress.toString(),
            value: vetValue.wei.toString(),
            data,
        };
    }
}
