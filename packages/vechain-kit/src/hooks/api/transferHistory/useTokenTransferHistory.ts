import { useTransferHistory } from './useTransferHistory';

export const useTokenTransferHistory = (
    address?: string,
    tokenAddress?: string | null,
    options: { enabled?: boolean } = {},
) => {
    return useTransferHistory(address, {
        tokenAddress: tokenAddress ?? undefined,
        enabled: options.enabled,
    });
};
