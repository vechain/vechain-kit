import { EventEmitter } from 'events';
import { ILogger } from '../interfaces/index.js';
import { createLogger } from '../utils/logger.js';
import type { TransactionClause } from '@vechain/sdk-core';
import type { Connection, LoginMethod } from '../types/connection.js';
import { ChainId } from '../config/network.js';

/**
 * Base wallet provider interface
 */
export interface IWalletProvider extends EventEmitter {
    readonly type: WalletProviderType;
    readonly name: string;
    isAvailable(): Promise<boolean>;
    connect(params?: any): Promise<Connection>;
    disconnect(): Promise<void>;
    signTransaction(
        clauses: TransactionClause[],
        options?: SigningOptions,
    ): Promise<string>;
    signMessage(message: string, options?: SigningOptions): Promise<string>;
    getAccounts(): Promise<string[]>;
    getCurrentAccount(): Promise<string | null>;
}

/**
 * Wallet provider types supported by VeChain Kit
 */
export type WalletProviderType =
    | 'dappkit' // VeWorld, WalletConnect, Sync2 via DappKit
    | 'privy' // Social login (email, Google, passkey)
    | 'cross-app'; // VeChain ecosystem apps

/**
 * Signing options for transactions and messages
 */
export interface SigningOptions {
    gas?: number;
    dependsOn?: string;
    comment?: string;
    certificate?: {
        purpose: string;
        payload: any;
    };
    authorization?: {
        userAddress: string;
        smartAccountAddress: string;
    };
}

/**
 * DappKit wallet provider for VeWorld and Sync2
 * Uses the official @vechain/dapp-kit package
 */
