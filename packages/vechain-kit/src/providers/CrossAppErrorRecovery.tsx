'use client';

import { useEffect } from 'react';
import { useWallet } from '@/hooks/api/wallet/useWallet';
import { useModal } from './ModalProvider';

/**
 * Listens for `vk:cross-app-no-connection` postMessages from the cross-app
 * popup host. When the host can't decrypt an incoming request because Privy
 * has no matching connection record (TTL expired, or the user/account never
 * connected), it notifies the opener via this message. The kit responds by
 * disconnecting the stale session and opening the connect modal so the user
 * can re-establish a fresh connection in one tap — the retry would otherwise
 * keep failing with the same dead keys.
 *
 * Mounts as a render-less child of ModalProvider so it has access to both
 * `useWallet().disconnect` and `useModal().openConnectModal`.
 */
export function CrossAppErrorRecovery() {
    const { disconnect } = useWallet();
    const { openConnectModal } = useModal();

    useEffect(() => {
        function handle(event: MessageEvent) {
            if (
                !event.data ||
                typeof event.data !== 'object' ||
                (event.data as { type?: unknown }).type !==
                    'vk:cross-app-no-connection'
            ) {
                return;
            }
            console.warn(
                '[vechain-kit] cross-app connection is stale — disconnecting and reopening login',
            );
            void (async () => {
                try {
                    await disconnect();
                } catch (e) {
                    console.warn(
                        '[vechain-kit] recovery disconnect failed',
                        e,
                    );
                }
                openConnectModal();
            })();
        }
        window.addEventListener('message', handle);
        return () => window.removeEventListener('message', handle);
    }, [disconnect, openConnectModal]);

    return null;
}
