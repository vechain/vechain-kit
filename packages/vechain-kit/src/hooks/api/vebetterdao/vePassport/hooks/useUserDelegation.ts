import { useGetDelegator } from './useGetDelegator';
import { useGetDelegatee } from './useGetDelegatee';

/**
 * Hook to get the user's delegation information.
 * @param address - The user address.
 * @returns An object containing the user's delegator and delegatee addresses, and loading states.
 */
export const useUserDelegation = (address?: string) => {
    const { data: delegator, isLoading: isDelegatorLoading } =
        useGetDelegator(address);
    const { data: delegatee, isLoading: isDelegateeLoading } =
        useGetDelegatee(address);

    return {
        delegator,
        delegatee,
        isLoading: isDelegatorLoading || isDelegateeLoading,
        isDelegator: !!delegatee,
        isDelegatee: !!delegator,
    };
};
