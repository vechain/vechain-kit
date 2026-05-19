'use client';

import { useEffect, useState } from 'react';
import {
    getAvatarForAddress,
    getDomainOfAddress,
    picassoFallback,
    type DomainInfo,
} from './thor';

/**
 * Resolve the VeChain domain and avatar for an address. Replaces the kit's
 * `useVechainDomain` + `useGetAvatarOfAddress` for the cross-app host.
 *
 * One-shot lookups via the SDK; no TanStack Query cache because this host
 * is a one-render popup -- the user arrives, the address resolves once, the
 * popup closes. The `ignore` flag guards against StrictMode double-fire and
 * unmount-before-resolve.
 */
export function useAddressInfo(address?: string | null): {
    domain?: string;
    avatar?: string;
    isLoading: boolean;
} {
    const [domain, setDomain] = useState<string | undefined>(undefined);
    const [avatar, setAvatar] = useState<string | undefined>(undefined);
    const [isLoading, setLoading] = useState<boolean>(Boolean(address));

    useEffect(() => {
        if (!address) {
            setDomain(undefined);
            setAvatar(undefined);
            setLoading(false);
            return;
        }
        let ignore = false;
        setLoading(true);
        Promise.all([
            getDomainOfAddress(address).catch(
                () => ({ isPrimaryDomain: false } as DomainInfo),
            ),
            getAvatarForAddress(address).catch(() =>
                picassoFallback(address),
            ),
        ]).then(([d, a]) => {
            if (ignore) return;
            setDomain(d.domain);
            setAvatar(a);
            setLoading(false);
        });
        return () => {
            ignore = true;
        };
    }, [address]);

    return { domain, avatar, isLoading };
}
