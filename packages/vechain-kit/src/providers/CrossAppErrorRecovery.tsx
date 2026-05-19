'use client';

import { useEffect, useRef } from 'react';
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
 * `useWallet().disconnect` and `useModal().openConnectModal`. Uses a ref to
 * keep the listener installed for the lifetime of the component instead of
 * tearing it down on every render of `useWallet` (whose returned callbacks
 * lose identity frequently as auth state shifts) — that would risk losing
 * the popup's message during a remove/install gap.
 */
export function CrossAppErrorRecovery() {
    const { disconnect } = useWallet();
    const { openConnectModal } = useModal();

    const handlerRef = useRef<(event: MessageEvent) => void>(() => {});
    handlerRef.current = (event) => {
        const type = (event.data as { type?: unknown } | null)?.type;
        console.log(
            '[vechain-kit] message received',
            { type, origin: event.origin },
        );
        if (type !== 'vk:cross-app-no-connection') {
            return;
        }
        console.warn(
            '[vechain-kit] cross-app connection is stale — disconnecting and reopening login',
        );
        void (async () => {
            try {
                await disconnect();
            } catch (e) {
                console.warn('[vechain-kit] recovery disconnect failed', e);
            }
            openConnectModal();
        })();
    };

    useEffect(() => {
        console.log('[vechain-kit] CrossAppErrorRecovery listener installed');
        function bridge(event: MessageEvent) {
            handlerRef.current(event);
        }
        window.addEventListener('message', bridge);
        return () => {
            console.log(
                '[vechain-kit] CrossAppErrorRecovery listener removed',
            );
            window.removeEventListener('message', bridge);
        };
    }, []);

    return null;
}
