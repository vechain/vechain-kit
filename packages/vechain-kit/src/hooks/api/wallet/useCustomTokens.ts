import { useLocalStorage } from '@/hooks';
import {
    CustomTokenInfo,
    getTokenInfo,
} from '../utility/useGetCustomTokenInfo';
import { compareAddresses } from '@/utils';
import { useVeChainKitConfig } from '@/providers';
import { getConfig } from '@/config';
import { useThor } from '@vechain/dapp-kit-react';

export const useCustomTokens = () => {
    const [customTokens, setCustomTokens] = useLocalStorage<CustomTokenInfo[]>(
        'vechain_kit_custom_tokens',
        [],
    );
    const thor = useThor();
    const { network } = useVeChainKitConfig();

    const addToken = async (address: CustomTokenInfo['address']) => {
        if (!isTokenIncluded(address) && !isDefaultToken(address)) {
            const tokenInfo = await getTokenInfo(thor, address);

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
