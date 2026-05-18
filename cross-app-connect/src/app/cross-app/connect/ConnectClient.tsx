'use client';

import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { SiFarcaster } from 'react-icons/si';
import { LuPhone } from 'react-icons/lu';
import {
    useLoginWithOAuth,
    useLoginWithSms,
    useLogout,
    usePrivy,
    useWallets,
} from '@privy-io/react-auth';
import { useCrossAppClient } from '../_lib/client';
import { lookupAppByUrl } from '../_lib/app-hub';
import { getRecentProvider, setRecentProvider } from '../_lib/recent';
import {
    getSmartAccountAddress,
    type SmartAccountInfo,
} from '../_lib/thor';
import { VechainHeader } from '../../components/VechainHeader';
import { IdentityRow } from '../../components/IdentityRow';
import {
    BRAND_GLYPH_COLOR,
    FARCASTER_GLYPH_COLOR,
    OAUTH_PROVIDERS,
    PHONE_GLYPH_COLOR,
    type OAuthProvider,
} from '../../components/socials';
import { PinInput } from './PinInput';
import styles from './connect.module.css';

type ConnectionRequest = ReturnType<
    ReturnType<typeof useCrossAppClient>['getConnectionRequestFromUrlParams']
>;

const INTENT_METHODS = [
    ...OAUTH_PROVIDERS.map((p) => p.id),
    'phone',
    'farcaster',
] as const;
type IntentMethod = (typeof INTENT_METHODS)[number];

function isIntent(value: string | null): value is IntentMethod {
    return !!value && (INTENT_METHODS as readonly string[]).includes(value);
}

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

function isOAuthIntent(value: IntentMethod | null): value is OAuthProvider {
    return !!value && OAUTH_PROVIDERS.some((p) => p.id === value);
}