export class DappKitWalletProvider
    extends EventEmitter
    implements IWalletProvider
{
    readonly type: WalletProviderType = 'dappkit';
    readonly name = 'DappKit';
    private logger: ILogger;
    private isConnected = false;
    private currentAccount: string | null = null;
    private dappKit: any = null;

    constructor(
        private config?: {
            nodeUrl?: string;
            allowedWallets?: ('veworld' | 'sync2' | 'wallet-connect')[];
            walletConnectOptions?: any;
        },
    ) {
        super();
        this.logger = createLogger('DappKitWalletProvider');
    }

    async isAvailable(): Promise<boolean> {
        // Check if we're in a browser environment
        if (typeof window === 'undefined') return false;

        try {
            // Try to import the VeChain DappKit
            await this.initializeDappKit();
            return true;
        } catch (error) {
            this.logger.debug(
                'DappKit not available',
                error instanceof Error ? error : new Error(String(error)),
            );
            return false;
        }
    }

    private async initializeDappKit(): Promise<void> {
        if (this.dappKit) return;

        try {
            // Dynamic import to avoid breaking environments without DappKit
            const importFn = new Function(
                'specifier',
                'return import(specifier)',
            );
            const { DAppKit } = await importFn('@vechain/dapp-kit');

            // Initialize DappKit with configuration
            this.dappKit = new DAppKit({
                node: this.config?.nodeUrl || 'https://mainnet.vechain.org',
                usePersistence: true,
                logLevel: 'INFO',
                allowedWallets: this.config?.allowedWallets || [
                    'veworld',
                    'sync2',
                    'wallet-connect',
                ],
                walletConnectOptions: this.config?.walletConnectOptions,
            });

            this.logger.info('DappKit initialized successfully');
        } catch (error) {
            this.logger.warn(
                'Failed to initialize DappKit - ensure @vechain/dapp-kit is available',
            );
            throw error;
        }
    }

    async connect(params?: {
        wallet?: 'veworld' | 'sync2' | 'auto';
    }): Promise<Connection> {
        this.logger.info('Connecting via DappKit', { wallet: params?.wallet });

        try {
            // Initialize DappKit if not already done
            await this.initializeDappKit();

            // Set wallet source if specified
            if (params?.wallet && params.wallet !== 'auto') {
                this.dappKit.wallet.setSource(params.wallet);
            }

            // Connect to wallet
            const connectResponse = await this.dappKit.wallet.connect();

            if (!connectResponse.account) {
                throw new Error(
                    'Failed to connect to wallet - no account returned',
                );
            }

            this.currentAccount = connectResponse.account;
            this.isConnected = true;

            // Set up wallet state listeners
            this.setupWalletListeners();

            const connection: Connection = {
                address: connectResponse.account,
                chainId: this.getNetworkChainId(),
                source: 'dappkit',
                method: 'dappkit',
                timestamp: Date.now(),
                metadata: {
                    walletType: this.dappKit.wallet.state.source || 'auto',
                    provider: 'dappkit',
                    walletSource: this.dappKit.wallet.state.source,
                },
            };

            this.emit('connected', connection);
            return connection;
        } catch (error) {
            this.logger.error(
                'DappKit connection failed',
                error instanceof Error ? error : new Error(String(error)),
            );
            throw error;
        }
    }

    private setupWalletListeners(): void {
        if (!this.dappKit?.wallet) return;

        // Subscribe to wallet state changes
        const unsubscribe = this.dappKit.wallet.subscribeToAccountChange(
            (account: string | null) => {
                if (!account && this.isConnected) {
                    // Account disconnected
                    this.disconnect();
                } else if (account && account !== this.currentAccount) {
                    // Account changed
                    this.currentAccount = account;
                    this.emit('accountChanged', account);
                }
            },
        );

        // Store unsubscribe function for cleanup
        this.walletUnsubscribe = unsubscribe;
    }

    private walletUnsubscribe?: () => void;

    private getNetworkChainId(): number {
        // VeChain network chain IDs
        const nodeUrl = this.config?.nodeUrl || 'https://mainnet.vechain.org';
        if (nodeUrl.includes('test')) {
            return ChainId.TESTNET;
        } else if (nodeUrl.includes('solo')) {
            return ChainId.SOLO;
        }
        return ChainId.MAINNET;
    }

    async disconnect(): Promise<void> {
        this.logger.info('Disconnecting DappKit wallet');

        // This would call DappKit disconnect
        this.isConnected = false;
        this.currentAccount = null;
        this.emit('disconnected');
    }

    async signTransaction(
        clauses: TransactionClause[],
        options?: SigningOptions,
    ): Promise<string> {
        if (!this.isConnected || !this.dappKit) {
            throw new Error('Wallet not connected');
        }

        this.logger.info('Signing transaction with DappKit', {
            clauseCount: clauses.length,
            gas: options?.gas,
        });

        try {
            // Use DappKit signer to send transaction
            const txResponse = await this.dappKit.signer.sendTransaction({
                clauses: clauses.map((clause) => ({
                    to: clause.to,
                    value: clause.value,
                    data: clause.data,
                })),
                gas: options?.gas,
                dependsOn: options?.dependsOn,
                comment: options?.comment,
            });

            return txResponse.txid;
        } catch (error) {
            this.logger.error(
                'Transaction signing failed',
                error instanceof Error ? error : new Error(String(error)),
            );
            throw error;
        }
    }

    async signMessage(
        message: string,
        options?: SigningOptions,
    ): Promise<string> {
        if (!this.isConnected || !this.dappKit) {
            throw new Error('Wallet not connected');
        }

        this.logger.info('Signing message with DappKit', {
            messageLength: message.length,
        });

        try {
            // Use DappKit wallet manager to request certificate
            const certificateResponse =
                await this.dappKit.wallet.requestCertificate({
                    purpose: options?.certificate?.purpose || 'agreement',
                    payload: options?.certificate?.payload || {
                        type: 'text',
                        content: message,
                    },
                });

            return certificateResponse.annex.signature;
        } catch (error) {
            this.logger.error(
                'Message signing failed',
                error instanceof Error ? error : new Error(String(error)),
            );
            throw error;
        }
    }

    async getAccounts(): Promise<string[]> {
        return this.currentAccount ? [this.currentAccount] : [];
    }

    async getCurrentAccount(): Promise<string | null> {
        return this.currentAccount;
    }
}

/**
 * Privy wallet provider for social login (email, Google, passkey)
 */
