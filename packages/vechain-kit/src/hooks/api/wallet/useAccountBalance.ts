import { isValidAddress } from '../../../utils';
import { useQuery } from '@tanstack/react-query';
import { useConnex } from '@vechain/dapp-kit-react';
import { ethers } from 'ethers';

export const getAccountBalance = async (
    thor: Connex.Thor,
    address?: string,
) => {
    if (!address) throw new Error('Address is required');
    const account = await thor.account(address).get();

    return {
        balance: ethers.formatEther(account.balance).toString(),
        energy: ethers.formatEther(account.energy).toString(),
    };
};
export const getAccountBalanceQueryKey = (address?: string) => [
    'VECHAIN_KIT_ACCOUNT_BALANCE',
    address,
];

/**
 *  Get the account balance for the given address
 * @param address  The address of the account to get the balance for
 * @returns  The account balance
 */
export const useAccountBalance = (address?: string) => {
    const { thor } = useConnex();
    return useQuery({
        queryKey: getAccountBalanceQueryKey(address),
        queryFn: () => getAccountBalance(thor, address),
        enabled: !!address && isValidAddress(address),
        refetchInterval: 10000,
    });
};
