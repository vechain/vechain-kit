import type { ThorClient } from '@vechain/sdk-network';
import type { TransactionClause } from '@vechain/sdk-core';
import type { NETWORK_TYPE, AppConfig } from '../config/index.js';

/**
 * Network management interface
 */
export interface INetworkManager {
    readonly currentNetwork: NETWORK_TYPE;
    readonly config: AppConfig;
    switchNetwork(network: NETWORK_TYPE): void;
    getRpcUrl(): string;
    getNodeUrl(): string;
    getContractAddresses(): AppConfig['contracts'];
    getNetworkInfo(): NetworkInfo;
}

export interface NetworkInfo {
    type: NETWORK_TYPE;
    name: string;
    chainId: string;
    genesis: {
        number: number;
        id: string;
        timestamp: number;
    };
}

/**
 * Smart account management interface
 */
export interface ISmartAccountManager {
    getSmartAccount(
        thor: ThorClient,
        ownerAddress: string,
    ): Promise<SmartAccountInfo>;
    getAccountVersion(
        thor: ThorClient,
        accountAddress: string,
    ): Promise<string | null>;
    getFactoryAddress(): string;
}

export interface SmartAccountInfo {
    address: string;
    isDeployed: boolean;
    owner: string;
}

/**
 * Transaction building interface
 */
export interface ITransactionBuilder {
    addClause(clause: TransactionClause): ITransactionBuilder;
    addClauses(clauses: TransactionClause[]): ITransactionBuilder;
    setGas(gas: number): ITransactionBuilder;
    setDependsOn(txId: string): ITransactionBuilder;
    setExpiration(blocks: number): ITransactionBuilder;
    estimateGas(thor: ThorClient, caller?: string): Promise<number>;
    build(): TransactionBody;
    reset(): ITransactionBuilder;
}

export interface TransactionBody {
    clauses: TransactionClause[];
    options: TransactionOptions;
}

export interface TransactionOptions {
    gas?: number;
    dependsOn?: string;
    expiration?: number;
}

/**
 * Token management interface
 */
export interface ITokenManager {
    getBalance(
        thor: ThorClient,
        tokenAddress: string,
        accountAddress: string,
    ): Promise<TokenBalance>;
    getTokenInfo(thor: ThorClient, tokenAddress: string): Promise<TokenInfo>;
    getAllBalances(
        thor: ThorClient,
        accountAddress: string,
    ): Promise<TokenBalance[]>;
}

export interface TokenBalance {
    tokenAddress: string;
    balance: string;
    decimals: number;
    formatted: string;
}

export interface TokenInfo {
    address: string;
    name: string;
    symbol: string;
    decimals: number;
    totalSupply: string;
}

/**
 * Logger interface for debugging
 */
export interface ILogger {
    debug(message: string, ...args: unknown[]): void;
    info(message: string, ...args: unknown[]): void;
    warn(message: string, ...args: unknown[]): void;
    error(message: string, error?: Error): void;
}

/**
 * Connection manager interface
 */
export interface IConnectionManager {
    getConnectionState(): import('../classes/ConnectionManager.js').ConnectionState;
    getCurrentConnection():
        | import('../classes/ConnectionManager.js').Connection
        | null;
    isConnected(): boolean;
    getEnabledMethods(): import('../classes/ConnectionManager.js').LoginMethod[];
    isMethodAvailable(
        method: import('../classes/ConnectionManager.js').LoginMethod,
    ): boolean;
    getLoadingState(key: string): boolean;
    connect(
        method: import('../classes/ConnectionManager.js').LoginMethod,
        params?: any,
    ): Promise<import('../classes/ConnectionManager.js').LoginResult>;
    disconnect(): Promise<void>;
    verifyEmailCode(
        email: string,
        code: string,
    ): Promise<import('../classes/ConnectionManager.js').LoginResult>;
    reconnect(): Promise<import('../classes/ConnectionManager.js').LoginResult>;
}

/**
 * Authentication manager interface
 */
export interface IAuthenticationManager {
    authenticateWithEmail(
        params: import('../classes/AuthenticationManager.js').EmailAuthParams,
    ): Promise<import('../classes/ConnectionManager.js').LoginResult>;
    authenticateWithOAuth(
        params: import('../classes/AuthenticationManager.js').OAuthAuthParams,
    ): Promise<import('../classes/ConnectionManager.js').LoginResult>;
    authenticateWithPasskey(
        params?: import('../classes/AuthenticationManager.js').PasskeyAuthParams,
    ): Promise<import('../classes/ConnectionManager.js').LoginResult>;
    authenticateWithVeChain(
        params?: import('../classes/AuthenticationManager.js').CrossAppAuthParams,
    ): Promise<import('../classes/ConnectionManager.js').LoginResult>;
    authenticateWithDappKit(
        params?: import('../classes/AuthenticationManager.js').DappKitAuthParams,
    ): Promise<import('../classes/ConnectionManager.js').LoginResult>;
    getAuthState(
        sessionId: string,
    ): import('../classes/AuthenticationManager.js').AuthState | null;
    clearAuthState(sessionId: string): void;
    isMethodAvailable(
        method: import('../classes/ConnectionManager.js').LoginMethod,
    ): boolean;
}

/**
 * Cache interface
 */
export interface ICache<T> {
    get(key: string): T | undefined;
    set(key: string, value: T, ttl?: number): void;
    has(key: string): boolean;
    delete(key: string): void;
    clear(): void;
}

/**
 * Transaction manager interface
 */
export interface ITransactionManager {
    send(
        params: import('../classes/TransactionManager.js').TransactionParams,
    ): Promise<import('../classes/TransactionManager.js').TrackedTransaction>;
    getTransaction(
        id: string,
    ): import('../classes/TransactionManager.js').TrackedTransaction | null;
    getPendingTransactions(): import('../classes/TransactionManager.js').TrackedTransaction[];
    cancelTransaction(id: string): Promise<boolean>;
    clearCompletedTransactions(): number;
    getStats(): {
        pending: number;
        completed: number;
        failed: number;
        total: number;
    };
    destroy(): void;
}

/**
 * Event emitter interface
 */
export interface IEventEmitter<Events extends Record<string, unknown[]>> {
    on<K extends keyof Events>(
        event: K,
        listener: (...args: Events[K]) => void,
    ): void;
    off<K extends keyof Events>(
        event: K,
        listener: (...args: Events[K]) => void,
    ): void;
    emit<K extends keyof Events>(event: K, ...args: Events[K]): void;
    once<K extends keyof Events>(
        event: K,
        listener: (...args: Events[K]) => void,
    ): void;
}
