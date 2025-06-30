/**
 * Base error class for VeChain Kit
 */
export abstract class VeChainKitError extends Error {
    public readonly code: string;
    public readonly details?: unknown;

    constructor(message: string, code: string, details?: unknown) {
        super(message);
        this.name = this.constructor.name;
        this.code = code;
        this.details = details;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

/**
 * Network-related errors
 */
export class NetworkError extends VeChainKitError {
    constructor(message: string, details?: unknown) {
        super(message, 'NETWORK_ERROR', details);
    }
}

export class InvalidNetworkError extends NetworkError {
    constructor(network: string) {
        super(`Invalid network: ${network}`, { network });
    }
}

export class NetworkConnectionError extends NetworkError {
    constructor(url: string, cause?: Error) {
        super(`Failed to connect to ${url}`, { url, cause });
    }
}

/**
 * Smart Account errors
 */
export class SmartAccountError extends VeChainKitError {
    constructor(message: string, details?: unknown) {
        super(message, 'SMART_ACCOUNT_ERROR', details);
    }
}

export class SmartAccountNotDeployedError extends SmartAccountError {
    constructor(address: string) {
        super(`Smart account not deployed at ${address}`, { address });
    }
}

export class SmartAccountFactoryError extends SmartAccountError {
    constructor(message: string, factoryAddress: string) {
        super(message, { factoryAddress });
    }
}

/**
 * Transaction errors
 */
export class TransactionError extends VeChainKitError {
    constructor(message: string, details?: unknown) {
        super(message, 'TRANSACTION_ERROR', details);
    }
}

export class TransactionRevertedError extends TransactionError {
    constructor(reason: string, txId?: string) {
        super(`Transaction reverted: ${reason}`, { reason, txId });
    }
}

export class GasEstimationError extends TransactionError {
    constructor(message: string, clauses?: unknown[]) {
        super(message, { clauses });
    }
}

/**
 * Contract errors
 */
export class ContractError extends VeChainKitError {
    constructor(message: string, details?: unknown) {
        super(message, 'CONTRACT_ERROR', details);
    }
}

export class ContractNotFoundError extends ContractError {
    constructor(address: string) {
        super(`Contract not found at ${address}`, { address });
    }
}

/**
 * Validation errors
 */
export class ValidationError extends VeChainKitError {
    constructor(message: string, details?: unknown) {
        super(message, 'VALIDATION_ERROR', details);
    }
}

export class InvalidAddressError extends ValidationError {
    constructor(address: string) {
        super(`Invalid address: ${address}`, { address });
    }
}

export class InvalidAmountError extends ValidationError {
    constructor(amount: string | number) {
        super(`Invalid amount: ${amount}`, { amount });
    }
}

/**
 * Type guards
 */
export const isVeChainKitError = (error: unknown): error is VeChainKitError => {
    return error instanceof VeChainKitError;
};

export const isNetworkError = (error: unknown): error is NetworkError => {
    return error instanceof NetworkError;
};

export const isSmartAccountError = (
    error: unknown,
): error is SmartAccountError => {
    return error instanceof SmartAccountError;
};

export const isTransactionError = (
    error: unknown,
): error is TransactionError => {
    return error instanceof TransactionError;
};
