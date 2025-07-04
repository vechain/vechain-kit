import { ThorClient } from '@vechain/sdk-network';
import { Address } from '@vechain/sdk-core';
import { TokenManager } from './TokenManager.js';
import { ILogger, TokenBalance, TokenInfo } from '../interfaces/index.js';
import { createLogger } from '../utils/logger.js';
import { isValidAddress } from '../utils/addressUtils.js';
import { InvalidAddressError } from '../errors/index.js';

/**
 * Enhanced token balance with additional metadata
 */
export interface EnhancedTokenBalance extends TokenBalance {
    symbol?: string;
    name?: string;
    usd?: number;
}

/**
 * Token configuration for common tokens
 */
interface TokenConfig {
    address: string;
    symbol: string;
    name: string;
    decimals: number;
}

/**
 * Network-specific token configurations
 */
const NETWORK_TOKENS = {
    main: {
        VET: {
            address: '0x',
            symbol: 'VET',
            name: 'VeChain Token',
            decimals: 18,
        },
        VTHO: {
            address: '0x0000000000000000000000000000456E65726779',
            symbol: 'VTHO',
            name: 'VeThor Token',
            decimals: 18,
        },
        B3TR: {
            address: '0x5ef79995FE8a89e0812330E4378eB2660ceDe699',
            symbol: 'B3TR',
            name: 'VeBetter Token',
            decimals: 18,
        },
        VOT3: {
            address: '0xACC280010b2ee09D52897c6283e74a29190f78AD',
            symbol: 'VOT3',
            name: 'VeChain Vote Token',
            decimals: 18,
        },
    },
    test: {
        VET: {
            address: '0x',
            symbol: 'VET',
            name: 'VeChain Token',
            decimals: 18,
        },
        VTHO: {
            address: '0x0000000000000000000000000000456E65726779',
            symbol: 'VTHO',
            name: 'VeThor Token',
            decimals: 18,
        },
    },
    solo: {
        VET: {
            address: '0x',
            symbol: 'VET',
            name: 'VeChain Token',
            decimals: 18,
        },
        VTHO: {
            address: '0x0000000000000000000000000000456E65726779',
            symbol: 'VTHO',
            name: 'VeThor Token',
            decimals: 18,
        },
    },
};

/**
 * TokenWrapper provides a simplified, developer-friendly API for token operations
 *
 * Instead of passing ThorClient to every method, developers can call:
 * ```typescript
 * const balance = await tokenWrapper.getBalance(tokenAddress, userAddress);
 * ```
 */
export class TokenWrapper {
    private tokenManager: TokenManager;
    private thor: ThorClient;
    private logger: ILogger;
    private networkTokens: Record<string, TokenConfig>;

    constructor(
        tokenManager: TokenManager,
        thor: ThorClient,
        network: 'main' | 'test' | 'solo' = 'main',
    ) {
        this.tokenManager = tokenManager;
        this.thor = thor;
        this.logger = createLogger('TokenWrapper');
        this.networkTokens = NETWORK_TOKENS[network] || NETWORK_TOKENS.main;
    }

    /**
     * Get token balance with simplified API
     *
     * @param tokenAddress Token contract address or symbol (e.g., 'VET', 'VTHO', '0x...')
     * @param accountAddress Account address to check balance for
     * @returns Enhanced token balance with symbol and formatting
     */
    async getBalance(
        tokenAddress: string,
        accountAddress: string,
    ): Promise<EnhancedTokenBalance> {
        if (!isValidAddress(accountAddress)) {
            throw new InvalidAddressError(accountAddress);
        }

        try {
            // Resolve token address from symbol if needed
            const resolvedAddress = this.resolveTokenAddress(tokenAddress);

            // Handle VET native token specially
            if (
                resolvedAddress === '0x' ||
                tokenAddress.toLowerCase() === 'vet'
            ) {
                return this.getVETBalance(accountAddress);
            }

            // Get token balance using existing TokenManager
            const balance = await this.tokenManager.getBalance(
                this.thor,
                resolvedAddress,
                accountAddress,
            );

            // Get additional token info for enhanced response
            const tokenInfo = await this.tokenManager
                .getTokenInfo(this.thor, resolvedAddress)
                .catch(() => null);

            const enhanced: EnhancedTokenBalance = {
                ...balance,
                symbol: tokenInfo?.symbol || this.getTokenSymbol(tokenAddress),
                name: tokenInfo?.name || this.getTokenName(tokenAddress),
            };

            this.logger.debug('Enhanced token balance fetched', {
                tokenAddress: resolvedAddress,
                accountAddress,
                symbol: enhanced.symbol,
                formatted: enhanced.formatted,
            });

            return enhanced;
        } catch (error) {
            this.logger.error(
                'Token balance fetch failed',
                error instanceof Error ? error : new Error(String(error)),
            );
            throw error;
        }
    }

