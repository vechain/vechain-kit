import { LocalStorageKey, useLocalStorage } from '@/hooks';
import { compareAddresses } from '@/utils';
import { useVeChainKitConfig } from '@/providers';
import { getConfig } from '@/config';
import {
    TOKEN_REGISTRY_BASE_URL,
    TOKEN_REGISTRY_PLACEHOLDER_ICON_FILE,
} from '@/utils/urls';
import { type CustomTokenInfo as ContractCustomTokenInfo } from '@vechain/contract-getters';

import { getTokenInfo } from './useGetCustomTokenInfo';

export type CustomTokenInfo = ContractCustomTokenInfo & {
    /**
     * Optional icon URL for UI display (not provided by contract-getters).
     */
    icon?: string;
};

const TOKEN_REGISTRY_PLACEHOLDER_ICON_URL = new URL(
    `assets/${TOKEN_REGISTRY_PLACEHOLDER_ICON_FILE}`,
    TOKEN_REGISTRY_BASE_URL,
).href;

export const useCustomTokens = () => {
    const [customTokens, setCustomTokens] = useLocalStorage<CustomTokenInfo[]>(
        LocalStorageKey.CUSTOM_TOKENS,
        [],
    );
    const { network } = useVeChainKitConfig();

    const addToken = async (address: CustomTokenInfo['address']) => {
        if (!isTokenIncluded(address) && !isDefaultToken(address)) {
            if (!network.nodeUrl)
                throw new Error('Network node URL is required');
            const tokenInfo = await getTokenInfo(address, network.nodeUrl);

            const token: CustomTokenInfo = {
                ...tokenInfo,
                address,
                icon: TOKEN_REGISTRY_PLACEHOLDER_ICON_URL, // TODO: This is a placeholder; should be replaced with a proper token icon resolution strategy
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
        const contractAddresses = {
            vet: '0x', // VET has no contract address since it's the native token
            vtho: getConfig(network.type).vthoContractAddress,
            b3tr: getConfig(network.type).b3trContractAddress,
            vot3: getConfig(network.type).vot3ContractAddress,
            veDelegate: getConfig(network.type).veDelegate,
        };

        return Object.values(contractAddresses).includes(address);
    };

    return {
        customTokens,
        addToken,
        removeToken,
        isTokenIncluded,
        isDefaultToken,
    };
};
