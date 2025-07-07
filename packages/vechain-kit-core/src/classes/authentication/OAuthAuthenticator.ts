import { ILogger } from '../../interfaces/index.js';
import { createLogger } from '../../utils/logger.js';
import type {
    LoginResult,
    Connection,
} from '../../types/connection.js';
import type { OAuthAuthParams, OAuthProvider } from './types.js';

/**
 * OAuth authentication handler using Privy
 */
export class OAuthAuthenticator {
    private logger: ILogger;

    constructor(private privyClient: any) {
        this.logger = createLogger('OAuthAuthenticator');
    }

    /**
     * Execute OAuth authentication flow
     */
    async executeOAuthFlow(
        params: OAuthAuthParams,
        sessionId: string,
    ): Promise<LoginResult> {
        if (!this.privyClient) {
            throw new Error('Privy client not available');
        }

        try {
            // OAuth flow - UI layer should handle redirects/popups
            // Generate OAuth URL that UI can use for redirect
            const result = await this.privyClient.auth.oauth.generateURL(
                params.provider,
                params.redirectUrl || 'http://localhost:3000',
            );

            this.logger.info('OAuth URL generated', {
                provider: params.provider,
                sessionId,
            });

            // Return OAuth URL for UI to handle redirect
            return {
                success: false,
                requiresVerification: true,
                verificationData: {
                    authUrl: result.url,
                },
            };
        } catch (error) {
            this.logger.error(
                `OAuth flow failed for ${params.provider} (session: ${sessionId})`,
                error instanceof Error ? error : new Error(String(error)),
            );
            throw error;
        }
    }

    /**
     * Complete OAuth flow after redirect
     */
    async completeOAuthFlow(
        provider: OAuthProvider,
        authorizationCode: string,
        chainId: number,
    ): Promise<LoginResult> {
        if (!this.privyClient) {
            throw new Error('Privy client not available');
        }

        try {
            const result = await this.privyClient.auth.oauth.loginWithCode(
                authorizationCode,
                '',
                provider,
            );

            // Create embedded wallet if user doesn't have one
            let walletAddress: string | undefined;
            const walletAccount = result.user.linked_accounts?.find(
                (acc: any) => acc.type === 'wallet',
            );
            if (walletAccount && 'address' in walletAccount) {
                walletAddress = walletAccount.address;
            }

            if (!walletAddress) {
                const walletResult =
                    await this.privyClient.embeddedWallet.create({});
                const newWalletAccount =
                    walletResult.user.linked_accounts?.find(
                        (acc: any) => acc.type === 'wallet',
                    );
                if (newWalletAccount && 'address' in newWalletAccount) {
                    walletAddress = newWalletAccount.address;
                }
            }

            if (!walletAddress) {
                throw new Error('Failed to create or find wallet address');
            }

            const connection: Connection = {
                address: walletAddress,
                chainId,
                source: 'privy',
                method: 'oauth',
                timestamp: Date.now(),
                metadata: { provider, userId: result.user.id },
            };

            this.logger.info('OAuth authentication successful', {
                provider,
                address: walletAddress,
            });

            return {
                success: true,
                connection,
            };
        } catch (error) {
            this.logger.error(
                `OAuth completion failed for ${provider}`,
                error instanceof Error ? error : new Error(String(error)),
            );
            throw error;
        }
    }
}