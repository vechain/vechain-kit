import { EventEmitter } from 'events';
import { ILogger } from '../../interfaces/index.js';
import { createLogger } from '../../utils/logger.js';
import type {
    ConnectionState,
    Connection,
    LoginMethod,
} from '../../types/connection.js';
import type { ConnectionEvents } from './types.js';

/**
 * Manages connection state transitions and loading states
 */
export class ConnectionStateManager extends EventEmitter<ConnectionEvents> {
    private logger: ILogger;
    private connectionState: ConnectionState = 'disconnected';
    private currentConnection: Connection | null = null;
    private loadingStates: Map<string, boolean> = new Map();

    constructor() {
        super();
        this.logger = createLogger('ConnectionStateManager');
    }

    /**
     * Get the current connection state
     */
    getConnectionState(): ConnectionState {
        return this.connectionState;
    }

    /**
     * Get the current connection information
     */
    getCurrentConnection(): Connection | null {
        return this.currentConnection;
    }

    /**
     * Check if currently connected
     */
    isConnected(): boolean {
        return (
            this.connectionState === 'connected' &&
            this.currentConnection !== null
        );
    }

    /**
     * Check if a method is currently loading
     */
    isLoading(method?: LoginMethod): boolean {
        if (method) {
            return this.loadingStates.get(method) || false;
        }
        // Check if any method is loading
        return Array.from(this.loadingStates.values()).some(Boolean);
    }

    /**
     * Set loading state for a method
     */
    setLoading(method: LoginMethod, loading: boolean): void {
        const wasLoading = this.loadingStates.get(method) || false;
        
        if (loading !== wasLoading) {
            this.loadingStates.set(method, loading);
            this.logger.debug('Loading state changed', {
                method,
                loading,
                allLoadingStates: Object.fromEntries(this.loadingStates),
            });
        }
    }

    /**
     * Clear all loading states
     */
    clearAllLoading(): void {
        const hadLoading = this.loadingStates.size > 0;
        this.loadingStates.clear();
        
        if (hadLoading) {
            this.logger.debug('All loading states cleared');
        }
    }

    /**
     * Set connection state and emit events
     */
    setConnectionState(
        state: ConnectionState,
        connection?: Connection,
        reason?: string,
    ): void {
        const previousState = this.connectionState;
        const previousConnection = this.currentConnection;

        this.connectionState = state;

        if (state === 'connected' && connection) {
            this.currentConnection = connection;
            this.logger.info('Connection established', {
                address: connection.address,
                source: connection.source,
                method: connection.method,
                chainId: connection.chainId,
            });
            this.emit('connected', connection);
        } else if (state === 'disconnected') {
            const wasConnected = previousConnection !== null;
            this.currentConnection = null;
            
            if (wasConnected) {
                this.logger.info('Connection disconnected', {
                    previousAddress: previousConnection?.address,
                    reason,
                });
                this.emit('disconnected', reason);
            }
        }

        // Emit state change if it actually changed
        if (previousState !== state) {
            this.logger.debug('Connection state changed', {
                from: previousState,
                to: state,
                hasConnection: !!this.currentConnection,
            });
            this.emit('stateChanged', state);
        }

        // Emit connection change if connection changed
        if (
            connection &&
            (!previousConnection ||
                previousConnection.address !== connection.address ||
                previousConnection.source !== connection.source)
        ) {
            this.emit('connectionChanged', connection);
        }
    }

    /**
     * Handle connection errors
     */
    handleError(error: Error, method?: LoginMethod): void {
        this.logger.error('Connection error occurred', {
            method,
            error: error.message,
            state: this.connectionState,
        });

        // Clear loading state for the specific method
        if (method) {
            this.setLoading(method, false);
        }

        this.emit('connectionError', error);
    }

    /**
     * Reset to initial state
     */
    reset(): void {
        const hadConnection = this.currentConnection !== null;
        
        this.connectionState = 'disconnected';
        this.currentConnection = null;
        this.clearAllLoading();

        if (hadConnection) {
            this.logger.info('Connection state reset');
            this.emit('disconnected', 'reset');
            this.emit('stateChanged', 'disconnected');
        }
    }

    /**
     * Get current state summary
     */
    getStateSummary(): {
        state: ConnectionState;
        connected: boolean;
        connection: Connection | null;
        loadingMethods: LoginMethod[];
        hasAnyLoading: boolean;
    } {
        return {
            state: this.connectionState,
            connected: this.isConnected(),
            connection: this.currentConnection,
            loadingMethods: Array.from(this.loadingStates.entries())
                .filter(([, loading]) => loading)
                .map(([method]) => method as LoginMethod),
            hasAnyLoading: this.isLoading(),
        };
    }
}