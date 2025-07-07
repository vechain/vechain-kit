import { ILogger } from '../../interfaces/index.js';
import { createLogger } from '../../utils/logger.js';
import type { Connection } from '../../types/connection.js';
import type { ConnectionCacheConfig } from './types.js';

/**
 * Cached connection data structure
 */
interface CachedConnection {
    connection: Connection;
    timestamp: number;
    source: string;
}

/**
 * Manages connection caching using localStorage or memory fallback
 */
export class ConnectionCache {
    private logger: ILogger;
    private cacheKey: string;
    private cacheTTL: number;
    private enabled: boolean;
    private memoryCache: CachedConnection | null = null;

    constructor(config: ConnectionCacheConfig) {
        this.logger = createLogger('ConnectionCache');
        this.enabled = config.enabled && this.isStorageAvailable();
        this.cacheKey = config.key || 'vechain_kit_connection';
        this.cacheTTL = (config.ttlHours || 24) * 60 * 60 * 1000;

        if (this.enabled) {
            this.logger.debug('Connection cache initialized', {
                cacheKey: this.cacheKey,
                ttlHours: config.ttlHours,
                storageType: 'localStorage',
            });
        } else {
            this.logger.debug('Connection cache disabled or localStorage unavailable');
        }
    }

    /**
     * Load cached connection if available and valid
     */
    loadConnection(): Connection | null {
        if (!this.enabled) return null;

        try {
            // Try localStorage first
            if (typeof window !== 'undefined' && window.localStorage) {
                const cached = window.localStorage.getItem(this.cacheKey);
                if (cached) {
                    const parsed = JSON.parse(cached) as CachedConnection;
                    if (this.isValid(parsed)) {
                        this.logger.debug('Loaded connection from localStorage cache', {
                            address: parsed.connection.address,
                            source: parsed.connection.source,
                            age: Date.now() - parsed.timestamp,
                        });
                        return parsed.connection;
                    } else {
                        this.logger.debug('Cached connection expired, removing');
                        window.localStorage.removeItem(this.cacheKey);
                    }
                }
            }

            // Fallback to memory cache
            if (this.memoryCache && this.isValid(this.memoryCache)) {
                this.logger.debug('Loaded connection from memory cache', {
                    address: this.memoryCache.connection.address,
                    source: this.memoryCache.connection.source,
                });
                return this.memoryCache.connection;
            }
        } catch (error) {
            this.logger.warn('Failed to load cached connection', {
                error: error instanceof Error ? error.message : String(error),
            });
            this.clearCache();
        }

        return null;
    }

    /**
     * Save connection to cache
     */
    saveConnection(connection: Connection): void {
        if (!this.enabled) return;

        const cached: CachedConnection = {
            connection,
            timestamp: Date.now(),
            source: 'connectionManager',
        };

        try {
            // Save to localStorage if available
            if (typeof window !== 'undefined' && window.localStorage) {
                window.localStorage.setItem(this.cacheKey, JSON.stringify(cached));
                this.logger.debug('Saved connection to localStorage cache', {
                    address: connection.address,
                    source: connection.source,
                });
            }

            // Always save to memory as fallback
            this.memoryCache = cached;
        } catch (error) {
            this.logger.warn('Failed to save connection to cache', {
                error: error instanceof Error ? error.message : String(error),
            });
        }
    }

    /**
     * Clear cached connection
     */
    clearCache(): void {
        try {
            // Clear localStorage
            if (typeof window !== 'undefined' && window.localStorage) {
                window.localStorage.removeItem(this.cacheKey);
            }

            // Clear memory cache
            this.memoryCache = null;

            this.logger.debug('Connection cache cleared');
        } catch (error) {
            this.logger.warn('Failed to clear connection cache', {
                error: error instanceof Error ? error.message : String(error),
            });
        }
    }

    /**
     * Check if cached connection is still valid
     */
    private isValid(cached: CachedConnection): boolean {
        const age = Date.now() - cached.timestamp;
        const isExpired = age > this.cacheTTL;

        if (isExpired) {
            this.logger.debug('Cached connection expired', {
                age,
                ttl: this.cacheTTL,
                address: cached.connection.address,
            });
            return false;
        }

        // Validate connection structure
        if (!cached.connection?.address || !cached.connection?.source) {
            this.logger.debug('Invalid cached connection structure');
            return false;
        }

        return true;
    }

    /**
     * Check if localStorage is available
     */
    private isStorageAvailable(): boolean {
        try {
            if (typeof window === 'undefined' || !window.localStorage) {
                return false;
            }

            const testKey = '__vechain_storage_test__';
            window.localStorage.setItem(testKey, 'test');
            window.localStorage.removeItem(testKey);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Get cache statistics
     */
    getCacheInfo(): {
        enabled: boolean;
        hasCache: boolean;
        cacheAge?: number;
        source?: string;
    } {
        if (!this.enabled) {
            return { enabled: false, hasCache: false };
        }

        let cacheData: CachedConnection | null = null;

        // Check localStorage first
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                const cached = window.localStorage.getItem(this.cacheKey);
                if (cached) {
                    cacheData = JSON.parse(cached) as CachedConnection;
                }
            }
        } catch {
            // Ignore errors
        }

        // Fallback to memory cache
        if (!cacheData) {
            cacheData = this.memoryCache;
        }

        if (cacheData && this.isValid(cacheData)) {
            return {
                enabled: true,
                hasCache: true,
                cacheAge: Date.now() - cacheData.timestamp,
                source: cacheData.connection.source,
            };
        }

        return { enabled: true, hasCache: false };
    }
}