import type { Network } from '../../config/network.js';
import type { WalletProvider } from './types.js';

/**
 * Browser authentication provider configuration
 */
export interface AuthProviderConfig {
    privy?: {
        appId: string;
        clientId?: string;
        environment?: 'production' | 'development';
    };
    dappKit?: {
        nodeUrl: string;
        walletConnectProjectId?: string;
        supportedWallets?: WalletProvider[];
    };
    crossApp?: {
        appId: string;
        allowedApps?: string[];
        environment?: 'production' | 'development';
    };
    analytics?: {
        enabled: boolean;
        trackingId?: string;
    };
    network?: Network;
}