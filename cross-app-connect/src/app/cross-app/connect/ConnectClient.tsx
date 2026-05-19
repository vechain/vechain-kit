'use client';

import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import {
    useLoginWithOAuth,
    useLogout,
    usePrivy,
    useWallets,
} from '@privy-io/react-auth';
import { useCrossAppClient } from '../_lib/client';
import { lookupAppByUrl } from '../_lib/app-hub';
import { getRecentProvider, setRecentProvider } from '../_lib/recent';
import { labelFromPrivyUser, setLastIdentity } from '../_lib/lastIdentity';
import {
    getSmartAccountAddress,
    type SmartAccountInfo,
} from '../_lib/thor';
import { VechainHeader } from '../../components/VechainHeader';
import { IdentityRow } from '../../components/IdentityRow';
import { OAUTH_PROVIDERS, type OAuthProvider } from '../../components/socials';
import {
    SignInPanel,
    isIntent,
    isOAuthIntent,
    type IntentMethod,
} from '../_components/SignInPanel';
import styles from './connect.module.css';

type ConnectionRequest = ReturnType<
    ReturnType<typeof useCrossAppClient>['getConnectionRequestFromUrlParams']
>;

const OAUTH_ATTEMPTED_STORAGE_KEY = 'vk-cross-app-connect:oauth-attempted';

type Phase =
    | 'loading'
    | 'no_params'
    | 'parse_error'
    | 'switching_provider'
    | 'auth_pending'
    | 'show_picker'
    | 'show_connect';

type PrivyUser = ReturnType<typeof usePrivy>['user'];

function hasLinkedProvider(
    user: PrivyUser,
    intent: IntentMethod | null,
): boolean {
    if (!user || !intent) return false;
    if (intent === 'phone') return Boolean(user.phone);
    if (intent === 'farcaster') return Boolean(user.farcaster);
    return Boolean((user as unknown as Record<string, unknown>)[intent]);
}

