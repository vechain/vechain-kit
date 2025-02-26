import { useConnex, useLocalStorage } from '@/hooks';
import {
    CustomTokenInfo,
    getTokenInfo,
} from '../utility/useGetCustomTokenInfo';
import { compareAddresses } from '@/utils';

export const useCustomTokens = () => {
    const [customTokens, setCustomTokens] = useLocalStorage<CustomTokenInfo[]>(
        'vechain_kit_custom_tokens',
        [],
    );
    const { thor } = useConnex();

    const addToken = async (address: CustomTokenInfo['address']) => {
        if (!isTokenIncluded(address)) {
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

    return {
        customTokens,
        addToken,
        removeToken,
        isTokenIncluded,
    };
};