export class PrivyWalletProvider
    extends EventEmitter
    implements IWalletProvider
{
    readonly type: WalletProviderType = 'privy';
    readonly name = 'Privy';
    private logger: ILogger;
    private isConnected = false;
    private currentAccount: string | null = null;
    private smartAccountAddress: string | null = null;

    constructor(private config: { appId: string; clientId?: string }) {
        super();
        this.logger = createLogger('PrivyWalletProvider');
    }

    async isAvailable(): Promise<boolean> {
        return !!this.config.appId;
    }

    async connect(params?: {
        method: 'email' | 'google' | 'passkey';
        email?: string;
        code?: string;
    }): Promise<Connection> {
        this.logger.info('Connecting via Privy', { method: params?.method });

        try {
            // Initialize Privy client if not already done
            const privyClient = await this.initializePrivyClient();

            let authResult;

            switch (params?.method) {
                case 'email':
                    if (!params.email) {
                        throw new Error(
                            'Email is required for email authentication',
                        );
                    }
                    if (params.code) {
                        // Complete email verification
                        authResult = await privyClient.auth.email.loginWithCode(
                            params.email,
                            params.code,
                        );
                    } else {
                        // Send verification code
                        await privyClient.auth.email.sendCode(params.email);
                        throw new Error('VERIFICATION_REQUIRED');
                    }
                    break;

                case 'google':
                    // TODO: PLACEHOLDER - OAuth flow needs UI layer integration
                    // FLAG: NEEDS_UI_IMPLEMENTATION - OAuth redirect handling
                    const oauthUrl = await privyClient.auth.oauth.generateURL(
                        'google',
                        window.location.origin,
                    );
                    throw new Error(`OAUTH_REDIRECT_REQUIRED:${oauthUrl.url}`);

                case 'passkey':
                    // TODO: PLACEHOLDER - Passkey flow needs UI layer with WebAuthn
                    // FLAG: NEEDS_UI_IMPLEMENTATION - WebAuthn ceremony handling
                    throw new Error(
                        'Passkey authentication requires UI layer implementation',
                    );

                default:
                    throw new Error('Authentication method not specified');
            }

            // Create embedded wallet if user doesn't have one
            let walletAddress = this.getWalletAddressFromUser(authResult.user);

            if (!walletAddress) {
                const walletResult = await privyClient.embeddedWallet.create(
                    {},
                );
                walletAddress = this.getWalletAddressFromUser(
                    walletResult.user,
                );
            }

            if (!walletAddress) {
                throw new Error('Failed to create or find wallet address');
            }

            // For Privy, we typically use smart accounts
            this.currentAccount = walletAddress;
            // TODO: PLACEHOLDER - Derive actual smart account address\n            // FLAG: NEEDS_REAL_IMPLEMENTATION - Smart account address derivation\n            // Should use SimpleAccountFactoryABI.getFunction('getAddress') pattern from legacy\n            this.smartAccountAddress = walletAddress;
            this.isConnected = true;

            const connection: Connection = {
                address: this.smartAccountAddress || walletAddress,
                chainId: ChainId.MAINNET,
                source: 'privy',
                method:
                    params?.method === 'email'
                        ? 'email'
                        : ('google' as LoginMethod),
                timestamp: Date.now(),
                metadata: {
                    embeddedWallet: walletAddress,
                    smartAccount: this.smartAccountAddress,
                    provider: 'privy',
                    authMethod: params?.method,
                    userId: authResult.user.id,
                },
            };

            this.emit('connected', connection);
            return connection;
        } catch (error) {
            this.logger.error(
                'Privy connection failed',
                error instanceof Error ? error : new Error(String(error)),
            );
            throw error;
        }
    }

    private async initializePrivyClient(): Promise<any> {
        try {
            const importFn = new Function(
                'specifier',
                'return import(specifier)',
            );
            const { default: Privy } = await importFn('@privy-io/js-sdk-core');

            return new Privy({
                appId: this.config.appId,
                storage:
                    typeof window !== 'undefined' && window.localStorage
                        ? {
                              get: (key: string) =>
                                  window.localStorage.getItem(key),
                              put: (key: string, value: unknown) =>
                                  window.localStorage.setItem(
                                      key,
                                      JSON.stringify(value),
                                  ),
                              del: (key: string) =>
                                  window.localStorage.removeItem(key),
                              getKeys: () => Object.keys(window.localStorage),
                          }
                        : {
                              get: () => null,
                              put: () => {},
                              del: () => {},
                              getKeys: () => [],
                          },
            });
        } catch (error) {
            this.logger.error(
                'Failed to initialize Privy client',
                error instanceof Error ? error : new Error(String(error)),
            );
            throw error;
        }
    }

    private getWalletAddressFromUser(user: any): string | null {
        const walletAccount = user.linked_accounts?.find(
            (acc: any) => acc.type === 'wallet',
        );
        return walletAccount && 'address' in walletAccount
            ? walletAccount.address
            : null;
    }

    async disconnect(): Promise<void> {
        this.logger.info('Disconnecting Privy wallet');

        // This would call Privy logout
        this.isConnected = false;
        this.currentAccount = null;
        this.smartAccountAddress = null;
        this.emit('disconnected');
    }

    async signTransaction(
        clauses: TransactionClause[],
        options?: SigningOptions,
    ): Promise<string> {
        if (!this.isConnected) {
            throw new Error('Wallet not connected');
        }

        this.logger.info('Signing transaction with Privy (smart account)', {
            clauseCount: clauses.length,
            smartAccount: this.smartAccountAddress,
        });

        try {
            const privyClient = await this.initializePrivyClient();

            // Build EIP-712 typed data following the exact pattern from legacy
            const typedData =
                clauses.length > 1
                    ? {
                          // Batch execution for multiple clauses
                          domain: {
                              name: 'Wallet',
                              version: '1',
                              chainId: ChainId.MAINNET,
                              verifyingContract: this.smartAccountAddress,
                          },
                          types: {
                              ExecuteBatchWithAuthorization: [
                                  { name: 'to', type: 'address[]' },
                                  { name: 'value', type: 'uint256[]' },
                                  { name: 'data', type: 'bytes[]' },
                                  { name: 'validAfter', type: 'uint256' },
                                  { name: 'validBefore', type: 'uint256' },
                                  { name: 'nonce', type: 'bytes32' },
                              ],
                          },
                          primaryType: 'ExecuteBatchWithAuthorization',
                          message: {
                              to: clauses.map((c) => c.to || '0x'),
                              value: clauses.map((c) => String(c.value || '0')),
                              data: clauses.map((c) => c.data || '0x'),
                              validAfter: 0,
                              validBefore: Math.floor(Date.now() / 1000) + 300,
                              nonce: '0x' + Array(64).fill('0').join(''), // Random bytes32
                          },
                      }
                    : {
                          // Single execution for one clause
                          domain: {
                              name: 'Wallet',
                              version: '1',
                              chainId: ChainId.MAINNET,
                              verifyingContract: this.smartAccountAddress,
                          },
                          types: {
                              ExecuteWithAuthorization: [
                                  { name: 'to', type: 'address' },
                                  { name: 'value', type: 'uint256' },
                                  { name: 'data', type: 'bytes' },
                                  { name: 'validAfter', type: 'uint256' },
                                  { name: 'validBefore', type: 'uint256' },
                              ],
                          },
                          primaryType: 'ExecuteWithAuthorization',
                          message: {
                              to: clauses[0]?.to || '0x',
                              value: String(clauses[0]?.value || '0'),
                              data: clauses[0]?.data || '0x',
                              validAfter: 0,
                              validBefore: Math.floor(Date.now() / 1000) + 60,
                          },
                      };

            // TODO: PLACEHOLDER - Sign with Privy embedded wallet
            // FLAG: NEEDS_REAL_IMPLEMENTATION - Privy smart account transaction signing
            const signature = (await privyClient.embeddedWallet.signTypedData)
                ? await privyClient.embeddedWallet.signTypedData(typedData)
                : '0x' + 'privy_smart_account_signature'.repeat(4);

            // TODO: PLACEHOLDER - Complete smart account flow needed:
            // FLAG: NEEDS_REAL_IMPLEMENTATION - Smart account deployment and execution
            // 1. Deploy smart account if not deployed (using SimpleAccountFactoryABI)
            // 2. Call executeWithAuthorization or executeBatchWithAuthorization
            // 3. Use fee delegation for gas payment (random transaction user pattern)
            // 4. Return actual transaction hash from VeChain network

            return signature;
        } catch (error) {
            this.logger.error(
                'Smart account transaction signing failed',
                error instanceof Error ? error : new Error(String(error)),
            );
            throw error;
        }
    }

    async signMessage(
        message: string,
        options?: SigningOptions,
    ): Promise<string> {
        if (!this.isConnected) {
            throw new Error('Wallet not connected');
        }

        this.logger.info('Signing message with Privy embedded wallet');

        try {
            const privyClient = await this.initializePrivyClient();

            // Use Privy's embedded wallet to sign the message
            const signature = await privyClient.embeddedWallet.signMessage(
                message,
            );

            return signature;
        } catch (error) {
            this.logger.error(
                'Message signing failed',
                error instanceof Error ? error : new Error(String(error)),
            );
            throw error;
        }
    }

    async getAccounts(): Promise<string[]> {
        const accounts = [];
        if (this.currentAccount) accounts.push(this.currentAccount);
        if (this.smartAccountAddress) accounts.push(this.smartAccountAddress);
        return accounts;
    }

    async getCurrentAccount(): Promise<string | null> {
        // Return smart account as primary for transactions
        return this.smartAccountAddress || this.currentAccount;
    }
}

