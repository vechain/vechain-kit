import { ThorClient } from '@vechain/sdk-network';
import { Address } from '@vechain/sdk-core';
import { IERC20__factory } from '../contracts/index.js';
import { ITokenManager, TokenBalance, TokenInfo } from '../interfaces/index.js';
import {
    InvalidAddressError,
    ContractNotFoundError,
    ContractError,
} from '../errors/index.js';
import { isValidAddress } from '../utils/addressUtils.js';
import { formatTokenAmount } from '../utils/formattingUtils.js';
import { Cacheable } from '../utils/cache.js';
import { ILogger } from '../interfaces/index.js';
import { createLogger } from '../utils/logger.js';

/**
 * Manages ERC20 token operations for VeChain Kit
 * @implements {ITokenManager}
 */
export class TokenManager implements ITokenManager {
    private logger: ILogger;

    /**
     * Creates a new TokenManager instance
     * @param logger - Optional logger instance
     */
    constructor(logger?: ILogger) {
        this.logger = logger || createLogger('[TokenManager]');
    }

    /**
     * Gets the balance of a specific token for an account
     * @param thor - The Thor client instance
     * @param tokenAddress - The token contract address
     * @param accountAddress - The account address
     * @returns Token balance information
     * @throws {InvalidAddressError} If addresses are invalid
     * @throws {ContractNotFoundError} If token contract doesn't exist
     */
    async getBalance(
        thor: ThorClient,
        tokenAddress: string,
        accountAddress: string,
    ): Promise<TokenBalance> {
        // Validate addresses
        if (!isValidAddress(tokenAddress)) {
            throw new InvalidAddressError(tokenAddress);
        }
        if (!isValidAddress(accountAddress)) {
            throw new InvalidAddressError(accountAddress);
        }

        try {
            // Check if token contract exists
            const bytecode = await thor.accounts.getBytecode(
                Address.of(tokenAddress),
            );
            if (bytecode.toString() === '0x' || bytecode.toString() === '0x0') {
                throw new ContractNotFoundError(tokenAddress);
            }

            const token = thor.contracts.load(
                tokenAddress,
                IERC20__factory.abi,
            );

            // Get balance and decimals in parallel
            const [balance, decimals] = await Promise.all([
                token.read.balanceOf(accountAddress),
                this.getTokenDecimals(thor, tokenAddress),
            ]);

            const formatted = formatTokenAmount(balance.toString(), decimals);

            this.logger.debug('Token balance fetched', {
                tokenAddress,
                accountAddress,
                balance: balance.toString(),
                formatted,
            });

            return {
                tokenAddress,
                balance: balance.toString(),
                decimals,
                formatted,
            };
        } catch (error) {
            if (
                error instanceof InvalidAddressError ||
                error instanceof ContractNotFoundError
            ) {
                throw error;
            }
            throw new ContractError(
                `Failed to get token balance: ${
                    error instanceof Error ? error.message : 'Unknown error'
                }`,
                { tokenAddress, accountAddress },
            );
        }
    }

    /**
     * Gets token metadata information
     * @param thor - The Thor client instance
     * @param tokenAddress - The token contract address
     * @returns Token information
     * @throws {InvalidAddressError} If token address is invalid
     * @throws {ContractNotFoundError} If token contract doesn't exist
     */
    @Cacheable<TokenInfo>(30 * 60 * 1000) // Cache for 30 minutes
    async getTokenInfo(
        thor: ThorClient,
        tokenAddress: string,
    ): Promise<TokenInfo> {
        if (!isValidAddress(tokenAddress)) {
            throw new InvalidAddressError(tokenAddress);
        }

        try {
            // Check if token contract exists
            const bytecode = await thor.accounts.getBytecode(
                Address.of(tokenAddress),
            );
            if (bytecode.toString() === '0x' || bytecode.toString() === '0x0') {
                throw new ContractNotFoundError(tokenAddress);
            }

            const token = thor.contracts.load(
                tokenAddress,
                IERC20__factory.abi,
            );

            // Get all token info in parallel
            const [name, symbol, decimals, totalSupply] = await Promise.all([
                (token.read as any).name().catch(() => 'Unknown Token'),
                (token.read as any).symbol().catch(() => 'UNKNOWN'),
                (token.read as any).decimals().catch(() => 18),
                (token.read as any).totalSupply().catch(() => '0'),
            ]);

            this.logger.debug('Token info fetched', {
                tokenAddress,
                name,
                symbol,
                decimals,
            });

            return {
                address: tokenAddress,
                name,
                symbol,
                decimals,
                totalSupply: totalSupply.toString(),
            };
        } catch (error) {
            if (
                error instanceof InvalidAddressError ||
                error instanceof ContractNotFoundError
            ) {
                throw error;
            }
            throw new ContractError(
                `Failed to get token info: ${
                    error instanceof Error ? error.message : 'Unknown error'
                }`,
                { tokenAddress },
            );
        }
    }

    /**
     * Gets all token balances for an account
     * @param thor - The Thor client instance
     * @param accountAddress - The account address
     * @param tokenAddresses - Optional list of token addresses to check
     * @returns Array of token balances
     */
    async getAllBalances(
        thor: ThorClient,
        accountAddress: string,
        tokenAddresses?: string[],
    ): Promise<TokenBalance[]> {
        if (!isValidAddress(accountAddress)) {
            throw new InvalidAddressError(accountAddress);
        }

        // If no token addresses provided, return empty array
        if (!tokenAddresses || tokenAddresses.length === 0) {
            return [];
        }

        // Filter valid addresses
        const validAddresses = tokenAddresses.filter((addr) => {
            const isValid = isValidAddress(addr);
            if (!isValid) {
                this.logger.warn(`Invalid token address skipped: ${addr}`);
            }
            return isValid;
        });

        // Fetch all balances in parallel
        const balancePromises = validAddresses.map((tokenAddress) =>
            this.getBalance(thor, tokenAddress, accountAddress).catch(
                (error) => {
                    this.logger.error(
                        `Failed to get balance for token ${tokenAddress}`,
                        error,
                    );
                    return null;
                },
            ),
        );

        const results = await Promise.all(balancePromises);

        // Filter out failed requests and zero balances
        return results.filter(
            (balance): balance is TokenBalance =>
                balance !== null && balance.balance !== '0',
        );
    }

    /**
     * Gets token decimals with caching
     * @private
     */
    @Cacheable<number>(60 * 60 * 1000) // Cache for 1 hour
    private async getTokenDecimals(
        thor: ThorClient,
        tokenAddress: string,
    ): Promise<number> {
        try {
            const token = thor.contracts.load(
                tokenAddress,
                IERC20__factory.abi,
            );
            const decimalsResult = await (token.read as any).decimals();
            return Number(
                Array.isArray(decimalsResult)
                    ? decimalsResult[0]
                    : decimalsResult,
            );
        } catch {
            // Default to 18 decimals if call fails
            return 18;
        }
    }
}
