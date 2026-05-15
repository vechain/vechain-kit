import { WalletSource } from '@vechain/dapp-kit';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDAppKitWallet } from '@/hooks';
import { isRejectionError } from '@/utils/stringUtils';
import type { ConnectModalContentsTypes } from '@/components';

type SetCurrentContent = React.Dispatch<
    React.SetStateAction<ConnectModalContentsTypes>
>;

const sourceDisplayName: Record<WalletSource, string> = {
    veworld: 'VeWorld',
    sync2: 'Sync2',
    sync: 'Sync',
    'wallet-connect': 'WalletConnect',
};

/**
 * VeWorld Universal Link entry point. Hitting this URL on a phone with
 * VeWorld installed opens the dApp inside VeWorld's in-app browser; on
 * desktop or on a phone without the app it lands on the install page.
 * Mirrors the fallback used by dapp-kit-ui's ConnectModal when
 * `window.vechain` is missing.
 */
const VEWORLD_UNIVERSAL_LINK = 'https://www.veworld.com/discover/browser/ul/';

const extractErrorMessage = (err: unknown): string => {
    if (typeof err === 'string') return err;
    if (err instanceof Error) return err.message;
    if (err && typeof err === 'object') {
        const maybe = err as { message?: unknown; reason?: unknown };
        if (typeof maybe.message === 'string') return maybe.message;
        if (typeof maybe.reason === 'string') return maybe.reason;
        try {
            return JSON.stringify(err);
        } catch {
            return '';
        }
    }
    return '';
};

/**
 * Drives a dapp-kit wallet connection (setSource + connect) while reflecting
 * progress in the ConnectModal's local sub-content state (loading/error).
 *
 * Uses the legacy `connect()` API rather than `connectV2()` because:
 *   - WalletConnect's signer throws "not implemented" for V2.
 *   - The VeWorld desktop extension also rejects V2 ("Attempt failed").
 * V2 is only reliable inside the VeWorld mobile in-app browser, which is
 * handled separately in ModalProvider.
 */
export const useConnectWithDappKitSource = (
    source: WalletSource,
    setCurrentContent: SetCurrentContent,
) => {
    const { t } = useTranslation();
    const { setSource, connect: dappKitConnect } = useDAppKitWallet();

    const connect = useCallback(async () => {
        const displayName = sourceDisplayName[source] ?? source;

        const tryAgain = () => {
            void connect();
        };

        // When VeWorld is selected but the extension isn't injected, fall
        // back to the Universal Link — opens the dApp inside VeWorld mobile
        // on phones, the install page on desktop. Same behavior as
        // dapp-kit-ui's ConnectModal.
        if (
            source === 'veworld' &&
            typeof window !== 'undefined' &&
            !window.vechain
        ) {
            window.open(
                `${VEWORLD_UNIVERSAL_LINK}${encodeURIComponent(window.location.href)}`,
                '_self',
            );
            return;
        }

        setCurrentContent({
            type: 'loading',
            props: {
                title: `${t('Connecting with')} ${displayName}`,
                // Hint copy below the "Waiting for signature…" headline.
                // Different message for WC since the wallet may live on a
                // different device — user has to scan first.
                loadingText:
                    source === 'wallet-connect'
                        ? t('Scan the QR code with your wallet to continue.')
                        : t(
                              'Open your wallet and confirm the connection request.',
                          ),
                onTryAgain: tryAgain,
            },
        });

        try {
            setSource(source);
            await dappKitConnect();
            // ConnectModal closes automatically when useWallet flips
            // `connection.isConnected` to true.
        } catch (err) {
            const errorMsg = extractErrorMessage(err);
            if (isRejectionError(errorMsg)) {
                // User dismissed the wallet prompt — drop back to the main grid.
                setCurrentContent('main');
                return;
            }
            setCurrentContent({
                type: 'error',
                props: {
                    error:
                        errorMsg ||
                        t('Failed to connect, please try again later.'),
                    onTryAgain: tryAgain,
                },
            });
        }
    }, [source, setSource, dappKitConnect, setCurrentContent, t]);

    return { connect };
};
