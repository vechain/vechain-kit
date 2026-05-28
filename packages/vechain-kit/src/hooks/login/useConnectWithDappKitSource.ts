import { WalletSource } from '@vechain/dapp-kit';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDAppKitWallet, useDAppKitWalletModal } from '@/hooks';
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
 */
export const useConnectWithDappKitSource = (
    source: WalletSource,
    setCurrentContent: SetCurrentContent,
) => {
    const { t } = useTranslation();
    const {
        setSource,
        connect: connectV1,
        connectV2,
    } = useDAppKitWallet();
    const { close: closeDappKitModal } = useDAppKitWalletModal();

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
                `${VEWORLD_UNIVERSAL_LINK}${encodeURIComponent(
                    window.location.href,
                )}`,
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
            
            // ConnectModal closes automatically when useWallet flips
            // `connection.isConnected` to true.
            if (source === 'veworld') {
                await connectV2(null);
            } else {
                await connectV1();
            }
           
            // WalletConnect side-effect: setSource('wallet-connect') +
            // connect() causes dapp-kit's signer to call
            // CustomWalletConnectModal.openModal({uri}), which fires
            // `vdk-open-wc-qrcode` and pops dapp-kit-ui's own
            // <vdk-connect-modal> with the QR. That modal only
            // auto-closes when the user clicks through dapp-kit-ui's
            // source picker — since we drive connect from here, we have
            // to close it ourselves. If we don't, the QR modal stays up
            // post-handshake and the user's only out (clicking X) hits
            // dapp-kit-ui's `handleClose`, which calls `wallet.disconnect()`
            // whenever `walletConnectQRcode` is set — i.e. closing the
            // stuck modal disconnects the user we just connected.
            if (source === 'wallet-connect') {
                closeDappKitModal();
            }
            // Our own ConnectModal closes automatically when useWallet
            // flips `connection.isConnected` to true.
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
    }, [
        source,
        setSource,
        connectV1, 
        connectV2,
        closeDappKitModal,
        setCurrentContent,
        t,
    ]);

    return { connect };
};