    /**
     * Get VET native token balance
     */
    private async getVETBalance(
        accountAddress: string,
    ): Promise<EnhancedTokenBalance> {
        try {
            const account = await this.thor.accounts.getAccount(
                Address.of(accountAddress),
            );
            const balance = BigInt(account.balance);
            const decimals = 18;
            const symbol = 'VET';

            // Format balance (simple division for display)
            const divisor = BigInt(10 ** decimals);
            const formatted = (balance / divisor).toString() + ' ' + symbol;

            return {
                tokenAddress: '0x',
                balance: account.balance,
                decimals,
                formatted,
                symbol,
                name: 'VeChain Token',
            };
        } catch (error) {
            this.logger.error(
                'VET balance fetch failed',
                error instanceof Error ? error : new Error(String(error)),
            );
            throw error;
        }
    }

    /**
     * Get token info with simplified API
     */
    async getTokenInfo(tokenAddress: string): Promise<TokenInfo> {
        const resolvedAddress = this.resolveTokenAddress(tokenAddress);
        return this.tokenManager.getTokenInfo(this.thor, resolvedAddress);
    }

    /**
     * Get multiple token balances efficiently
     *
     * @param tokenAddresses Array of token addresses or symbols
     * @param accountAddress Account address to check balances for
     * @returns Array of enhanced token balances
     */
    async getBalances(
        tokenAddresses: string[],
        accountAddress: string,
    ): Promise<EnhancedTokenBalance[]> {
        if (!isValidAddress(accountAddress)) {
            throw new InvalidAddressError(accountAddress);
        }

        const balancePromises = tokenAddresses.map((tokenAddress) =>
            this.getBalance(tokenAddress, accountAddress).catch((error) => {
                this.logger.warn(`Failed to get balance for ${tokenAddress}`, {
                    error: error.message,
                });
                return null;
            }),
        );

        const results = await Promise.all(balancePromises);

        // Filter out failed requests
        return results.filter(
            (balance): balance is EnhancedTokenBalance => balance !== null,
        );
    }

    /**
     * Get balances for all common tokens on the network
     */
    async getCommonTokenBalances(
        accountAddress: string,
    ): Promise<EnhancedTokenBalance[]> {
        const commonTokens = Object.keys(this.networkTokens);
        return this.getBalances(commonTokens, accountAddress);
    }

    /**
     * Resolve token address from symbol or return as-is if already an address
     */
    private resolveTokenAddress(tokenIdentifier: string): string {
        // If it looks like an address, return as-is
        if (tokenIdentifier.startsWith('0x') && tokenIdentifier.length === 42) {
            return tokenIdentifier;
        }

        // Try to resolve from known tokens
        const upperSymbol = tokenIdentifier.toUpperCase();
        const tokenConfig = this.networkTokens[upperSymbol];

        if (tokenConfig) {
            return tokenConfig.address;
        }

        // If not found and not an address, assume it's an address anyway
        if (isValidAddress(tokenIdentifier)) {
            return tokenIdentifier;
        }

        throw new Error(
            `Unknown token symbol or invalid address: ${tokenIdentifier}`,
        );
    }

    /**
     * Get token symbol from identifier
     */
    private getTokenSymbol(tokenIdentifier: string): string | undefined {
        const upperSymbol = tokenIdentifier.toUpperCase();
        return this.networkTokens[upperSymbol]?.symbol;
    }

    /**
     * Get token name from identifier
     */
    private getTokenName(tokenIdentifier: string): string | undefined {
        const upperSymbol = tokenIdentifier.toUpperCase();
        return this.networkTokens[upperSymbol]?.name;
    }

    /**
     * Add custom token configuration
     */
    addToken(symbol: string, config: TokenConfig): void {
        this.networkTokens[symbol.toUpperCase()] = config;
        this.logger.debug('Custom token added', {
            symbol,
            address: config.address,
        });
    }

    /**
     * Get all configured tokens for this network
     */
    getConfiguredTokens(): Record<string, TokenConfig> {
        return { ...this.networkTokens };
    }
}
