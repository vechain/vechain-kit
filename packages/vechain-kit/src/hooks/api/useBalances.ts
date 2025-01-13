import { useAccountBalance } from './';
import {
    useGetB3trBalance,
    useGetVot3Balance,
    useGetVeDelegateBalance,
    useGetTokenUsdPrice,
} from './';
import { ethers } from 'ethers';
import { useWallet } from '../';

export const useBalances = () => {
    const { selectedAccount } = useWallet();
    const { data: vetData, isLoading: vetLoading } = useAccountBalance(
        selectedAccount?.address,
    );
    const { data: vetUsdPrice, isLoading: vetUsdPriceLoading } =
        useGetTokenUsdPrice('VET');
    const { data: vthoUsdPrice, isLoading: vthoUsdPriceLoading } =
        useGetTokenUsdPrice('VTHO');

    const { data: b3trBalance, isLoading: b3trLoading } = useGetB3trBalance(
        selectedAccount?.address,
    );
    const { data: b3trUsdPrice, isLoading: b3trUsdPriceLoading } =
        useGetTokenUsdPrice('B3TR');

    const { data: vot3Balance, isLoading: vot3Loading } = useGetVot3Balance(
        selectedAccount?.address,
    );

    const { data: veDelegateBalance, isLoading: veDelegateLoading } =
        useGetVeDelegateBalance(selectedAccount?.address);

    const isLoading =
        vetLoading ||
        b3trLoading ||
        vot3Loading ||
        vetUsdPriceLoading ||
        b3trUsdPriceLoading ||
        veDelegateLoading ||
        vthoUsdPriceLoading;

    const balances = {
        vet: Number(vetData?.balance || 0),
        vtho: Number(vetData?.energy || 0),
        b3tr: Number(ethers.formatEther(b3trBalance || '0')),
        vot3: Number(ethers.formatEther(vot3Balance || '0')),
        veDelegate: Number(ethers.formatEther(veDelegateBalance || '0')),
    };

    const prices = {
        vet: vetUsdPrice || 0,
        vtho: vthoUsdPrice || 0,
        b3tr: b3trUsdPrice || 0,
    };

    const totalBalance =
        balances.vet * prices.vet +
        balances.b3tr * prices.b3tr +
        balances.vot3 * prices.b3tr +
        balances.vtho * prices.vtho +
        balances.veDelegate * prices.b3tr;

    return {
        isLoading,
        balances,
        prices,
        totalBalance,
    };
};
