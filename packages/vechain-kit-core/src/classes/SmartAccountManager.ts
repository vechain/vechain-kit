import { ThorClient } from '@vechain/sdk-network';
import { Address } from '@vechain/sdk-core';
import { SimpleAccountFactory__factory } from '../contracts/index.js';
import { INetworkManager } from '../interfaces/index.js';
import { ISmartAccountManager, SmartAccountInfo } from '../interfaces/index.js';
import { 
  SmartAccountError, 
  SmartAccountFactoryError,
  InvalidAddressError,
  ContractNotFoundError 
} from '../errors/index.js';
import { isValidAddress } from '../utils/addressUtils.js';

/**
 * Manages smart account operations for VeChain Kit
 * @implements {ISmartAccountManager}
 */
export class SmartAccountManager implements ISmartAccountManager {
  private networkManager: INetworkManager;

  /**
   * Creates a new SmartAccountManager instance
   * @param networkManager - The network manager instance
   */
  constructor(networkManager: INetworkManager) {
    this.networkManager = networkManager;
  }

  /**
   * Gets smart account information for a given owner address
   * @param thor - The Thor client instance
   * @param ownerAddress - The owner's wallet address
   * @returns Smart account information including deployment status
   * @throws {InvalidAddressError} If the owner address is invalid
   * @throws {SmartAccountFactoryError} If factory interaction fails
   */
  async getSmartAccount(
    thor: ThorClient,
    ownerAddress: string,
  ): Promise<SmartAccountInfo> {
    // Validate owner address
    if (!isValidAddress(ownerAddress)) {
      throw new InvalidAddressError(ownerAddress);
    }

    const factoryAddress = this.getFactoryAddress();
    
    try {
      const factory = thor.contracts.load(
        factoryAddress,
        SimpleAccountFactory__factory.abi,
      );

      // Get the smart account address
      const result = await factory.read.getAccountAddress(ownerAddress);
      const accountAddress = result[0].toString();

      // Validate returned address
      if (!isValidAddress(accountAddress)) {
        throw new SmartAccountFactoryError(
          'Factory returned invalid address',
          factoryAddress
        );
      }

      // Check if it's deployed by checking if it has code
      const bytecode = await thor.accounts.getBytecode(Address.of(accountAddress));
      const isDeployed = bytecode.toString() !== '0x' && bytecode.toString() !== '0x0';

      return {
        address: accountAddress,
        isDeployed,
        owner: ownerAddress,
      };
    } catch (error) {
      if (error instanceof SmartAccountError) {
        throw error;
      }
      throw new SmartAccountFactoryError(
        `Failed to get smart account: ${error instanceof Error ? error.message : 'Unknown error'}`,
        factoryAddress
      );
    }
  }

  /**
   * Gets the version of a deployed smart account
   * @param thor - The Thor client instance
   * @param accountAddress - The smart account address
   * @returns The version string or null if not available
   * @throws {InvalidAddressError} If the account address is invalid
   */
  async getAccountVersion(
    thor: ThorClient,
    accountAddress: string,
  ): Promise<string | null> {
    if (!isValidAddress(accountAddress)) {
      throw new InvalidAddressError(accountAddress);
    }

    try {
      // Check if account has code first
      const bytecode = await thor.accounts.getBytecode(Address.of(accountAddress));
      if (bytecode.toString() === '0x' || bytecode.toString() === '0x0') {
        return null;
      }

      const account = thor.contracts.load(
        accountAddress, 
        SimpleAccountFactory__factory.abi
      );
      const versionResult = await account.read.version();
      return Array.isArray(versionResult) ? versionResult[0].toString() : versionResult.toString();
    } catch (error) {
      // Account might not have version method or might not be a smart account
      return null;
    }
  }

  /**
   * Gets the factory contract address for the current network
   * @returns The factory contract address
   * @throws {ContractNotFoundError} If factory address is not configured
   */
  getFactoryAddress(): string {
    const contracts = this.networkManager.getContractAddresses();
    const address = contracts?.SimpleAccountFactory;
    if (!address) {
      throw new ContractNotFoundError('SimpleAccountFactory');
    }
    return address;
  }
}