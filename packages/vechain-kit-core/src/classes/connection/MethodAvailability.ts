import { ILogger } from '../../interfaces/index.js';
import { createLogger } from '../../utils/logger.js';
import type { LoginMethod } from '../../types/connection.js';
import type { ConnectionConfig } from './types.js';

/**
 * Checks availability of different login methods based on configuration
 */
export class MethodAvailability {
    private logger: ILogger;
    private config: ConnectionConfig;

    constructor(config: ConnectionConfig) {
        this.logger = createLogger('MethodAvailability');
        this.config = config;
    }

    /**
     * Get enabled login methods based on configuration
     */
    getEnabledMethods(): LoginMethod[] {
        const availableMethods = this.config.enabledMethods.filter((method) =>
            this.isMethodAvailable(method),
        );

        this.logger.debug('Enabled methods determined', {
            configured: this.config.enabledMethods,
            available: availableMethods,
            unavailable: this.config.enabledMethods.filter(
                (method) => !this.isMethodAvailable(method),
            ),
        });

        return availableMethods;
    }

    /**
     * Check if a specific login method is available
     */
    isMethodAvailable(method: LoginMethod): boolean {
        const available = this.checkMethodRequirements(method);

        if (!available) {
            this.logger.debug('Method not available', {
                method,
                reason: this.getUnavailabilityReason(method),
            });
        }

        return available;
    }

    /**
     * Get detailed availability status for all methods
     */
    getMethodsStatus(): Record<
        LoginMethod,
        {
            enabled: boolean;
            available: boolean;
            reason?: string;
        }
    > {
        const allMethods: LoginMethod[] = [
            'email',
            'google',
            'oauth',
            'dappkit',
        ];

        const status: Record<string, any> = {};

        for (const method of allMethods) {
            const enabled = this.config.enabledMethods.includes(method);
            const available = this.isMethodAvailable(method);

            status[method] = {
                enabled,
                available,
                reason: !available
                    ? this.getUnavailabilityReason(method)
                    : undefined,
            };
        }

        return status as Record<
            LoginMethod,
            {
                enabled: boolean;
                available: boolean;
                reason?: string;
            }
        >;
    }

    /**
     * Update configuration
     */
    updateConfig(config: Partial<ConnectionConfig>): void {
        this.config = { ...this.config, ...config };
        this.logger.debug('Configuration updated', {
            enabledMethods: this.config.enabledMethods,
        });
    }

    /**
     * Check if method requirements are met
     */
    private checkMethodRequirements(method: LoginMethod): boolean {
        switch (method) {
            case 'email':
            case 'google':
            case 'oauth':
                return !!this.config.privyAppId;

            case 'dappkit':
                return !!this.config.dappKitConfig?.nodeUrl;

            default:
                return false;
        }
    }

    /**
     * Get reason why a method is unavailable
     */
    private getUnavailabilityReason(method: LoginMethod): string {
        switch (method) {
            case 'email':
            case 'google':
            case 'oauth':
                return this.config.privyAppId
                    ? 'Privy client not initialized'
                    : 'Privy app ID not configured';

            case 'dappkit':
                return this.config.dappKitConfig?.nodeUrl
                    ? 'DappKit client not initialized'
                    : 'DappKit configuration missing';

            default:
                return 'Unknown method';
        }
    }

    /**
     * Validate configuration
     */
    validateConfig(): {
        valid: boolean;
        warnings: string[];
        errors: string[];
    } {
        const warnings: string[] = [];
        const errors: string[] = [];

        // Check if any methods are enabled
        if (!this.config.enabledMethods.length) {
            warnings.push('No login methods enabled');
        }

        // Check for enabled methods without proper configuration
        for (const method of this.config.enabledMethods) {
            if (!this.isMethodAvailable(method)) {
                warnings.push(
                    `Method '${method}' enabled but not available: ${this.getUnavailabilityReason(
                        method,
                    )}`,
                );
            }
        }

        // Check for conflicting configurations
        const hasPrivyMethods = this.config.enabledMethods.some((m) =>
            ['email', 'google', 'oauth'].includes(m),
        );
        const hasDappKitMethods = this.config.enabledMethods.some((m) =>
            m === 'dappkit',
        );

        if (hasPrivyMethods && !this.config.privyAppId) {
            errors.push('Privy methods enabled but privyAppId not configured');
        }

        if (hasDappKitMethods && !this.config.dappKitConfig?.nodeUrl) {
            errors.push(
                'DappKit methods enabled but dappKitConfig.nodeUrl not configured',
            );
        }

        const valid = errors.length === 0;

        if (!valid || warnings.length > 0) {
            this.logger.debug('Configuration validation completed', {
                valid,
                warnings,
                errors,
            });
        }

        return { valid, warnings, errors };
    }
}