export function ConnectClient() {
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
            if (!accessToken) throw new Error('Missing access token');
            await client.acceptConnection({
                accessToken,
                address: embedded.address,
                userId: user.id,
                connectionRequest: request,
            });
            window.close();
        } catch (e) {
            setSubmitError(
                e instanceof Error ? e.message : 'Failed to accept connection',
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
                <VechainHeader title="VeChain Cross-App Connect" />
                <div className={styles.card}>
                    <p className={styles.fallbackText}>
                        This page handles cross-app connection requests from
                        other VeChain dApps. It can&apos;t be opened directly
                        &mdash; the requesting app will open it with the
                        parameters it needs.
                    </p>
                </div>
            </>
        );
    }

    if (phase === 'parse_error') {
        return (
            <>
                <VechainHeader title="Couldn't load request" />
                <div className={`${styles.alert} ${styles.alertError}`}>
                    {parseError?.kind === 'invalid'
                        ? parseError.message
                        : 'Invalid connection request'}
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
                    title="Log in to your wallet"
                    subtitle="Connecting…"
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
                    subtitle="Sign in to grant access to"
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
                        ? `Connect to ${appHubEntry.name}`
                        : 'Confirm connection'
                }
                subtitle={
                    appHubEntry
                        ? undefined
                        : 'You haven’t connected here before'
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
                            This app isn&rsquo;t listed in the VeChain App Hub,
                            so only continue if you trust the site.
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
                            ? 'Working…'
                            : verifiedApp
                            ? 'Continue'
                            : 'Continue anyway'}
                    </button>
                    <button
                        type="button"
                        className={styles.btnGhost}
                        onClick={onReject}
                        disabled={submitting}
                    >
                        Cancel
                    </button>
                    <div className={styles.notYouRow}>
                        <span className={styles.muted}>Not you?</span>
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
                            Use another account
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

type PanelView = 'picker' | 'phone' | 'farcaster';

function SignInPanel({
    intent,
    onCancel,
}: {
    intent: IntentMethod | null;
    onCancel: () => void;
}) {
    const [error, setError] = useState<string | null>(null);
    const { initOAuth, loading: oauthLoading } = useLoginWithOAuth({
        onError: (e) => setError(String(e)),
    });
    const { state: smsState, sendCode, loginWithCode } = useLoginWithSms();

    const [view, setView] = useState<PanelView>(() =>
        intent === 'phone'
            ? 'phone'
            : intent === 'farcaster'
            ? 'farcaster'
            : 'picker',
    );
    const [showOther, setShowOther] = useState<boolean>(false);
    const [phone, setPhone] = useState('');
    const [code, setCode] = useState('');
    const [recent, setRecent] = useState<string | null>(null);

    useEffect(() => {
        setRecent(getRecentProvider());
    }, []);

    const rows = useMemo(() => {
        const primary = OAUTH_PROVIDERS.filter((p) => p.tier === 'primary');
        const other = OAUTH_PROVIDERS.filter((p) => p.tier === 'other');
        return { primary, other };
    }, []);

    const onOAuth = (provider: OAuthProvider) => {
        setError(null);
        setRecentProvider(provider);
        initOAuth({ provider }).catch((e) => setError(String(e)));
    };

    const onSendCode = async () => {
        setError(null);
        try {
            await sendCode({ phoneNumber: phone });
            setRecentProvider('phone');
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to send code');
        }
    };

    const onSubmitCode = async () => {
        setError(null);
        try {
            await loginWithCode({ code });
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to verify code');
        }
    };

    const awaitingCode = smsState.status === 'awaiting-code-input';
    const sendingCode = smsState.status === 'sending-code';
    const submittingCode = smsState.status === 'submitting-code';

    const isRecent = (id: string) => recent === id;

    return (
        <div className={styles.card}>
            <div className={styles.cardBodyTight}>
                {error && (
                    <div className={`${styles.alert} ${styles.alertError}`}>
                        {error}
                    </div>
                )}

                {view === 'picker' && (
                    <div className={styles.cardBodyTight}>
                        {rows.primary.map((p) => (
                            <ProviderRow
                                key={p.id}
                                provider={p}
                                onClick={() => onOAuth(p.id)}
                                isDisabled={oauthLoading}
                                isRecent={isRecent(p.id)}
                            />
                        ))}
                        <PhoneRow
                            onClick={() => setView('phone')}
                            isRecent={isRecent('phone')}
                        />
                        {!showOther && rows.other.length > 0 && (
                            <div className={styles.linkCenter}>
                                <button
                                    type="button"
                                    className={styles.linkBtn}
                                    onClick={() => setShowOther(true)}
                                >
                                    + {rows.other.length + 1} more options
                                </button>
                            </div>
                        )}
                        {showOther && (
                            <div className={styles.cardBodyTight}>
                                {rows.other
                                    .filter(
                                        (p) =>
                                            p.id === 'discord' ||
                                            p.id === 'github' ||
                                            p.id === 'tiktok',
                                    )
                                    .map((p) => (
                                        <ProviderRow
                                            key={p.id}
                                            provider={p}
                                            onClick={() => onOAuth(p.id)}
                                            isDisabled={oauthLoading}
                                            isRecent={isRecent(p.id)}
                                        />
                                    ))}
                                <FarcasterRow
                                    onClick={() => setView('farcaster')}
                                    isRecent={isRecent('farcaster')}
                                />
                                {rows.other
                                    .filter((p) => p.id === 'line')
                                    .map((p) => (
                                        <ProviderRow
                                            key={p.id}
                                            provider={p}
                                            onClick={() => onOAuth(p.id)}
                                            isDisabled={oauthLoading}
                                            isRecent={isRecent(p.id)}
                                        />
                                    ))}
                            </div>
                        )}
                    </div>
                )}

                {view === 'phone' && !awaitingCode && !submittingCode && (
                    <div className={styles.cardBodyTight}>
                        <input
                            type="tel"
                            placeholder="+1 555 555 5555"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            autoFocus
                            className={styles.inputRow}
                        />
                        <p className={styles.muted}>
                            Include the country code, e.g. +1 for US, +44 for
                            UK.
                        </p>
                        <button
                            type="button"
                            className={styles.btnBrand}
                            onClick={onSendCode}
                            disabled={!phone || sendingCode}
                        >
                            {sendingCode ? 'Sending…' : 'Send code'}
                        </button>
                        <button
                            type="button"
                            className={`${styles.btnGhost} ${styles.btnSm}`}
                            onClick={() => setView('picker')}
                        >
                            Back
                        </button>
                    </div>
                )}

                {view === 'phone' && (awaitingCode || submittingCode) && (
                    <div className={styles.cardBodyTight}>
                        <p className={styles.mutedBody}>
                            We sent a 6-digit code to{' '}
                            <span className={styles.strong}>{phone}</span>.
                        </p>
                        <div className={styles.pinRow}>
                            <PinInput
                                value={code}
                                onChange={setCode}
                                onComplete={(v) => {
                                    setCode(v);
                                    loginWithCode({ code: v }).catch((e) =>
                                        setError(String(e)),
                                    );
                                }}
                            />
                        </div>
                        <button
                            type="button"
                            className={styles.btnBrand}
                            onClick={onSubmitCode}
                            disabled={code.length !== 6 || submittingCode}
                        >
                            {submittingCode ? 'Verifying…' : 'Verify'}
                        </button>
                        <button
                            type="button"
                            className={`${styles.btnGhost} ${styles.btnSm}`}
                            onClick={() => {
                                setCode('');
                                setView('picker');
                            }}
                        >
                            Back
                        </button>
                    </div>
                )}

                {view === 'farcaster' && (
                    <div className={styles.cardBodyTight}>
                        <p className={styles.mutedBody}>
                            Farcaster sign-in is coming soon. It uses Sign In
                            With Farcaster (SIWF), which needs a Warpcast scan
                            and isn&apos;t wired up here yet. Please choose
                            another option for now.
                        </p>
                        <button
                            type="button"
                            className={`${styles.btnGhost} ${styles.btnSm}`}
                            onClick={() => setView('picker')}
                        >
                            Back
                        </button>
                    </div>
                )}

                <button
                    type="button"
                    className={styles.btnGhost}
                    onClick={onCancel}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}

function ProviderRow({
    provider,
    isRecent,
    onClick,
    isDisabled,
}: {
    provider: (typeof OAUTH_PROVIDERS)[number];
    isRecent?: boolean;
    onClick: () => void;
    isDisabled?: boolean;
}) {
    const brandColor = BRAND_GLYPH_COLOR[provider.id];
    const monoFlip =
        provider.id === 'apple' ||
        provider.id === 'github' ||
        provider.id === 'twitter';
    const iconColor = brandColor
        ? brandColor
        : monoFlip
        ? 'var(--text-strong)'
        : undefined;
    const Icon = provider.Icon;
    return (
        <button
            type="button"
            className={styles.btnRow}
            onClick={onClick}
            disabled={isDisabled}
        >
            <Icon className={styles.rowIcon} style={{ color: iconColor }} />
            <span className={styles.rowLabel}>
                Continue with {provider.label}
            </span>
            {isRecent && <RecentDot />}
        </button>
    );
}

function PhoneRow({
    onClick,
    isRecent,
}: {
    onClick: () => void;
    isRecent?: boolean;
}) {
    return (
        <button type="button" className={styles.btnRow} onClick={onClick}>
            <LuPhone
                className={styles.rowIcon}
                style={{ color: PHONE_GLYPH_COLOR }}
            />
            <span className={styles.rowLabel}>Continue with Phone</span>
            {isRecent && <RecentDot />}
        </button>
    );
}

function FarcasterRow({
    onClick,
    isRecent,
}: {
    onClick: () => void;
    isRecent?: boolean;
}) {
    return (
        <button type="button" className={styles.btnRow} onClick={onClick}>
            <SiFarcaster
                className={styles.rowIcon}
                style={{ color: FARCASTER_GLYPH_COLOR }}
            />
            <span className={styles.rowLabel}>Continue with Farcaster</span>
            {isRecent && <RecentDot />}
        </button>
    );
}

function RecentDot() {
    return (
        <span
            className={styles.recentDot}
            role="img"
            aria-label="Last used"
            title="Last used"
        />
    );
}

