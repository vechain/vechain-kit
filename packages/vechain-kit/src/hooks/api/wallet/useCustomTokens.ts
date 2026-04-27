import { LocalStorageKey, useLocalStorage } from '@/hooks';
import { compareAddresses } from '@/utils';
import { useAppConfig, useVeChainKitConfig } from '@/providers';
import { type CustomTokenInfo } from '@vechain/contract-getters';

import {  getTokenInfo } from './useGetCustomTokenInfo';

export const useCustomTokens = () => {
    const [customTokens, setCustomTokens] = useLocalStorage<CustomTokenInfo[]>(
        LocalStorageKey.CUSTOM_TOKENS,
        [],
    );
    const { network } = useVeChainKitConfig();
    const config = useAppConfig();

    const addToken = async (address: CustomTokenInfo['address']) => {
        if (!isTokenIncluded(address) && !isDefaultToken(address)) {
            if (!network.nodeUrl) throw new Error('Network node URL is required');
            const tokenInfo = await getTokenInfo( address, network.nodeUrl);

            const token: CustomTokenInfo = {
                ...tokenInfo,
                address,
            };

            setCustomTokens([...customTokens, token]);
        }
    };

    const removeToken = (address: string) => {
        setCustomTokens(
            customTokens.filter((t: CustomTokenInfo) => t.address !== address),
        );
    };

    const isTokenIncluded = (address: string) => {
        return customTokens.some((t: CustomTokenInfo) =>
            compareAddresses(t.address, address),
        );
    };

    const isDefaultToken = (address: string) => {
        // Get contract addresses from config
        const defaultAddresses = {
            vet: '0x', // VET has no contract address since it's the native token
            vtho: config.vthoContractAddress,
            b3tr: config.b3trContractAddress,
            vot3: config.vot3ContractAddress,
            veDelegate: config.veDelegate,
        };

        return Object.values(defaultAddresses).includes(address);
    };

    return {
        customTokens,
        addToken,
        removeToken,
        isTokenIncluded,
        isDefaultToken,
    };
};
