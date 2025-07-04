import { NETWORK_TYPE, getConfig, type AppConfig } from '../config/index.js';
import { INetworkManager, NetworkInfo } from '../interfaces/index.js';
import { InvalidNetworkError } from '../errors/index.js';

/**
 * Manages network configuration and switching for VeChain Kit
 * @implements {INetworkManager}
 */
export class NetworkManager implements INetworkManager {
    private _currentNetwork: NETWORK_TYPE;
    private _config: AppConfig;

    /**
     * Creates a new NetworkManager instance
     * @param network - The initial network to connect to
     * @throws {InvalidNetworkError} If the network is not supported
     */
    constructor(network: NETWORK_TYPE = 'main') {
        this.validateNetwork(network);
        this._currentNetwork = network;
        this._config = getConfig(network);
    }

    /**
     * Gets the current active network
     */
    get currentNetwork(): NETWORK_TYPE {
        return this._currentNetwork;
    }

    /**
     * Gets the current network configuration
     */
    get config(): AppConfig {
        return this._config;
    }

    /**
     * Switches to a different network
     * @param network - The network to switch to
     * @throws {InvalidNetworkError} If the network is not supported
     */
    switchNetwork(network: NETWORK_TYPE): void {
        this.validateNetwork(network);
        this._currentNetwork = network;
        this._config = getConfig(network);
    }

    /**
     * Gets the RPC URL for the current network
     */
    getRpcUrl(): string {
        return this._config.network.delegateUrl;
    }

    /**
     * Gets the node URL for the current network
     */
    getNodeUrl(): string {
        return this._config.network.nodeUrl;
    }

    /**
     * Gets the contract addresses for the current network
     */
    getContractAddresses(): AppConfig['contracts'] {
        return this._config.contracts;
    }

    /**
     * Gets comprehensive network information
     */
    getNetworkInfo(): NetworkInfo {
        return {
            type: this._currentNetwork,
            name: this._config.network.name,
            chainId: this._config.network.chainId.toString(),
            genesis: this._config.network.genesis,
        };
    }

    /**
     * Validates if a network is supported
     * @private
     */
    private validateNetwork(network: string): asserts network is NETWORK_TYPE {
        const validNetworks: NETWORK_TYPE[] = ['main', 'test', 'solo'];
        if (!validNetworks.includes(network as NETWORK_TYPE)) {
            throw new InvalidNetworkError(network);
        }
    }
}
