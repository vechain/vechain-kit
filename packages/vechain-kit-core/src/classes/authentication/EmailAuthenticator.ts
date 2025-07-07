import { ILogger } from '../../interfaces/index.js';
import { createLogger } from '../../utils/logger.js';
import type {
    LoginResult,
    Connection,
    AuthError,
} from '../../types/connection.js';
import type { EmailAuthParams } from './types.js';

/**
 * Email authentication handler using Privy
 */
export class EmailAuthenticator {
    private logger: ILogger;

    constructor(private privyClient: any) {
        this.logger = createLogger('EmailAuthenticator');
    }

    /**
     * Send email verification code
     */
    async sendVerificationCode(email: string, sessionId: string): Promise<void> {
        if (!this.privyClient) {
            throw new Error('Privy client not available');
        }

        try {
            await this.privyClient.auth.email.sendCode(email);

            this.logger.info('Email verification code sent', {
                email,
                sessionId,
            });
        } catch (error) {
            this.logger.error(
                `Failed to send email verification for ${email} (session: ${sessionId})`,
                error instanceof Error ? error : new Error(String(error)),
            );
            throw error;
        }
    }

    /**
     * Verify email code and complete authentication
     */
    async verifyEmailAndComplete(
        email: string,
        code: string,
        sessionId: string,
        chainId: number,
    ): Promise<LoginResult> {
        if (!this.privyClient) {
            throw new Error('Privy client not available');
        }

        try {
            const result = await this.privyClient.auth.email.loginWithCode(
                email,
                code,
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
                method: 'email',
                timestamp: Date.now(),
                metadata: { email, userId: result.user.id },
            };

            this.logger.info('Email authentication successful', {
                email,
                sessionId,
                address: walletAddress,
            });

            return {
                success: true,
                connection,
            };
        } catch (error) {
            this.logger.error(
                `Email verification failed for ${email} (session: ${sessionId})`,
                error instanceof Error ? error : new Error(String(error)),
            );
            throw error;
        }
    }
}