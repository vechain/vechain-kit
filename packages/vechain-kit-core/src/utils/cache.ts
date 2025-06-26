import { ICache } from '../interfaces/index.js';

interface CacheEntry<T> {
    value: T;
    expires: number;
}

/**
 * In-memory cache implementation with TTL support
 * @implements {ICache}
 */
export class MemoryCache<T> implements ICache<T> {
    private cache = new Map<string, CacheEntry<T>>();
    private timers = new Map<string, NodeJS.Timeout>();

    /**
     * Gets a value from the cache
     * @param key - The cache key
     * @returns The cached value or undefined if not found or expired
     */
    get(key: string): T | undefined {
        const entry = this.cache.get(key);
        if (!entry) {
            return undefined;
        }

        if (Date.now() > entry.expires) {
            this.delete(key);
            return undefined;
        }

        return entry.value;
    }

    /**
     * Sets a value in the cache
     * @param key - The cache key
     * @param value - The value to cache
     * @param ttl - Time to live in milliseconds (default: 5 minutes)
     */
    set(key: string, value: T, ttl: number = 5 * 60 * 1000): void {
        // Clear existing timer if any
        this.clearTimer(key);

        const expires = Date.now() + ttl;
        this.cache.set(key, { value, expires });

        // Set auto-cleanup timer
        const timer = setTimeout(() => {
            this.delete(key);
        }, ttl);

        this.timers.set(key, timer);
    }

    /**
     * Checks if a key exists in the cache
     * @param key - The cache key
     * @returns True if the key exists and hasn't expired
     */
    has(key: string): boolean {
        const value = this.get(key);
        return value !== undefined;
    }

    /**
     * Deletes a key from the cache
     * @param key - The cache key
     */
    delete(key: string): void {
        this.cache.delete(key);
        this.clearTimer(key);
    }

    /**
     * Clears all entries from the cache
     */
    clear(): void {
        this.cache.clear();
        this.timers.forEach((timer) => clearTimeout(timer));
        this.timers.clear();
    }

    /**
     * Gets the current size of the cache
     */
    get size(): number {
        return this.cache.size;
    }

    /**
     * Clears the timer for a specific key
     * @private
     */
    private clearTimer(key: string): void {
        const timer = this.timers.get(key);
        if (timer) {
            clearTimeout(timer);
            this.timers.delete(key);
        }
    }
}

/**
 * Creates a cache key for consistent caching
 */
export function createCacheKey(
    ...parts: (string | number | boolean)[]
): string {
    return parts.map((part) => String(part)).join(':');
}

/**
 * Decorator for caching method results
 */
export function Cacheable<T>(ttl?: number) {
    const cache = new MemoryCache<T>();

    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor,
    ) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            const key = createCacheKey(
                propertyKey,
                ...args.map((arg) => JSON.stringify(arg)),
            );

            // Check cache first
            const cached = cache.get(key);
            if (cached !== undefined) {
                return cached;
            }

            // Execute method and cache result
            const result = await originalMethod.apply(this, args);
            cache.set(key, result, ttl);
            return result;
        };

        return descriptor;
    };
}
