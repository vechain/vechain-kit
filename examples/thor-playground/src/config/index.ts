import localConfig from './solo';
import testnetConfig from './testnet';
import mainnetConfig from './mainnet';

export const getConfig = (env: 'solo' | 'test' | 'main') => {
    if (env === 'solo') return localConfig;
    if (env === 'test') return testnetConfig;
    if (env === 'main') return mainnetConfig;
    throw new Error(`Unsupported NETWORK_TYPE ${env}`);
};

export const weAreTestersAddress =
    '0xf077b491b355E64048cE21E3A6Fc4751eEeA77fa' as `0x${string}`;
