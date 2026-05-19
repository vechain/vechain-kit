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
        // Trust only same-origin messages. The kit dispatches the recovery
        // event to itself from PrivyCrossAppProvider's signTypedData /
        // signMessage catch when Privy's SDK has already routed the popup's
        // PRIVY_CROSS_APP_ACTION_ERROR through the normal channel — so the
        // happy path always goes through self-origin. Cross-origin frames
        // (e.g. an embedded ad or a hostile iframe) can't fake this to
        // force a logout + modal reopen on the user.
        if (
            typeof window !== 'undefined' &&
            event.origin !== window.location.origin
        ) {
            return;
        }
        const type = (event.data as { type?: unknown } | null)?.type;
        if (type !== 'vk:cross-app-no-connection') return;
        void (async () => {
            try {
                await disconnect();
            } catch {
                /* disconnect best-effort; modal still opens */
            }
            openConnectModal();
        })();
    };

    useEffect(() => {
        function bridge(event: MessageEvent) {
            handlerRef.current(event);
        }
        window.addEventListener('message', bridge);
        return () => window.removeEventListener('message', bridge);
    }, []);

    return null;
}
