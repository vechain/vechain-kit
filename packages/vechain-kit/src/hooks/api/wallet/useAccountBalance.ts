import { isValidAddress } from '../../../utils';
import { useQuery } from '@tanstack/react-query';
import { useThor } from '@vechain/dapp-kit-react';
import { Address } from '@vechain/sdk-core';

export const getAccountBalanceQueryKey = (address?: string) => [
    'VECHAIN_KIT_ACCOUNT_BALANCE',
    address,
];

/**
 *  Get the account balance for the given address
 * @param address  The address of the account to get the balance for
 * @returns  The account balance
 */
export const useAccountBalance = (address: string) => {
    const thor = useThor();
    return useQuery({
        queryKey: getAccountBalanceQueryKey(address),
        queryFn: async () => {
            const response = await thor.accounts.getAccount(
                Address.of(address),
            );

            if (!response) throw new Error('Account not found');

            return response;
        },
        enabled: !!address && isValidAddress(address),
        refetchInterval: 10000,
    });
};
