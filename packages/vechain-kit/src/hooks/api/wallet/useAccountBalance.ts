import { isValidAddress } from '../../../utils';
import { useQuery } from '@tanstack/react-query';
import { useThor } from '@vechain/dapp-kit-react';
import { formatEther } from 'viem';
import { type ThorClient } from '@vechain/sdk-network';
import { Address } from '@vechain/sdk-core';

export const getAccountBalance = async (thor: ThorClient, address?: string) => {
    if (!address) throw new Error('Address is required');
    const account = await thor.accounts.getAccount(Address.of(address));

    return {
        balance: formatEther(BigInt(account.balance)).toString(),
        energy: formatEther(BigInt(account.energy)).toString(),
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
    const thor = useThor();
    return useQuery({
        queryKey: getAccountBalanceQueryKey(address),
        queryFn: () => getAccountBalance(thor, address),
        enabled: !!address && isValidAddress(address),
        refetchInterval: 10000,
    });
};
