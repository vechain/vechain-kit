import { createContext, useContext, ReactNode } from 'react';
import { AppConfig } from '@/config';
import { NETWORK_TYPE } from '@/config/network';
import localConfig from '@/config/solo';
import testnetConfig from '@/config/testnet';
import mainnetConfig from '@/config/mainnet';

type ConfigContextType = {
    getConfig: (env: NETWORK_TYPE) => AppConfig;
};

const ConfigContext = createContext<ConfigContextType | null>(null);

export const useConfig = () => {
    const context = useContext(ConfigContext);
    if (!context) {
        throw new Error('useConfig must be used within ConfigProvider');
    }
    return context;
};

export const ConfigProvider = ({ children }: { children: ReactNode }) => {
    const getConfig = (env: NETWORK_TYPE): AppConfig => {
        if (env === 'solo') return localConfig;
        if (env === 'test') return testnetConfig;
        if (env === 'main') return mainnetConfig;
        throw new Error(`Unsupported NETWORK_TYPE ${env}`);
    };

    return (
        <ConfigContext.Provider value={{ getConfig }}>
            {children}
        </ConfigContext.Provider>
    );
};