export function ConnectClient() {
    const { t } = useTranslation();
    const client = useCrossAppClient();
    const { ready, authenticated, user, getAccessToken } = usePrivy();
    const { wallets } = useWallets();
    const { logout } = useLogout();
    const { initOAuth, loading: oauthLoading } = useLoginWithOAuth();

    const [request, setRequest] = useState<ConnectionRequest | null>(null);
    const [parseError, setParseError] = useState<
        { kind: 'no_params' } | { kind: 'invalid'; message: string } | null
    >(null);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [smartAccount, setSmartAccount] = useState<SmartAccountInfo | null>(
        null,
    );

    // Persist a friendly identity label + provider hint whenever a user is
    // active. Read back on the transact "session expired" screen so we can
    // greet the user by name and pre-highlight the right provider on
    // re-login, instead of throwing them at a blank picker.
    useEffect(() => {
        if (!user) return;
        const label = labelFromPrivyUser(user);
        if (!label) return;
        setLastIdentity({ label, provider: getRecentProvider() ?? undefined });
    }, [user]);

    useEffect(() => {
        const hasRequesterKey =
            typeof window !== 'undefined' &&
            new URL(window.location.href).searchParams.has(
                'requester_public_key',
            );
        if (!hasRequesterKey) {
            setParseError({ kind: 'no_params' });
            return;
        }
        try {
            setRequest(client.getConnectionRequestFromUrlParams());
        } catch (e) {
            setParseError({
                kind: 'invalid',
                message:
                    e instanceof Error
                        ? e.message
                        : 'Invalid connection request',
            });
        }
    }, [client]);

    const intent = useMemo(() => {
        if (typeof window === 'undefined') return null;
        const value = new URL(window.location.href).searchParams.get('intent');
        return isIntent(value) ? value : null;
    }, []);

    const embedded = wallets.find((w) => w.walletClientType === 'privy');

    useEffect(() => {
        if (!embedded?.address) return;
        let ignore = false;
        getSmartAccountAddress(embedded.address)
            .then((r) => {
                if (!ignore) setSmartAccount(r);
            })
            .catch(() => {});
        return () => {
            ignore = true;
        };
    }, [embedded?.address]);

    const onAccept = useCallback(async () => {
        if (!request || !embedded || !user) return;
        setSubmitting(true);
        setSubmitError(null);
        try {
            const accessToken = await getAccessToken();
            if (!accessToken) throw new Error(t('connect.error.missingAccessToken'));
            await client.acceptConnection({
                accessToken,
                address: embedded.address,
                userId: user.id,
                connectionRequest: request,
            });
            window.close();
        } catch (e) {
            setSubmitError(
                e instanceof Error ? e.message : t('connect.error.failedToAccept'),
            );
        } finally {
            setSubmitting(false);
        }
    }, [client, request, embedded, user, getAccessToken]);

    const onReject = useCallback(async () => {
        if (!request) return;
        setSubmitting(true);
        try {
            const accessToken = await getAccessToken();
            await client.rejectConnection({
                accessToken: accessToken ?? undefined,
                callbackUrl: request.callbackUrl,
            });
        } finally {
            window.close();
        }
    }, [client, request, getAccessToken]);

    const phase: Phase = useMemo(() => {
        if (parseError?.kind === 'no_params') return 'no_params';
        if (parseError?.kind === 'invalid') return 'parse_error';
        if (!ready || !request) return 'loading';

        if (intent && isOAuthIntent(intent)) {
            if (!authenticated) return 'auth_pending';
            if (!user) return 'loading';
            return hasLinkedProvider(user, intent)
                ? 'show_connect'
                : 'switching_provider';
        }

        if (!authenticated) return 'show_picker';
        return 'show_connect';
    }, [parseError, ready, request, intent, authenticated, user]);

    const logoutForIntentRef = useRef(false);
    useEffect(() => {
        if (phase !== 'switching_provider') return;
        if (logoutForIntentRef.current) return;
        logoutForIntentRef.current = true;
        logout().catch((e) => console.error('Failed to logout:', e));
    }, [phase, logout]);

    useEffect(() => {
        if (phase !== 'auth_pending') return;
        if (!intent || !isOAuthIntent(intent)) return;
        if (oauthLoading) return;
        if (typeof sessionStorage !== 'undefined') {
            if (
                sessionStorage.getItem(OAUTH_ATTEMPTED_STORAGE_KEY) === intent
            ) {
                return;
            }
            sessionStorage.setItem(OAUTH_ATTEMPTED_STORAGE_KEY, intent);
        }
        setRecentProvider(intent);
        initOAuth({ provider: intent }).catch((e) => setSubmitError(String(e)));
    }, [phase, intent, oauthLoading, initOAuth]);

    const initialAuthRef = useRef<boolean | undefined>(undefined);
    useEffect(() => {
        if (!ready) return;
        if (initialAuthRef.current !== undefined) return;
        initialAuthRef.current = authenticated;
    }, [ready, authenticated]);

    const autoAcceptedRef = useRef(false);
    useEffect(() => {
        if (autoAcceptedRef.current) return;
        if (phase !== 'show_connect') return;
        if (!embedded || !user) return;
        if (submitting || submitError) return;
        if (initialAuthRef.current !== false) return;
        autoAcceptedRef.current = true;
        onAccept();
    }, [phase, embedded, user, submitting, submitError, onAccept]);

    if (phase === 'no_params') {
        return (
            <>
                <VechainHeader title={t('connect.title.default')} />
                <div className={styles.card}>
                    <p className={styles.fallbackText}>
                        {t('connect.copy.noRequestBody')}
                    </p>
                </div>
            </>
        );
    }

    if (phase === 'parse_error') {
        return (
            <>
                <VechainHeader title={t('connect.title.couldNotLoad')} />
                <div className={`${styles.alert} ${styles.alertError}`}>
                    {parseError?.kind === 'invalid'
                        ? parseError.message
                        : t('connect.title.couldNotLoad')}
                </div>
            </>
        );
    }

    if (
        phase === 'loading' ||
        phase === 'switching_provider' ||
        phase === 'auth_pending'
    ) {
        return (
            <>
                <VechainHeader
                    title={t('connect.title.logIn')}
                    subtitle={t('connect.subtitle.connecting')}
                    requesterUrl={request?.callbackUrl}
                />
                <div className={styles.center}>
                    <div className={styles.spinner} />
                </div>
            </>
        );
    }

    if (phase === 'show_picker') {
        return (
            <>
                <VechainHeader
                    subtitle={t('connect.subtitle.grantAccessTo')}
                    requesterUrl={request?.callbackUrl}
                />
                <SignInPanel intent={intent} onCancel={onReject} />
            </>
        );
    }

    const appHubEntry = lookupAppByUrl(request?.callbackUrl);
    const verifiedApp = Boolean(appHubEntry);
    return (
        <>
            <VechainHeader
                title={
                    appHubEntry
                        ? t('connect.title.connectTo', { app: appHubEntry.name })
                        : t('connect.title.confirmConnection')
                }
                subtitle={
                    appHubEntry
                        ? undefined
                        : t('connect.subtitle.notBefore')
                }
                requesterUrl={request?.callbackUrl}
            />
            <div className={styles.card}>
                <div className={styles.cardBody}>
                    <IdentityRow
                        walletAddress={smartAccount?.address}
                        user={user}
                    />
                    {!verifiedApp && (
                        <div className={`${styles.alert} ${styles.alertWarn}`}>
                            {t('connect.alert.notListed')}
                        </div>
                    )}
                    {submitError && (
                        <div className={`${styles.alert} ${styles.alertError}`}>
                            {submitError}
                        </div>
                    )}
                    <button
                        type="button"
                        className={styles.btnBrand}
                        onClick={onAccept}
                        disabled={!embedded || submitting}
                    >
                        {submitting
                            ? t('connect.button.connecting')
                            : verifiedApp
                            ? t('common.button.continue')
                            : t('common.button.continueAnyway')}
                    </button>
                    <button
                        type="button"
                        className={styles.btnGhost}
                        onClick={onReject}
                        disabled={submitting}
                    >
                        {t('common.button.cancel')}
                    </button>
                    <div className={styles.notYouRow}>
                        <span className={styles.muted}>
                            {t('connect.copy.notYou')}
                        </span>
                        <button
                            type="button"
                            className={styles.linkBtn}
                            onClick={() =>
                                logout().catch((e) =>
                                    console.error(
                                        'Failed to switch account:',
                                        e,
                                    ),
                                )
                            }
                        >
                            {t('connect.button.useAnotherAccount')}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

