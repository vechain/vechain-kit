import { useMemo } from 'react';
import {
    useIsBlacklisted,
    useIsWhitelisted,
} from '@/hooks/thor/contracts/VeBetterPassport';
import { VePassportUserStatus } from '@/types';

/**
 * Hook to get the user status regarding whitelist and blacklist.
 * @param address - The user address.
 * @returns The user status based on the whitelist and blacklist.
 */
export const useUserStatus = (address: string) => {
    const { data: isBlacklisted } = useIsBlacklisted(address);
    const { data: isWhitelisted } = useIsWhitelisted(address);

    const userStatus = useMemo(() => {
        if (!isBlacklisted && !isWhitelisted) {
            return VePassportUserStatus.NONE;
        }

        if (isBlacklisted) {
            return VePassportUserStatus.BLACKLIST;
        }

        if (isWhitelisted) {
            return VePassportUserStatus.WHITELIST;
        }

        return VePassportUserStatus.NONE;
    }, [isBlacklisted, isWhitelisted]);

    return userStatus;
};
