import { useQuery } from '@tanstack/react-query';
import { useOptionalThor } from '../../api/dappkit/useOptionalThor';
import { Address } from '@vechain/sdk-core';
import { ThorClient } from '@vechain/sdk-network';
import { formatEther } from 'viem';

export const getAccountBalance = async (thor: ThorClient, address?: string) => {
    if (!address) throw new Error('Address is required');
    const account = await thor.accounts.getAccount(Address.of(address));

    return {
        balance: formatEther(BigInt(account.balance)).toString(),
        energy: formatEther(BigInt(account.energy)).toString(),
    };
};
export const getAccountBalanceQueryKey = (address?: string) => [
    'VECHAIN_KIT_BALANCE',
    address,
];

/**
 *  Get the account balance for the given address
 * @param address  The address of the account to get the balance for
 * @returns  The account balance
 */
export const useAccountBalance = (address?: string) => {
    // Use optional Thor hook that handles missing provider gracefully
    const thor = useOptionalThor();
    return useQuery({
        queryKey: getAccountBalanceQueryKey(address),
        queryFn: () => getAccountBalance(thor!, address),
        enabled: !!thor && !!address && Address.isValid(address),
        refetchInterval: 10000,
    });
};
