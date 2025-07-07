import { ILogger } from '../../interfaces/index.js';
import { createLogger } from '../../utils/logger.js';
import type { AuthProviderConfig } from './config.js';

/**
 * Handles initialization of external authentication clients
 */
export class ClientInitializer {
    private logger: ILogger;

    constructor(private config: AuthProviderConfig) {
        this.logger = createLogger('ClientInitializer');
    }

    /**
     * Initialize Privy client for browser environment
     */
    async initializePrivyClient(): Promise<any> {
        try {
            if (!this.config.privy?.appId) {
                throw new Error('Privy app ID is required');
            }

            const { default: Privy } = await import('@privy-io/js-sdk-core');

            const privyClient = new Privy({
                appId: this.config.privy.appId,
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

            this.logger.info('Privy client SDK initialized', {
                appId: this.config.privy.appId,
            });

            return privyClient;
        } catch (error) {
            this.logger.error(
                'Failed to initialize Privy client',
                error instanceof Error ? error : new Error(String(error)),
            );
            throw error;
        }
    }

    /**
     * Initialize DappKit client using @vechain/dapp-kit
     */
    async initializeDappKitClient(): Promise<any> {
        try {
            if (!this.config.dappKit?.nodeUrl) {
                throw new Error('DappKit nodeUrl is required');
            }

            // Dynamic import to avoid breaking environments without DappKit
            const importFn = new Function(
                'specifier',
                'return import(specifier)',
            );
            const { DAppKit } = await importFn('@vechain/dapp-kit');

            // Initialize DappKit with configuration
            const dappKit = new DAppKit({
                node: this.config.dappKit.nodeUrl,
                usePersistence: true,
                logLevel: 'INFO',
                allowedWallets: this.config.dappKit.supportedWallets || [
                    'veworld',
                    'sync2',
                    'wallet-connect',
                ],
                walletConnectOptions: this.config.dappKit.walletConnectProjectId
                    ? {
                          projectId: this.config.dappKit.walletConnectProjectId,
                          metadata: {
                              name: 'VeChain Kit DApp',
                              description: 'VeChain Kit Integration',
                              url:
                                  typeof window !== 'undefined'
                                      ? window.location.origin
                                      : '',
                              icons: [],
                          },
                      }
                    : undefined,
            });

            this.logger.info('DappKit client initialized successfully', {
                nodeUrl: this.config.dappKit.nodeUrl,
                supportedWallets: this.config.dappKit.supportedWallets || [
                    'veworld',
                    'sync2',
                    'wallet-connect',
                ],
                hasWalletConnect: !!this.config.dappKit.walletConnectProjectId,
            });

            return dappKit;
        } catch (error) {
            this.logger.error(
                'Failed to initialize DappKit client - ensure @vechain/dapp-kit is available',
                error instanceof Error ? error : new Error(String(error)),
            );
            throw error;
        }
    }
}
