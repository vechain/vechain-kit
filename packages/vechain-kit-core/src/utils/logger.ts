import { ILogger } from '../interfaces/index.js';

export enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
    NONE = 4,
}

/**
 * Default logger implementation for VeChain Kit
 * @implements {ILogger}
 */
export class Logger implements ILogger {
    private level: LogLevel;
    private prefix: string;

    constructor(
        prefix: string = '[VeChainKit]',
        level: LogLevel = LogLevel.WARN,
    ) {
        this.prefix = prefix;
        this.level = level;
    }

    debug(message: string, ...args: unknown[]): void {
        if (this.level <= LogLevel.DEBUG) {
            console.debug(`${this.prefix} DEBUG:`, message, ...args);
        }
    }

    info(message: string, ...args: unknown[]): void {
        if (this.level <= LogLevel.INFO) {
            console.info(`${this.prefix} INFO:`, message, ...args);
        }
    }

    warn(message: string, ...args: unknown[]): void {
        if (this.level <= LogLevel.WARN) {
            console.warn(`${this.prefix} WARN:`, message, ...args);
        }
    }

    error(message: string, ...args: unknown[]): void {
        if (this.level <= LogLevel.ERROR) {
            console.error(`${this.prefix} ERROR:`, message, ...args);
        }
    }

    setLevel(level: LogLevel): void {
        this.level = level;
    }

    getLevel(): LogLevel {
        return this.level;
    }
}

/**
 * No-op logger for production builds
 */
export class NoOpLogger implements ILogger {
    debug(_message: string, ..._args: unknown[]): void {
        // No-op
    }

    info(_message: string, ..._args: unknown[]): void {
        // No-op
    }

    warn(_message: string, ..._args: unknown[]): void {
        // No-op
    }

    error(_message: string, ..._args: unknown[]): void {
        // No-op
    }
}

/**
 * Creates a logger instance based on environment
 */
export function createLogger(prefix?: string): ILogger {
    if (process.env.NODE_ENV === 'production') {
        return new NoOpLogger();
    }
    return new Logger(prefix);
}
