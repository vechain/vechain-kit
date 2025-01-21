import { useAccountBalance } from '..';
import {
    useGetB3trBalance,
    useGetVot3Balance,
    useGetVeDelegateBalance,
    useGetTokenUsdPrice,
} from '..';
import { ethers } from 'ethers';

type UseBalancesProps = {
    address?: string;
};

export const useBalances = ({ address = '' }: UseBalancesProps) => {
    const { data: vetData, isLoading: vetLoading } = useAccountBalance(address);
    const { data: vetUsdPrice, isLoading: vetUsdPriceLoading } =
        useGetTokenUsdPrice('VET');
    const { data: vthoUsdPrice, isLoading: vthoUsdPriceLoading } =
        useGetTokenUsdPrice('VTHO');

    const { data: b3trBalance, isLoading: b3trLoading } =
        useGetB3trBalance(address);
    const { data: b3trUsdPrice, isLoading: b3trUsdPriceLoading } =
        useGetTokenUsdPrice('B3TR');

    const { data: vot3Balance, isLoading: vot3Loading } =
        useGetVot3Balance(address);

    const { data: veDelegateBalance, isLoading: veDelegateLoading } =
        useGetVeDelegateBalance(address);

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
        b3tr: Number(ethers.formatEther(b3trBalance?.original || '0')),
        vot3: Number(ethers.formatEther(vot3Balance?.original || '0')),
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
