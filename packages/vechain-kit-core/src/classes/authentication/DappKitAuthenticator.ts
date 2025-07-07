import { ILogger } from '../../interfaces/index.js';
import { createLogger } from '../../utils/logger.js';
import type { LoginResult, Connection } from '../../types/connection.js';
import type { DappKitAuthParams } from './types.js';
import { ChainId } from '../../config/network.js';

/**
 * DappKit authentication handler for VeWorld and Sync2
 * Uses @vechain/dapp-kit for wallet connections
 */
export class DappKitAuthenticator {
    private logger: ILogger;

    constructor(private dappKitClient: any) {
        this.logger = createLogger('DappKitAuthenticator');
    }

    /**
     * Execute DappKit authentication
     */
    async executeDappKitAuth(
        params: DappKitAuthParams,
        sessionId: string,
    ): Promise<LoginResult> {
        this.logger.info('Executing DappKit authentication', { 
            sessionId,
            walletType: params.walletType,
            chainId: params.chainId,
        });

        if (!this.dappKitClient) {
            throw new Error('DappKit client not initialized');
        }

        try {
            // Set wallet source if specified
            if (params.walletType && params.walletType !== 'auto') {
                this.dappKitClient.wallet.setSource(params.walletType);
                this.logger.debug('DappKit wallet source set', {
                    walletType: params.walletType,
                    sessionId,
                });
            }

            // Connect to wallet
            this.logger.debug('Requesting wallet connection', { sessionId });
            const connectResponse = await this.dappKitClient.wallet.connect();

            if (!connectResponse.account) {
                throw new Error(
                    'Failed to connect to wallet - no account returned',
                );
            }

            // Determine chain ID
            const chainId = params.chainId || this.getNetworkChainId();

            // Create connection object
            const connection: Connection = {
                address: connectResponse.account,
                chainId,
                source: 'dappkit',
                method: 'dappkit',
                timestamp: Date.now(),
                metadata: {
                    walletType: this.dappKitClient.wallet.state?.source || params.walletType || 'auto',
                    provider: 'dappkit',
                    walletSource: this.dappKitClient.wallet.state?.source,
                    sessionId,
                },
            };

            this.logger.info('DappKit authentication successful', {
                sessionId,
                address: connection.address,
                walletType: connection.metadata.walletType,
                chainId: connection.chainId,
            });

            return {
                success: true,
                connection,
            };

        } catch (error) {
            this.logger.error(
                `DappKit authentication failed (session: ${sessionId})`,
                error instanceof Error ? error : new Error(String(error)),
            );

            // Determine if error is retryable
            const isRetryable = this.isRetryableError(error);

            return {
                success: false,
                error: {
                    code: 'DAPPKIT_AUTH_ERROR',
                    message: error instanceof Error ? error.message : String(error),
                    category: this.categorizeError(error),
                    retryable: isRetryable,
                    userFriendlyMessage: this.getUserFriendlyMessage(error),
                },
            };
        }
    }

    /**
     * Check if DappKit is available and can connect
     */
    async isAvailable(): Promise<boolean> {
        try {
            if (!this.dappKitClient) {
                return false;
            }

            // Check if we're in a browser environment
            if (typeof window === 'undefined') {
                return false;
            }

            // DappKit should be available if properly initialized
            return true;
        } catch (error) {
            this.logger.debug('DappKit availability check failed', {
                error: error instanceof Error ? error.message : String(error),
            });
            return false;
        }
    }

    /**
     * Get supported wallet types
     */
    getSupportedWallets(): string[] {
        try {
            if (this.dappKitClient?.wallet?.getSupportedWallets) {
                return this.dappKitClient.wallet.getSupportedWallets();
            }
            
            // Default supported wallets
            return ['veworld', 'sync2', 'wallet-connect'];
        } catch (error) {
            this.logger.warn('Failed to get supported wallets', {
                error: error instanceof Error ? error.message : String(error),
            });
            return ['veworld', 'sync2', 'wallet-connect'];
        }
    }

    /**
     * Get current wallet state
     */
    getWalletState(): any {
        try {
            return this.dappKitClient?.wallet?.state || null;
        } catch (error) {
            this.logger.warn('Failed to get wallet state', {
                error: error instanceof Error ? error.message : String(error),
            });
            return null;
        }
    }

    /**
     * Disconnect from current wallet
     */
    async disconnect(): Promise<void> {
        try {
            if (this.dappKitClient?.wallet?.disconnect) {
                await this.dappKitClient.wallet.disconnect();
                this.logger.info('DappKit wallet disconnected');
            }
        } catch (error) {
            this.logger.warn('Failed to disconnect DappKit wallet', {
                error: error instanceof Error ? error.message : String(error),
            });
        }
    }

    /**
     * Get network chain ID based on node URL
     */
    private getNetworkChainId(): number {
        try {
            const nodeUrl = this.dappKitClient?.node?.url || '';
            
            if (nodeUrl.includes('test')) {
                return ChainId.TESTNET;
            } else if (nodeUrl.includes('solo') || nodeUrl.includes('localhost')) {
                return ChainId.SOLO;
            }
            
            return ChainId.MAINNET;
        } catch (error) {
            this.logger.warn('Failed to determine chain ID, defaulting to mainnet', {
                error: error instanceof Error ? error.message : String(error),
            });
            return ChainId.MAINNET;
        }
    }

    /**
     * Categorize error for better handling
     */
    private categorizeError(error: any): 'user_rejection' | 'network_error' | 'configuration_error' | 'unknown' {
        const message = error?.message?.toLowerCase() || '';

        if (message.includes('rejected') || message.includes('cancelled') || message.includes('user denied')) {
            return 'user_rejection';
        }
        if (message.includes('network') || message.includes('timeout') || message.includes('connection')) {
            return 'network_error';
        }
        if (message.includes('not initialized') || message.includes('configuration')) {
            return 'configuration_error';
        }

        return 'unknown';
    }

    /**
     * Check if error is retryable
     */
    private isRetryableError(error: any): boolean {
        const category = this.categorizeError(error);
        
        // User rejections are typically not retryable automatically
        if (category === 'user_rejection') {
            return false;
        }

        // Configuration errors need manual fix
        if (category === 'configuration_error') {
            return false;
        }

        // Network errors and unknown errors can be retried
        return true;
    }

    /**
     * Get user-friendly error message
     */
    private getUserFriendlyMessage(error: any): string {
        const category = this.categorizeError(error);

        switch (category) {
            case 'user_rejection':
                return 'Wallet connection was cancelled. Please try again and approve the connection.';
            case 'network_error':
                return 'Network error occurred. Please check your connection and try again.';
            case 'configuration_error':
                return 'Wallet configuration error. Please check your DappKit setup.';
            default:
                return 'Failed to connect to wallet. Please ensure your wallet is available and try again.';
        }
    }
}