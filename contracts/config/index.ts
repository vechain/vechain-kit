import testnetConfig from './testnet';
import mainnetConfig from './mainnet';
import hardhatConfig from './hardhat';

export type AppConfig = {
    x2EarnAppsContractAddress: string;
    newsContractAddress: string;
};

export const getConfig = (env: string): AppConfig => {
    if (env === 'vechain_testnet') return testnetConfig;
    if (env === 'vechain_mainnet') return mainnetConfig;
    if (env === 'hardhat' || env === 'vechain_solo') return hardhatConfig;
    throw new Error(`Unsupported network ${env}`);
};
