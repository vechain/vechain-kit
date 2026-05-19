'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLoginWithOAuth, useLoginWithSms } from '@privy-io/react-auth';
import { LuPhone } from 'react-icons/lu';
import { SiFarcaster } from 'react-icons/si';
import {
    BRAND_GLYPH_COLOR,
    FARCASTER_GLYPH_COLOR,
    OAUTH_PROVIDERS,
    PHONE_GLYPH_COLOR,
    type OAuthProvider,
} from '../../components/socials';
import { getRecentProvider, setRecentProvider } from '../_lib/recent';
import { PinInput } from '../connect/PinInput';
import styles from '../connect/connect.module.css';

const INTENT_METHODS = [
    ...OAUTH_PROVIDERS.map((p) => p.id),
    'phone',
    'farcaster',
] as const;
export type IntentMethod = (typeof INTENT_METHODS)[number];

export function isIntent(value: string | null): value is IntentMethod {
    return !!value && (INTENT_METHODS as readonly string[]).includes(value);
}

export function isOAuthIntent(value: IntentMethod | null): value is OAuthProvider {
    return !!value && OAUTH_PROVIDERS.some((p) => p.id === value);
}

type PanelView = 'picker' | 'phone' | 'farcaster';

/**
 * Shared login UI — same provider rows + phone form on both the connect
 * popup (cold sign-in) and the transact popup's "session expired" branch.
 * Avoids surfacing Privy's own modal: we drive the headless
 * `useLoginWithOAuth` / `useLoginWithSms` hooks behind our own UI.
 *
 * The `intent` prop, if set, pre-opens a specific flow (the kit's
 * `appendIntent` URL param). `presetRecent` overrides the localStorage
 * recent-provider hint so the transact "Welcome back" screen can highlight
 * the provider the user actually last logged in with.
 */
export function SignInPanel({
    intent,
    onCancel,
    presetRecent,
}: {
    intent: IntentMethod | null;
    onCancel: () => void;
    presetRecent?: string | null;
}) {
    const { t } = useTranslation();
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
    const [recent, setRecent] = useState<string | null>(
        presetRecent ?? null,
    );

    useEffect(() => {
        if (presetRecent === undefined) {
            setRecent(getRecentProvider());
        }
    }, [presetRecent]);

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
            setError(
                e instanceof Error
                    ? e.message
                    : t('connect.error.failedToSendCode'),
            );
        }
    };

    const onSubmitCode = async () => {
        setError(null);
        try {
            await loginWithCode({ code });
        } catch (e) {
            setError(
                e instanceof Error
                    ? e.message
                    : t('connect.error.failedToVerifyCode'),
            );
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
                                    {t('connect.provider.moreOptions', {
                                        count: rows.other.length + 1,
                                    })}
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
                            placeholder={t('connect.phone.placeholder')}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            autoFocus
                            className={styles.inputRow}
                        />
                        <p className={styles.muted}>
                            {t('connect.phone.codeHint')}
                        </p>
                        <button
                            type="button"
                            className={styles.btnBrand}
                            onClick={onSendCode}
                            disabled={!phone || sendingCode}
                        >
                            {sendingCode
                                ? t('connect.phone.sending')
                                : t('connect.phone.sendCode')}
                        </button>
                        <button
                            type="button"
                            className={`${styles.btnGhost} ${styles.btnSm}`}
                            onClick={() => setView('picker')}
                        >
                            {t('common.button.back')}
                        </button>
                    </div>
                )}

                {view === 'phone' && (awaitingCode || submittingCode) && (
                    <div className={styles.cardBodyTight}>
                        <p className={styles.mutedBody}>
                            {t('connect.phone.codeSent', { phone })}
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
                            {submittingCode
                                ? t('connect.phone.verifying')
                                : t('connect.phone.verify')}
                        </button>
                        <button
                            type="button"
                            className={`${styles.btnGhost} ${styles.btnSm}`}
                            onClick={() => {
                                setCode('');
                                setView('picker');
                            }}
                        >
                            {t('common.button.back')}
                        </button>
                    </div>
                )}

                {view === 'farcaster' && (
                    <div className={styles.cardBodyTight}>
                        <p className={styles.mutedBody}>
                            {t('connect.farcaster.comingSoon')}
                        </p>
                        <button
                            type="button"
                            className={`${styles.btnGhost} ${styles.btnSm}`}
                            onClick={() => setView('picker')}
                        >
                            {t('common.button.back')}
                        </button>
                    </div>
                )}

                <button
                    type="button"
                    className={styles.btnGhost}
                    onClick={onCancel}
                >
                    {t('common.button.cancel')}
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
    const { t } = useTranslation();
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
                {t('connect.provider.continueWith', {
                    provider: provider.label,
                })}
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
    const { t } = useTranslation();
    return (
        <button type="button" className={styles.btnRow} onClick={onClick}>
            <LuPhone
                className={styles.rowIcon}
                style={{ color: PHONE_GLYPH_COLOR }}
            />
            <span className={styles.rowLabel}>
                {t('connect.provider.continueWithPhone')}
            </span>
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
    const { t } = useTranslation();
    return (
        <button type="button" className={styles.btnRow} onClick={onClick}>
            <SiFarcaster
                className={styles.rowIcon}
                style={{ color: FARCASTER_GLYPH_COLOR }}
            />
            <span className={styles.rowLabel}>
                {t('connect.provider.continueWithFarcaster')}
            </span>
            {isRecent && <RecentDot />}
        </button>
    );
}

function RecentDot() {
    const { t } = useTranslation();
    const label = t('connect.provider.lastUsed');
    return (
        <span
            className={styles.recentDot}
            role="img"
            aria-label={label}
            title={label}
        />
    );
}