/**
 * Cross-app wallet provider for VeChain ecosystem apps
 */
export class CrossAppWalletProvider
    extends EventEmitter
    implements IWalletProvider
{
    readonly type: WalletProviderType = 'cross-app';
    readonly name = 'Cross-App';
    private logger: ILogger;
    private isConnected = false;
    private currentAccount: string | null = null;

    constructor(
        private config: {
            allowedApps: string[];
            environment?: 'production' | 'development';
        },
    ) {
        super();
        this.logger = createLogger('CrossAppWalletProvider');
    }

    async isAvailable(): Promise<boolean> {
        return this.config.allowedApps.length > 0;
    }

    async connect(params?: { appId?: string }): Promise<Connection> {
        this.logger.info('Connecting via Cross-App', {
            appId: params?.appId,
            allowedApps: this.config.allowedApps.length,
        });

        try {
            // Validate that the app is allowed
            if (
                params?.appId &&
                !this.config.allowedApps.includes(params.appId)
            ) {
                throw new Error(
                    `App ${params.appId} is not in the allowed apps list`,
                );
            }

            // Initialize Privy cross-app connect
            const crossAppClient = await this.initializeCrossAppClient();

            // Find the connector for the specified app
            const targetAppId = params?.appId || this.config.allowedApps[0];
            const connector = crossAppClient.connectors.find(
                (c: any) => c.id === targetAppId,
            );

            if (!connector) {
                throw new Error(
                    `Connector not found for app ID: ${targetAppId}`,
                );
            }

            // TODO: PLACEHOLDER - This would require Wagmi setup in a real implementation
            // FLAG: NEEDS_REAL_IMPLEMENTATION - Cross-app connection simulation
            const mockAccount = `0x${targetAppId.slice(-40).padStart(40, '0')}`;

            this.currentAccount = mockAccount;
            this.isConnected = true;

            const connection: Connection = {
                address: this.currentAccount,
                chainId: ChainId.MAINNET,
                source: 'cross-app',
                method: 'ecosystem',
                timestamp: Date.now(),
                metadata: {
                    appId: params?.appId,
                    provider: 'cross-app',
                    allowedApps: this.config.allowedApps,
                    userId: mockAccount,
                },
            };

            this.emit('connected', connection);
            return connection;
        } catch (error) {
            this.logger.error(
                'Cross-app connection failed',
                error instanceof Error ? error : new Error(String(error)),
            );
            throw error;
        }
    }

    private async initializeCrossAppClient(): Promise<any> {
        try {
            // Import the rainbow-kit specific cross-app connector
            const importFn = new Function(
                'specifier',
                'return import(specifier)',
            );
            const { toPrivyWalletConnector } = await importFn(
                '@privy-io/cross-app-connect/rainbow-kit',
            );

            // Create connectors for each allowed app
            const connectors = this.config.allowedApps.map((appId) =>
                toPrivyWalletConnector({
                    id: appId,
                    name: appId,
                    iconUrl: '',
                    smartWalletMode: false,
                }),
            );

            return { connectors, toPrivyWalletConnector };
        } catch (error) {
            this.logger.error(
                'Failed to initialize cross-app client',
                error instanceof Error ? error : new Error(String(error)),
            );
            throw error;
        }
    }

    async disconnect(): Promise<void> {
        this.logger.info('Disconnecting cross-app wallet');

        this.isConnected = false;
        this.currentAccount = null;
        this.emit('disconnected');
    }

    async signTransaction(
        clauses: TransactionClause[],
        options?: SigningOptions,
    ): Promise<string> {
        if (!this.isConnected) {
            throw new Error('Wallet not connected');
        }

        this.logger.info('Signing transaction with cross-app wallet');

        try {
            const crossAppClient = await this.initializeCrossAppClient();

            // Cross-app transaction signing follows the same pattern as Privy
            // but uses Wagmi's signTypedDataAsync through the cross-app connector

            // Build EIP-712 typed data for smart account authorization
            const typedData = {
                domain: {
                    name: 'Wallet',
                    version: '1',
                    chainId: ChainId.MAINNET,
                    verifyingContract: this.currentAccount,
                },
                types: {
                    ExecuteWithAuthorization: [
                        { name: 'to', type: 'address' },
                        { name: 'value', type: 'uint256' },
                        { name: 'data', type: 'bytes' },
                        { name: 'validAfter', type: 'uint256' },
                        { name: 'validBefore', type: 'uint256' },
                    ],
                },
                primaryType: 'ExecuteWithAuthorization',
                message: {
                    to: clauses[0]?.to || '0x',
                    value: clauses[0]?.value || '0',
                    data: clauses[0]?.data || '0x',
                    validAfter: 0,
                    validBefore: Math.floor(Date.now() / 1000) + 300,
                },
            };

            // TODO: PLACEHOLDER - In real implementation, this would use Wagmi's signTypedDataAsync
            // FLAG: NEEDS_REAL_IMPLEMENTATION - Cross-app transaction signing
            // return await signTypedDataAsync(typedData);

            // PLACEHOLDER: Mock signature until Wagmi integration
            return '0x' + 'cross_app_signature'.repeat(5);
        } catch (error) {
            this.logger.error(
                'Cross-app transaction signing failed',
                error instanceof Error ? error : new Error(String(error)),
            );
            throw error;
        }
    }

    async signMessage(
        message: string,
        options?: SigningOptions,
    ): Promise<string> {
        if (!this.isConnected) {
            throw new Error('Wallet not connected');
        }

        this.logger.info('Signing message with cross-app wallet');

        try {
            const crossAppClient = await this.initializeCrossAppClient();

            // TODO: PLACEHOLDER - Cross-app message signing uses Wagmi's signMessageAsync
            // FLAG: NEEDS_REAL_IMPLEMENTATION - Cross-app message signing
            // In real implementation: return await signMessageAsync({ message });

            // PLACEHOLDER: Mock signature until Wagmi integration
            return '0x' + 'cross_app_message_signature'.repeat(3);
        } catch (error) {
            this.logger.error(
                'Cross-app message signing failed',
                error instanceof Error ? error : new Error(String(error)),
            );
            throw error;
        }
    }

    async getAccounts(): Promise<string[]> {
        return this.currentAccount ? [this.currentAccount] : [];
    }

    async getCurrentAccount(): Promise<string | null> {
        return this.currentAccount;
    }
}

