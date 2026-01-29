import localConfig from './solo';
import testnetConfig from './testnet';
import mainnetConfig from './mainnet';
import { NETWORK_TYPE } from './network';

// Re-export AppConfig from appConfig.ts to maintain backward compatibility
// while avoiding circular dependency with network config files
export type { AppConfig } from './appConfig';
import type { AppConfig } from './appConfig';

export const getConfig = (env: NETWORK_TYPE): AppConfig => {
    if (env === 'solo') return localConfig;
    if (env === 'test') return testnetConfig;
    if (env === 'main') return mainnetConfig;
    throw new Error(`Unsupported NETWORK_TYPE ${env}`);
};