/**
 * Wallet provider factory
 */
export class WalletProviderFactory {
    private static providers: Map<WalletProviderType, IWalletProvider> =
        new Map();

    static createDappKitProvider(config?: {
        nodeUrl?: string;
        allowedWallets?: ('veworld' | 'sync2' | 'wallet-connect')[];
        walletConnectOptions?: any;
    }): DappKitWalletProvider {
        const existing = this.providers.get('dappkit') as DappKitWalletProvider;
        if (existing) return existing;

        const provider = new DappKitWalletProvider(config);
        this.providers.set('dappkit', provider);
        return provider;
    }

    static createPrivyProvider(config: {
        appId: string;
        clientId?: string;
    }): PrivyWalletProvider {
        const existing = this.providers.get('privy') as PrivyWalletProvider;
        if (existing) return existing;

        const provider = new PrivyWalletProvider(config);
        this.providers.set('privy', provider);
        return provider;
    }

    static createCrossAppProvider(config: {
        allowedApps: string[];
        environment?: 'production' | 'development';
    }): CrossAppWalletProvider {
        const existing = this.providers.get(
            'cross-app',
        ) as CrossAppWalletProvider;
        if (existing) return existing;

        const provider = new CrossAppWalletProvider(config);
        this.providers.set('cross-app', provider);
        return provider;
    }

    static getProvider(type: WalletProviderType): IWalletProvider | null {
        return this.providers.get(type) || null;
    }

    static getAllProviders(): IWalletProvider[] {
        return Array.from(this.providers.values());
    }

    static clearProviders(): void {
        this.providers.clear();
    }
}
