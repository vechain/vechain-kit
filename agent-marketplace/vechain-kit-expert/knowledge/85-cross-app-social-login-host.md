# VeChain Kit — Cross-app social-login host

The maintained whitelabel cross-app host used by VeChain Kit social-login flows, including connection, signing, transaction, recovery, security, and English UI behavior.

> Generated from the VeChain Kit repository. File paths are preserved so answers can cite the source.
> VeChain Kit commit: `f8f32209bf76b08a0e459f534c9fb488a9e5fd00`. VeChain AI Skills commit: `b0d8b8f0dbb97cf4224840f7ee7a2eaadea677f2`.

## Source: `cross-app-connect/src/app/components/AddressTag.module.css`

````css
.row {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
}

.avatar {
    border-radius: var(--radius-full);
    flex-shrink: 0;
    object-fit: cover;
    object-position: center;
}

.label {
    font-weight: 500;
    color: var(--text-strong);
}

.domainStack {
    display: flex;
    flex-direction: column;
    min-width: 0;
}

.domainName {
    font-weight: 500;
    color: var(--text-strong);
    font-size: 14px;
    line-height: 1.1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0;
}

.addressLine {
    font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
    font-size: 12px;
    color: var(--text-subtle);
    line-height: 1.1;
    margin: 0;
}

.addressOnly {
    font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
    font-size: 14px;
    color: var(--text-muted);
}

.iconVerified {
    width: 14px;
    height: 14px;
    color: var(--success);
    flex-shrink: 0;
}

.iconWarn {
    width: 14px;
    height: 14px;
    color: var(--warn);
    flex-shrink: 0;
}
````

## Source: `cross-app-connect/src/app/components/AddressTag.tsx`

````tsx
'use client';

import { useTranslation } from 'react-i18next';
import { LuCircleCheck, LuTriangleAlert } from 'react-icons/lu';
import { resolveContractLabel } from '../cross-app/_lib/contracts';
import { useAddressInfo } from '../cross-app/_lib/useAddressInfo';
import { truncateAddress } from '../cross-app/_lib/format';
import styles from './AddressTag.module.css';

type Props = {
    address: string;
    self?: string;
    /**
     * Distinguishes "contract this user is calling" (`'contract'` — default)
     * from "address receiving funds" (`'recipient'`).
     *
     * `'contract'` shows an "Unverified contract" warning when the address
     * isn't in the known-contracts registry — that's the phishing-defence
     * path. `'recipient'` is for token transfer destinations (typically a
     * wallet, not a contract); showing "Unverified contract" there would be
     * scary noise.
     */
    kind?: 'contract' | 'recipient';
    /** Avatar size in px. Defaults to 20 for inline use. */
    avatarSize?: number;
};

export function AddressTag({
    address,
    self,
    kind = 'contract',
    avatarSize = 20,
}: Props) {
    const { t } = useTranslation();
    const { domain, avatar } = useAddressInfo(address);
    const isSelf =
        !!self && address.toLowerCase() === self.toLowerCase();
    const resolved = isSelf
        ? { label: t('transact.detail.yourAccount'), verified: true }
        : resolveContractLabel(address);

    if (resolved) {
        return (
            <span className={styles.row}>
                {avatar && (
                    <img
                        src={avatar}
                        alt=""
                        width={avatarSize}
                        height={avatarSize}
                        className={styles.avatar}
                        draggable={false}
                    />
                )}
                <span className={styles.label}>{resolved.label}</span>
                {resolved.verified && (
                    <LuCircleCheck
                        className={styles.iconVerified}
                        aria-label={t('addressTag.verifiedContract')}
                        title={t('addressTag.verifiedContract')}
                    />
                )}
            </span>
        );
    }

    return (
        <span className={styles.row}>
            {avatar && (
                <img
                    src={avatar}
                    alt=""
                    width={avatarSize}
                    height={avatarSize}
                    className={styles.avatar}
                    draggable={false}
                />
            )}
            {domain ? (
                <span className={styles.domainStack}>
                    <span className={styles.domainName}>{domain}</span>
                    <span className={styles.addressLine}>
                        {truncateAddress(address)}
                    </span>
                </span>
            ) : (
                <span className={styles.addressOnly}>{truncateAddress(address)}</span>
            )}
            {kind === 'contract' && (
                <LuTriangleAlert
                    className={styles.iconWarn}
                    aria-label={t('addressTag.unverifiedContract')}
                    title={t('addressTag.unverifiedContract')}
                />
            )}
        </span>
    );
}
````

## Source: `cross-app-connect/src/app/components/IdentityRow.module.css`

````css
.container {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    border-radius: var(--radius-md);
    background: var(--bg-card-elevated);
    border: 1px solid var(--border-default);
}

.avatar {
    width: 44px;
    height: 44px;
    border-radius: var(--radius-full);
    flex-shrink: 0;
    background: var(--login-btn-hover-bg);
    object-fit: cover;
    object-position: center;
}

.avatarPlaceholder {
    width: 44px;
    height: 44px;
    border-radius: var(--radius-full);
    background: var(--login-btn-hover-bg);
    flex-shrink: 0;
}

.body {
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex: 1;
    min-width: 0;
}

.head {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
}

.name {
    font-weight: 600;
    color: var(--text-strong);
    line-height: 1.2;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.badges {
    display: flex;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
}

.badge {
    width: 14px;
    height: 14px;
}

.wallet {
    font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
    font-size: 12px;
    color: var(--text-subtle);
    line-height: 1.2;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.placeholder {
    font-size: 12px;
    color: var(--text-subtle);
    margin: 0;
}

.skeleton {
    background: var(--login-btn-hover-bg);
    border-radius: var(--radius-sm);
    animation: pulse 1.5s ease-in-out infinite;
}

.skeletonAvatar {
    width: 44px;
    height: 44px;
    border-radius: var(--radius-full);
}

.skeletonWallet {
    height: 14px;
    width: 60%;
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.55; }
}
````

## Source: `cross-app-connect/src/app/components/IdentityRow.tsx`

````tsx
'use client';

import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useAddressInfo } from '../cross-app/_lib/useAddressInfo';
import { truncateAddress } from '../cross-app/_lib/format';
import { labelFromPrivyUser } from '../cross-app/_lib/lastIdentity';
import { linkedSocials } from './socials';
import styles from './IdentityRow.module.css';

type Props = {
    /** Wallet address shown under the name (typically the smart account). */
    walletAddress?: string;
    /**
     * Privy user object — drives the display name + linked-social badges.
     * Typed loosely on purpose so we don't have to import Privy's User type
     * (which evolves between versions); the fields we read are extracted via
     * a one-time cast below.
     */
    user: unknown;
    /**
     * Optional override for the loading placeholder shown while the wallet
     * resolves. Defaults to "Creating your VeChain account…" to fit the
     * post-login connect flow; transact pages may pass nothing once the
     * smart account is already known.
     */
    pendingLabel?: ReactNode;
};

/**
 * Shared "your account" card: avatar + display name (email / phone / social
 * handle / truncated DID) + linked-social icon badges + the smart-account
 * address (with .vet domain when one is set). Used on both the connect
 * confirm screen and the transact/sign popups so the user sees a
 * consistent identity treatment.
 */
export function IdentityRow({
    walletAddress,
    user,
    pendingLabel,
}: Props) {
    const { t } = useTranslation();
    const { domain, avatar, isLoading } = useAddressInfo(walletAddress);
    // Reuse the kit-wide identity resolver — same logic as the "Welcome
    // back" greeting, so a user logged in via X (Twitter) sees @handle
    // here too instead of a raw did:privy:… string.
    const displayName = labelFromPrivyUser(user);
    const linked = linkedSocials(
        user as { phone?: unknown; farcaster?: unknown } | null | undefined,
    );
    // Show the skeleton only while the resolver is actively running. If
    // resolution has settled and there's still no walletAddress, the
    // render tree falls through to the `pendingLabel` placeholder branch
    // (previously unreachable, because the old `!walletAddress` term
    // forced walletPending=true any time the address was missing).
    const walletPending = isLoading;

    return (
        <div className={styles.container}>
            {isLoading ? (
                <div
                    className={`${styles.skeleton} ${styles.skeletonAvatar}`}
                />
            ) : avatar ? (
                <img
                    src={avatar}
                    alt=""
                    className={styles.avatar}
                    draggable={false}
                />
            ) : (
                <div className={styles.avatarPlaceholder} />
            )}
            <div className={styles.body}>
                <div className={styles.head}>
                    <p
                        className={styles.name}
                        title={displayName ?? undefined}
                    >
                        {displayName ?? t('identity.signedIn')}
                    </p>
                    {linked.length > 0 && (
                        <span className={styles.badges}>
                            {linked.map((s) => {
                                const Icon = s.Icon;
                                return (
                                    <Icon
                                        key={s.id}
                                        className={styles.badge}
                                        style={{ color: s.color }}
                                        aria-label={s.label}
                                        title={s.label}
                                    />
                                );
                            })}
                        </span>
                    )}
                </div>
                {walletPending ? (
                    <div
                        className={`${styles.skeleton} ${styles.skeletonWallet}`}
                    />
                ) : walletAddress ? (
                    <p className={styles.wallet}>
                        {domain
                            ? `${domain} · ${truncateAddress(walletAddress)}`
                            : truncateAddress(walletAddress)}
                    </p>
                ) : (
                    <p className={styles.placeholder}>
                        {pendingLabel ?? t('identity.creatingAccount')}
                    </p>
                )}
            </div>
        </div>
    );
}
````

## Source: `cross-app-connect/src/app/components/RequesterChip.module.css`

````css
.chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 2px 8px;
    border-radius: var(--radius-full);
    border: 1px solid var(--border-button);
    background: var(--bg-card);
    max-width: 100%;
    line-height: 1.4;
}

/* Verified production app — subtle green outline + check */
.chipVerified {
    border-color: var(--success);
}

/* Local dev / HTTP origins — loud warning is the whole point. Yellow
   tint + warning glyph; no other ornament. */
.chipWarn {
    background: rgba(245, 158, 11, 0.12);
    border-color: var(--warn);
}

.icon {
    width: 12px;
    height: 12px;
    flex-shrink: 0;
}

.iconSecure {
    color: var(--text-subtle);
}

.iconWarn {
    color: var(--warn);
}

.iconVerified {
    color: var(--success);
}

.label {
    font-size: 12px;
    font-weight: 500;
    color: var(--text-strong);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.sep {
    color: var(--text-subtle);
    font-weight: 400;
}

.host {
    font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
    font-size: 12px;
    font-weight: 500;
    color: var(--text-strong);
}

.fallback {
    font-size: 12px;
    color: var(--text-muted);
}
````

## Source: `cross-app-connect/src/app/components/RequesterChip.tsx`

````tsx
'use client';

import { useTranslation } from 'react-i18next';
import { LuCircleCheck, LuLockKeyhole, LuTriangleAlert } from 'react-icons/lu';
import { lookupAppByUrl } from '../cross-app/_lib/app-hub';
import styles from './RequesterChip.module.css';

type Props = {
    url: string;
};

type ChipKind =
    | { kind: 'local'; host: string }
    | { kind: 'insecure'; host: string }
    | { kind: 'verified'; name: string }
    | { kind: 'secure'; host: string };

/**
 * Identifies the dApp asking to connect with a single, clear signal:
 *
 *   • local dev origin  →  ⚠ yellow chip, "Local development site · host"
 *   • HTTP non-local    →  ⚠ yellow chip, host
 *   • HTTPS verified    →  ✓ green-outlined chip, App-Hub name
 *   • HTTPS unverified  →  🔒 neutral chip, host
 *
 * The favicon and dual-icon treatment from the earlier version were dropped
 * because three icons (globe + favicon + warning) made the trust signal
 * ambiguous. One glyph, one chip background; the colour does the talking.
 */
export function RequesterChip({ url }: Props) {
    const { t } = useTranslation();
    const parsed = safeParseUrl(url);
    if (!parsed) {
        return <span className={styles.fallback}>{url}</span>;
    }

    const chip = classify(parsed, url);

    switch (chip.kind) {
        case 'local':
            return (
                <span className={`${styles.chip} ${styles.chipWarn}`}>
                    <LuTriangleAlert
                        className={`${styles.icon} ${styles.iconWarn}`}
                        aria-label={t('requester.localDev')}
                    />
                    <span className={styles.label}>
                        {t('requester.localDev')}
                        <span className={styles.sep}> · </span>
                        <span className={styles.host}>{chip.host}</span>
                    </span>
                </span>
            );
        case 'insecure':
            return (
                <span className={`${styles.chip} ${styles.chipWarn}`}>
                    <LuTriangleAlert
                        className={`${styles.icon} ${styles.iconWarn}`}
                    />
                    <span className={styles.host}>{chip.host}</span>
                </span>
            );
        case 'verified':
            return (
                <span className={`${styles.chip} ${styles.chipVerified}`}>
                    <LuCircleCheck
                        className={`${styles.icon} ${styles.iconVerified}`}
                    />
                    <span className={styles.label}>{chip.name}</span>
                </span>
            );
        case 'secure':
            return (
                <span className={styles.chip}>
                    <LuLockKeyhole
                        className={`${styles.icon} ${styles.iconSecure}`}
                    />
                    <span className={styles.host}>{chip.host}</span>
                </span>
            );
    }
}

function classify(parsed: URL, originalUrl: string): ChipKind {
    const display =
        parsed.port && parsed.port !== '80' && parsed.port !== '443'
            ? `${parsed.hostname}:${parsed.port}`
            : parsed.hostname;

    if (isLocalHost(parsed.hostname)) {
        return { kind: 'local', host: display };
    }
    if (parsed.protocol !== 'https:') {
        return { kind: 'insecure', host: display };
    }
    const appHubEntry = lookupAppByUrl(originalUrl);
    if (appHubEntry) {
        return { kind: 'verified', name: appHubEntry.name };
    }
    return { kind: 'secure', host: display };
}

function isLocalHost(host: string): boolean {
    return (
        host === 'localhost' ||
        host === '127.0.0.1' ||
        host === '0.0.0.0' ||
        host === '::1' ||
        host.endsWith('.local') ||
        host.endsWith('.localhost') ||
        host.endsWith('.test')
    );
}

function safeParseUrl(url: string): URL | null {
    try {
        return new URL(url);
    } catch {
        return null;
    }
}
````

## Source: `cross-app-connect/src/app/components/VechainHeader.module.css`

````css
.header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: 24px 0 8px;
}

.logoBox {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
}

.logo {
    width: 48px;
    height: 48px;
}

.titleStack {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 8px;
    max-width: 24rem;
}

.title {
    font-family: var(--font-heading);
    font-weight: 600;
    font-size: 1.5rem;
    color: var(--text-strong);
    margin: 0;
}

.subtitle {
    font-size: 1.125rem;
    color: var(--text-muted);
    margin: 0;
}
````

## Source: `cross-app-connect/src/app/components/VechainHeader.tsx`

````tsx
'use client';

import { useTranslation } from 'react-i18next';
import { RequesterChip } from './RequesterChip';
import styles from './VechainHeader.module.css';

type Props = {
    title?: string;
    subtitle?: string;
    /**
     * Requester dApp's callbackUrl. When provided, renders a chip with the
     * site's favicon + hostname under the title to identify who's asking.
     */
    requesterUrl?: string;
};

export function VechainHeader({ title, subtitle, requesterUrl }: Props) {
    const { t } = useTranslation();
    const effectiveTitle = title ?? t('header.title.default');
    return (
        <header className={styles.header}>
            <div className={styles.logoBox}>
                <img
                    src="/brand/vechain-logomark-light.png"
                    alt="VeChain"
                    className={styles.logo}
                    draggable={false}
                />
            </div>
            <div className={styles.titleStack}>
                <h1 className={styles.title}>{effectiveTitle}</h1>

                {subtitle && <p className={styles.subtitle}>{subtitle}</p>}

                {requesterUrl && <RequesterChip url={requesterUrl} />}
            </div>
        </header>
    );
}
````

## Source: `cross-app-connect/src/app/components/socials.ts`

````typescript
import { FcGoogle } from 'react-icons/fc';
import { FaApple, FaDiscord, FaGithub, FaLine, FaTiktok } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { SiFarcaster } from 'react-icons/si';
import { LuPhone } from 'react-icons/lu';
import type { IconType } from 'react-icons';

export const OAUTH_PROVIDERS = [
    { id: 'google', label: 'Google', Icon: FcGoogle, tier: 'primary' },
    { id: 'apple', label: 'Apple', Icon: FaApple, tier: 'primary' },
    { id: 'twitter', label: 'X', Icon: FaXTwitter, tier: 'primary' },
    { id: 'discord', label: 'Discord', Icon: FaDiscord, tier: 'other' },
    { id: 'github', label: 'GitHub', Icon: FaGithub, tier: 'other' },
    { id: 'tiktok', label: 'TikTok', Icon: FaTiktok, tier: 'other' },
    { id: 'line', label: 'LINE', Icon: FaLine, tier: 'other' },
] as const satisfies ReadonlyArray<{
    id: string;
    label: string;
    Icon: IconType;
    tier: 'primary' | 'other';
}>;
export type OAuthProvider = (typeof OAUTH_PROVIDERS)[number]['id'];

// Brand hexes for providers whose glyph reads better in their official
// color rather than monochrome. Discord blurple, TikTok pink, LINE green.
// Phone (not OAuth) uses iMessage-style green. Apple, GitHub, X stay
// monochrome -- their wordmarks are black/white by brand.
export const BRAND_GLYPH_COLOR: Partial<Record<OAuthProvider, string>> = {
    discord: '#5865F2',
    tiktok: '#FE2C55',
    line: '#06C755',
};
export const PHONE_GLYPH_COLOR = '#34C759';
export const FARCASTER_GLYPH_COLOR = '#8A63D2';

export type LinkedSocialBadge = {
    id: string;
    label: string;
    Icon: IconType;
    color?: string;
};

/**
 * Build the list of social-icon badges the user has linked to their Privy
 * account. Reads each known OAuth provider key off the user object plus the
 * phone and farcaster top-level fields.
 */
export function linkedSocials(
    user: { phone?: unknown; farcaster?: unknown } | null | undefined,
): LinkedSocialBadge[] {
    if (!user) return [];
    const u = user as unknown as Record<string, unknown>;
    const badges: LinkedSocialBadge[] = [];
    for (const p of OAUTH_PROVIDERS) {
        if (u[p.id]) {
            badges.push({
                id: p.id,
                label: p.label,
                Icon: p.Icon,
                color: BRAND_GLYPH_COLOR[p.id],
            });
        }
    }
    if (u.phone) {
        badges.push({
            id: 'phone',
            label: 'Phone',
            Icon: LuPhone,
            color: PHONE_GLYPH_COLOR,
        });
    }
    if (u.farcaster) {
        badges.push({
            id: 'farcaster',
            label: 'Farcaster',
            Icon: SiFarcaster,
            color: FARCASTER_GLYPH_COLOR,
        });
    }
    return badges;
}
````

## Source: `cross-app-connect/src/app/cross-app/_components/SignInPanel.tsx`

````tsx
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
                                // Auto-submission used to race with the
                                // Verify button — both calling loginWithCode
                                // before `submittingCode` flipped, firing two
                                // verification requests against Privy. Keep
                                // a single submission path: typing the 6th
                                // digit just fills the input; the Verify
                                // button (which respects `submittingCode`)
                                // is the only thing that submits.
                                onComplete={setCode}
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
````

## Source: `cross-app-connect/src/app/cross-app/_lib/app-hub.json`

````json
{
  "https://bybgym.com": {
    "slug": "com.bybgym",
    "name": "BYB - Build Your Body",
    "category": "sustainability",
    "href": "https://bybgym.com"
  },
  "https://app.agent.veworld.ai": {
    "slug": "ai.veworld.agent-marketplace",
    "name": "VeWorld AI Marketplace",
    "category": "marketplaces",
    "href": "https://app.agent.veworld.ai"
  },
  "https://b3ttery.hyenaworks.xyz": {
    "slug": "com.b3ttery.hyenaworks.xyz",
    "name": "B3TTERY",
    "category": "sustainability",
    "href": "https://b3ttery.hyenaworks.xyz/"
  },
  "https://recirclerewards.app": {
    "slug": "app.recirclerewards",
    "name": "ReCircle",
    "category": "utilities",
    "href": "https://recirclerewards.app"
  },
  "https://v3tax.app": {
    "slug": "app.v3tax",
    "name": "V3Tax",
    "category": "utilities",
    "href": "https://v3tax.app"
  },
  "https://vechain.bike": {
    "slug": "com.bikademy.app",
    "name": "BIKADEMY",
    "category": "sustainability",
    "href": "https://vechain.bike/"
  },
  "https://www.b3dtime.com": {
    "slug": "com.b3dtime",
    "name": "B3DTIME",
    "category": "sustainability",
    "href": "https://www.b3dtime.com"
  },
  "https://theshits.art": {
    "slug": "art.theshits",
    "name": "The Shts",
    "category": "collectibles",
    "href": "https://theshits.art"
  },
  "https://1mpxl.site": {
    "slug": "com.1mpxl.site",
    "name": "1M PXL",
    "category": "defi",
    "href": "https://1mpxl.site/"
  },
  "https://gaspump.cc": {
    "slug": "cc.gaspump",
    "name": "Gas Pump",
    "category": "defi",
    "href": "https://gaspump.cc"
  },
  "https://play2048x.com": {
    "slug": "com.2048x.2048x",
    "name": "2048x",
    "category": "games",
    "href": "https://play2048x.com"
  },
  "https://veworld.ai": {
    "slug": "ai.veworld",
    "name": "VeWorld AI",
    "category": "marketplaces",
    "href": "https://veworld.ai"
  },
  "https://app.cleanmatedao.com": {
    "slug": "com.cleanmatedao.app",
    "name": "Cleanmate",
    "category": "utilities",
    "href": "https://app.cleanmatedao.com"
  },
  "https://h5.eatup.vet": {
    "slug": "com.eatup.vet",
    "name": "Eat Up",
    "category": "sustainability",
    "href": "https://h5.eatup.vet/"
  },
  "https://www.goatzclubnft.com": {
    "slug": "com.goatzclubnft",
    "name": "Goatz Club NFT",
    "category": "collectibles",
    "href": "https://www.goatzclubnft.com/"
  },
  "https://gopaperoo.xyz": {
    "slug": "com.gopaperoo.xyz",
    "name": "GoPaperoo!",
    "category": "sustainability",
    "href": "https://gopaperoo.xyz/"
  },
  "https://www.groncard.com": {
    "slug": "com.groncard.www",
    "name": "GronCard",
    "category": "defi",
    "href": "https://www.groncard.com"
  },
  "https://greenambassadorchallenge.com": {
    "slug": "com.greenambassadorchallenge",
    "name": "Green Ambassador Challenge",
    "category": "games",
    "href": "https://greenambassadorchallenge.com/"
  },
  "https://avoco.app": {
    "slug": "com.likapa.avoco",
    "name": "Avoco",
    "category": "sustainability",
    "href": "https://avoco.app"
  },
  "https://minomob.com": {
    "slug": "com.minomob",
    "name": "Mino Mob",
    "category": "collectibles",
    "href": "https://minomob.com"
  },
  "https://myvechain.com": {
    "slug": "com.myvechain",
    "name": "myVeChain",
    "category": "utilities",
    "href": "https://myvechain.com"
  },
  "https://www.nfbclub.com": {
    "slug": "com.nfbc",
    "name": "Non-Fungible Book Club",
    "category": "marketplaces",
    "href": "https://www.nfbclub.com/"
  },
  "https://mvanfts.com": {
    "slug": "com.mvanfts",
    "name": "MVA Fight Club",
    "category": "games",
    "href": "https://mvanfts.com"
  },
  "https://finance.mvanfts.com": {
    "slug": "com.mvanfts.finance",
    "name": "MVA Swap",
    "category": "defi",
    "href": "https://finance.mvanfts.com"
  },
  "https://pauseyourcarbon.com": {
    "slug": "com.pauseyourcarbon",
    "name": "Pause your carbon",
    "category": "sustainability",
    "href": "https://pauseyourcarbon.com/"
  },
  "https://plant2earn.xyz": {
    "slug": "com.plant2earn.xyz",
    "name": "Plant To Earn",
    "category": "sustainability",
    "href": "https://plant2earn.xyz"
  },
  "https://reuse-now.com": {
    "slug": "com.reuse-now",
    "name": "ReUse",
    "category": "sustainability",
    "href": "https://reuse-now.com"
  },
  "https://snapbox.online": {
    "slug": "com.snapbox.online",
    "name": "SnapBox",
    "category": "sustainability",
    "href": "https://snapbox.online"
  },
  "https://3dables.smuzzies.com": {
    "slug": "com.smuzzies.3dables",
    "name": "3DAbles",
    "category": "collectibles",
    "href": "https://3dables.smuzzies.com/"
  },
  "https://thorhead.com": {
    "slug": "com.thorhead",
    "name": "Thorhead",
    "category": "collectibles",
    "href": "https://thorhead.com"
  },
  "https://vaiyansworld.com": {
    "slug": "com.vaiyansworld",
    "name": "VaiyansWorld",
    "category": "collectibles",
    "href": "https://vaiyansworld.com"
  },
  "https://bmac.vecha.in": {
    "slug": "com.vechain.bmac",
    "name": "Buy me a coffee",
    "category": "utilities",
    "href": "https://bmac.vecha.in/"
  },
  "https://thesagaz.com": {
    "slug": "com.thesagaz",
    "name": "Sagaz",
    "category": "collectibles",
    "href": "https://thesagaz.com"
  },
  "https://insight.vecha.in": {
    "slug": "com.vechain.insight",
    "name": "Insight",
    "category": "utilities",
    "href": "https://insight.vecha.in/"
  },
  "https://inspector.vecha.in": {
    "slug": "com.vechain.inspector",
    "name": "Inspector",
    "category": "utilities",
    "href": "https://inspector.vecha.in"
  },
  "https://mysteryboxes.contest.vebetter.com": {
    "slug": "com.vechain.mysteryboxes",
    "name": "Mystery Boxes",
    "category": "games",
    "href": "https://mysteryboxes.contest.vebetter.com/"
  },
  "https://vevote.vechain.org": {
    "slug": "com.vechain.vevote",
    "name": "VeVote",
    "category": "utilities",
    "href": "https://vevote.vechain.org/"
  },
  "https://manager.vechainstats.com": {
    "slug": "com.vechainstats.manager",
    "name": "Manager",
    "category": "utilities",
    "href": "https://manager.vechainstats.com/"
  },
  "https://win.vet": {
    "slug": "com.vechain.vewin",
    "name": "VeWin",
    "category": "games",
    "href": "https://win.vet"
  },
  "https://vefam.com": {
    "slug": "com.vefam.pixelpuffs",
    "name": "PixelPuffs NFT",
    "category": "collectibles",
    "href": "https://vefam.com/projects/pixel-puffs/"
  },
  "https://vechainstats.com": {
    "slug": "com.vechainstats",
    "name": "VeChainStats",
    "category": "utilities",
    "href": "https://vechainstats.com/"
  },
  "https://vyvo.com": {
    "slug": "com.vyvo.www",
    "name": "Vyvo",
    "category": "sustainability",
    "href": "https://vyvo.com"
  },
  "https://www.veproof.com": {
    "slug": "com.veproof",
    "name": "VeProof",
    "category": "utilities",
    "href": "https://www.veproof.com"
  },
  "https://vpunks.com": {
    "slug": "com.vpunks",
    "name": "VPunks",
    "category": "collectibles",
    "href": "https://vpunks.com"
  },
  "https://app.verocket.com": {
    "slug": "com.verocket.app",
    "name": "VeRocket (ZumoSwap)",
    "category": "defi",
    "href": "https://app.verocket.com"
  },
  "https://wattly-app.com": {
    "slug": "com.wattly-app",
    "name": "Wattly",
    "category": "sustainability",
    "href": "https://wattly-app.com"
  },
  "https://walkie.space": {
    "slug": "com.walkie.space",
    "name": "Walkie",
    "category": "sustainability",
    "href": "https://walkie.space"
  },
  "https://worldofv.art": {
    "slug": "com.worldofv.expluslottery",
    "name": "VeBounce Lottery Event",
    "category": "games",
    "href": "https://worldofv.art/playground/lottery/vebounce-blockchain-lottery"
  },
  "https://staking.worldofv.art": {
    "slug": "com.worldofv.staking",
    "name": "WoV Staking",
    "category": "defi",
    "href": "https://staking.worldofv.art/"
  },
  "https://vehashes.club": {
    "slug": "com.worldofv.vehashes",
    "name": "VeHashes",
    "category": "collectibles",
    "href": "https://vehashes.club/"
  },
  "https://vet.domains": {
    "slug": "domains.vet",
    "name": "vet.domains",
    "category": "utilities",
    "href": "https://vet.domains/"
  },
  "https://ramp.vechain.energy": {
    "slug": "energy.vechain.ramp",
    "name": "Fiat On-Ramp",
    "category": "defi",
    "href": "https://ramp.vechain.energy/"
  },
  "https://revoke.vechain.energy": {
    "slug": "energy.vechain.revoke",
    "name": "Revoke Management",
    "category": "defi",
    "href": "https://revoke.vechain.energy/"
  },
  "https://vechain.energy": {
    "slug": "energy.vechain",
    "name": "vechain.energy · blockchain development platform",
    "category": "utilities",
    "href": "https://vechain.energy/"
  },
  "https://swap.vechain.energy": {
    "slug": "energy.vechain.swap",
    "name": "Token Swap / Exchange",
    "category": "defi",
    "href": "https://swap.vechain.energy/"
  },
  "https://clayworld.turtlelabs.finance": {
    "slug": "finance.turtlelabs.clayworld",
    "name": "Clay World",
    "category": "collectibles",
    "href": "https://clayworld.TurtleLabs.Finance"
  },
  "https://wipe.tools.vechain.energy": {
    "slug": "energy.vechain.tools.wipe",
    "name": "Empty Wallet",
    "category": "utilities",
    "href": "https://wipe.tools.vechain.energy/"
  },
  "https://vtho.exchange": {
    "slug": "exchange.vtho",
    "name": "VTHO Exchange",
    "category": "defi",
    "href": "https://vtho.exchange/"
  },
  "https://dreamchicks.turtlelabs.finance": {
    "slug": "finance.turtlelabs.dreamchicks",
    "name": "Dream Chicks",
    "category": "collectibles",
    "href": "https://dreamchicks.TurtleLabs.Finance"
  },
  "https://pepeplug.turtlelabs.finance": {
    "slug": "finance.turtlelabs.pepeplug",
    "name": "Pepe Plugs",
    "category": "collectibles",
    "href": "https://pepeplug.turtlelabs.finance/"
  },
  "https://bangzboardz.turtlelabs.finance": {
    "slug": "finance.turtlelabs.bangzboardz",
    "name": "Bangz Boardz",
    "category": "defi",
    "href": "https://BangzBoardz.TurtleLabs.Finance"
  },
  "https://turtleswap.turtlelabs.finance": {
    "slug": "finance.turtlelabs.turtleswap",
    "name": "Turtle Swap",
    "category": "defi",
    "href": "https://TurtleSwap.TurtleLabs.Finance"
  },
  "https://www.betterswap.io": {
    "slug": "io.betterswap",
    "name": "BetterSwap",
    "category": "defi",
    "href": "https://www.betterswap.io"
  },
  "https://vearn.finance": {
    "slug": "finance.vearn",
    "name": "Vearn Finance",
    "category": "defi",
    "href": "https://vearn.finance"
  },
  "https://squadvechain.fun": {
    "slug": "fun.squadvechain",
    "name": "SQUAD VeChain",
    "category": "defi",
    "href": "https://SquadVechain.fun/"
  },
  "https://psychobeasts.turtlelabs.finance": {
    "slug": "finance.turtlelabs.psychobeasts",
    "name": "Psycho Beasts",
    "category": "collectibles",
    "href": "https://psychobeasts.TurtleLabs.Finance"
  },
  "https://bubbles.green": {
    "slug": "green.bubbles",
    "name": "Bubbles",
    "category": "sustainability",
    "href": "https://bubbles.green"
  },
  "https://squadtc.fun": {
    "slug": "fun.squadtc",
    "name": "Squad Trading Cards Dapp",
    "category": "collectibles",
    "href": "https://squadtc.fun"
  },
  "https://dthor.io": {
    "slug": "io.dthor",
    "name": "DThor Swap",
    "category": "defi",
    "href": "https://dthor.io/#/?network=vechain&from=apphub"
  },
  "https://app.dappies.io": {
    "slug": "io.dappies",
    "name": "Dappies",
    "category": "sustainability",
    "href": "https://app.dappies.io"
  },
  "https://gangstergorillaz.io": {
    "slug": "io.gangstergorillaz",
    "name": "Gangster Gorillaz.",
    "category": "collectibles",
    "href": "https://gangstergorillaz.io/"
  },
  "https://evearn.io": {
    "slug": "io.evearn",
    "name": "Evearn",
    "category": "sustainability",
    "href": "https://evearn.io"
  },
  "https://app.juicyfinance.io": {
    "slug": "io.juicyfinance",
    "name": "Juicy Finance",
    "category": "defi",
    "href": "https://app.juicyfinance.io"
  },
  "https://app.safeswap.io": {
    "slug": "io.safeswap.app",
    "name": "SafeSwap",
    "category": "defi",
    "href": "https://app.safeswap.io"
  },
  "https://realitems.io": {
    "slug": "io.realitems",
    "name": "Real Items",
    "category": "utilities",
    "href": "https://realitems.io"
  },
  "https://vebetter.stellapay.io": {
    "slug": "io.stellapay.vebetter",
    "name": "Stella Pay",
    "category": "utilities",
    "href": "https://vebetter.stellapay.io/"
  },
  "https://vestation.io": {
    "slug": "io.vestation",
    "name": "VeStation",
    "category": "defi",
    "href": "https://vestation.io/"
  },
  "https://veswap.io": {
    "slug": "io.veswap",
    "name": "VeSwap",
    "category": "defi",
    "href": "https://veswap.io/"
  },
  "https://disperse.me": {
    "slug": "me.disperse",
    "name": "Disperse",
    "category": "utilities",
    "href": "https://disperse.me"
  },
  "https://www.mendify.me": {
    "slug": "me.mendify",
    "name": "Mendify",
    "category": "sustainability",
    "href": "https://www.mendify.me"
  },
  "https://spotter.zeloop.net": {
    "slug": "net.zeloop.spotter",
    "name": "A ZeLoop Spotter",
    "category": "sustainability",
    "href": "https://spotter.zeloop.net/"
  },
  "https://b3trbeach.org": {
    "slug": "org.b3trbeach",
    "name": "B3TR Beach",
    "category": "utilities",
    "href": "https://b3trbeach.org/app"
  },
  "https://hangndry.org": {
    "slug": "org.hangndry",
    "name": "HangnDry",
    "category": "sustainability",
    "href": "https://hangndry.org"
  },
  "https://dapp.carbonlarity.org": {
    "slug": "org.carbonlarity.dapp",
    "name": "Carbonlarity",
    "category": "sustainability",
    "href": "https://dapp.carbonlarity.org"
  },
  "https://app.glodollar.org": {
    "slug": "org.glodollar.app",
    "name": "Glo Dollar App",
    "category": "defi",
    "href": "https://app.glodollar.org"
  },
  "https://envelop.favo.org": {
    "slug": "org.favo.envelop",
    "name": "Message Exchange",
    "category": "utilities",
    "href": "https://envelop.favo.org/"
  },
  "https://redeno.org": {
    "slug": "org.redeno",
    "name": "Redeno",
    "category": "defi",
    "href": "https://redeno.org/"
  },
  "https://thearborapp.org": {
    "slug": "org.thearborapp",
    "name": "Arbor",
    "category": "utilities",
    "href": "https://thearborapp.org/"
  },
  "https://bridge.wanchain.org": {
    "slug": "org.bridge.wanchain",
    "name": "WanBridge",
    "category": "defi",
    "href": "https://bridge.wanchain.org/"
  },
  "https://relayers.vebetterdao.org": {
    "slug": "org.vebetterdao.relayers",
    "name": "VeBetter Relayers",
    "category": "utilities",
    "href": "https://relayers.vebetterdao.org"
  },
  "https://governance.vebetterdao.org": {
    "slug": "org.vebetterdao.governance",
    "name": "VeBetter",
    "category": "defi",
    "href": "https://governance.vebetterdao.org"
  },
  "https://nfbclub.marketplace.vechain.org": {
    "slug": "org.vechain.marketplace.nfbc",
    "name": "Non-Fungible Book Club Marketplace",
    "category": "marketplaces",
    "href": "https://nfbclub.marketplace.vechain.org/"
  },
  "https://connect.vebetterdao.org": {
    "slug": "org.vebetterdao.connect",
    "name": "VeChain Discord Connect",
    "category": "utilities",
    "href": "https://connect.vebetterdao.org"
  },
  "https://stargate.marketplace.vechain.org": {
    "slug": "org.vechain.marketplace.stargate",
    "name": "StarGate Marketplace",
    "category": "marketplaces",
    "href": "https://stargate.marketplace.vechain.org/"
  },
  "https://solarwise.marketplace.vechain.org": {
    "slug": "org.vechain.marketplace.solarwise",
    "name": "Solarwise Marketplace",
    "category": "marketplaces",
    "href": "https://solarwise.marketplace.vechain.org/"
  },
  "https://b3trsmile.site": {
    "slug": "site.b3trsmile",
    "name": "B3TR Smile",
    "category": "sustainability",
    "href": "https://b3trsmile.site"
  },
  "https://app.rewards.vechain.org": {
    "slug": "org.vechain.rewards.app",
    "name": "vechain Rewards dApp",
    "category": "defi",
    "href": "https://app.rewards.vechain.org"
  },
  "https://vechainkit.vechain.org": {
    "slug": "org.vechain.vechainkit",
    "name": "VeChain Kit",
    "category": "utilities",
    "href": "https://vechainkit.vechain.org/"
  },
  "https://smart-accounts.vechain.org": {
    "slug": "smart-accounts.io.github.vechain",
    "name": "VeChain Smart Accounts",
    "category": "utilities",
    "href": "https://smart-accounts.vechain.org"
  },
  "https://betterbag.vet": {
    "slug": "vet.betterbag",
    "name": "BetterBag",
    "category": "sustainability",
    "href": "https://betterbag.vet"
  },
  "https://app.bigbottle.vet": {
    "slug": "vet.bigbottle.app",
    "name": "BigBottle",
    "category": "sustainability",
    "href": "https://app.bigbottle.vet"
  },
  "https://app.stargate.vechain.org": {
    "slug": "org.vechain.stargate.app",
    "name": "StarGate",
    "category": "utilities",
    "href": "https://app.stargate.vechain.org/"
  },
  "https://games.sproutlyrwa.com": {
    "slug": "sproutly.inc.vet",
    "name": "Sproutly Inc.",
    "category": "utilities",
    "href": "https://games.sproutlyrwa.com/get-started"
  },
  "https://app.bitegram.vet": {
    "slug": "vet.bitegram",
    "name": "BiteGram",
    "category": "sustainability",
    "href": "https://app.bitegram.vet"
  },
  "https://bridge.vet": {
    "slug": "vet.bridge",
    "name": "bridge.vet",
    "category": "defi",
    "href": "https://bridge.vet/"
  },
  "https://bettermode.vet": {
    "slug": "vet.bettermode",
    "name": "BetterMode",
    "category": "sustainability",
    "href": "https://bettermode.vet"
  },
  "https://app.greencart.ai": {
    "slug": "vet.greencart",
    "name": "Greencart",
    "category": "sustainability",
    "href": "https://app.greencart.ai"
  },
  "https://app.byebyebites.vet": {
    "slug": "vet.byebyebites",
    "name": "Bye Bye Bites",
    "category": "sustainability",
    "href": "https://app.byebyebites.vet"
  },
  "https://mugshot.vet": {
    "slug": "vet.mugshot",
    "name": "Mugshot",
    "category": "sustainability",
    "href": "https://mugshot.vet"
  },
  "https://justote.vet": {
    "slug": "vet.justote",
    "name": "JusTote",
    "category": "sustainability",
    "href": "https://justote.vet"
  },
  "https://nanoact.vet": {
    "slug": "vet.nanoact",
    "name": "NanoAct",
    "category": "sustainability",
    "href": "https://nanoact.vet"
  },
  "https://app.powerup.vet": {
    "slug": "vet.powerup.app",
    "name": "Power Up!",
    "category": "sustainability",
    "href": "https://app.powerup.vet"
  },
  "https://app.cleanify.vet": {
    "slug": "vet.cleanify",
    "name": "Cleanify",
    "category": "sustainability",
    "href": "https://app.cleanify.vet"
  },
  "https://scoopup.vet": {
    "slug": "vet.scoopup",
    "name": "ScoopUp",
    "category": "sustainability",
    "href": "https://scoopup.vet"
  },
  "https://app.solarwise.vet": {
    "slug": "vet.solarwise.app",
    "name": "Solarwise",
    "category": "defi",
    "href": "https://app.solarwise.vet"
  },
  "https://st3pr.vet": {
    "slug": "vet.st3pr",
    "name": "ST3PR",
    "category": "sustainability",
    "href": "https://st3pr.vet"
  },
  "https://app.trashdash.vet": {
    "slug": "vet.trashdash",
    "name": "TrashDash",
    "category": "sustainability",
    "href": "https://app.trashdash.vet"
  },
  "https://velottery.vet": {
    "slug": "vet.velottery",
    "name": "VeLottery",
    "category": "games",
    "href": "https://velottery.vet/"
  },
  "https://vedelegate.vet": {
    "slug": "vet.vedelegate",
    "name": "veDelegate.vet",
    "category": "defi",
    "href": "https://vedelegate.vet"
  },
  "https://ecomeal.vet": {
    "slug": "vet.ecomeal",
    "name": "EcoMeal",
    "category": "sustainability",
    "href": "https://ecomeal.vet"
  },
  "https://ecobag.solutions": {
    "slug": "vet.ecobag",
    "name": "ecobag",
    "category": "sustainability",
    "href": "https://ecobag.solutions/"
  },
  "https://verecycle.vet": {
    "slug": "vet.verecycle",
    "name": "VeRecycle",
    "category": "sustainability",
    "href": "https://verecycle.vet"
  },
  "https://vetrade.vet": {
    "slug": "vet.vetrade",
    "name": "VeTrade",
    "category": "defi",
    "href": "https://vetrade.vet/"
  },
  "https://vaultx-nfts.xyz": {
    "slug": "xyz.vaultx-nfts",
    "name": "VaultX",
    "category": "defi",
    "href": "https://vaultx-nfts.xyz"
  },
  "https://www.velottery.xyz": {
    "slug": "xyz.velottery",
    "name": "VeLottery",
    "category": "games",
    "href": "https://www.velottery.xyz/"
  },
  "https://bubblycaps.xyz": {
    "slug": "xyz.bubblycaps",
    "name": "Bubbly Caps Dapp",
    "category": "collectibles",
    "href": "https://bubblycaps.xyz"
  }
}
````

## Source: `cross-app-connect/src/app/cross-app/_lib/app-hub.ts`

````typescript
/**
 * Runtime lookup against the snapshot of vechain/app-hub baked at build time.
 * Refresh the snapshot with:
 *
 *   yarn workspace cross-app-connect generate-app-hub
 *
 * (the script lives at cross-app-connect/scripts/fetch-app-hub.mjs).
 */
import data from './app-hub.json';

export type AppHubEntry = {
    slug: string;
    name: string;
    category: string | null;
    href: string;
};

const REGISTRY = data as Record<string, AppHubEntry>;

export function lookupAppByUrl(url: string | undefined): AppHubEntry | null {
    if (!url) return null;
    try {
        const origin = new URL(url).origin;
        return REGISTRY[origin] ?? null;
    } catch {
        return null;
    }
}
````

## Source: `cross-app-connect/src/app/cross-app/_lib/appConfig.ts`

````typescript
/**
 * Inlined VeChain mainnet/testnet contract addresses, ported from
 * `@vechain/vechain-kit/src/config/{mainnet,testnet}.ts`. Used by
 * `resolveContractLabel` to identify known VeChain-maintained contracts so
 * the transact UI can mark them as verified rather than rendering a raw
 * truncated hex string.
 *
 * Keep in sync with the kit if a new contract is added to its appConfig.
 */

export type KnownContracts = {
    vthoContractAddress: string;
    b3trContractAddress: string;
    vot3ContractAddress: string;
    b3trGovernorAddress: string;
    timelockContractAddress: string;
    xAllocationPoolContractAddress: string;
    xAllocationVotingContractAddress: string;
    emissionsContractAddress: string;
    voterRewardsContractAddress: string;
    galaxyMemberContractAddress: string;
    treasuryContractAddress: string;
    x2EarnAppsContractAddress: string;
    x2EarnCreatorContractAddress: string;
    x2EarnRewardsPoolContractAddress: string;
    nodeManagementContractAddress: string;
    veBetterPassportContractAddress: string;
    veDelegateTokenContractAddress: string;
    veDelegate: string;
    veDelegateVotes: string;
    oracleContractAddress: string;
    accountFactoryAddress: string;
    cleanifyCampaignsContractAddress: string;
    cleanifyChallengesContractAddress: string;
    veWorldSubdomainClaimerContractAddress: string;
    vetDomainsContractAddress: string;
    vetDomainsPublicResolverAddress: string;
    vetDomainsReverseRegistrarAddress: string;
    vnsResolverAddress: string;
    sassContractAddress: string;
    vvetContractAddress: string;
    stargateContractAddress: string;
    stargateNftContractAddress: string;
    // DEX router addresses (not in the kit's AppConfig — sourced from
    // `packages/vechain-kit/src/utils/swap/*`).
    betterSwapRouterAddress: string;
    veTradeRouterAddress: string;
    veTradeCustomRouterAddress: string;
};

const MAINNET: KnownContracts = {
    vthoContractAddress: '0x0000000000000000000000000000456E65726779',
    b3trContractAddress: '0x5ef79995FE8a89e0812330E4378eB2660ceDe699',
    vot3ContractAddress: '0x76Ca782B59C74d088C7D2Cce2f211BC00836c602',
    b3trGovernorAddress: '0x1c65C25fABe2fc1bCb82f253fA0C916a322f777C',
    timelockContractAddress: '0x7B7EaF620d88E38782c6491D7Ce0B8D8cF3227e4',
    xAllocationPoolContractAddress:
        '0x4191776F05f4bE4848d3f4d587345078B439C7d3',
    xAllocationVotingContractAddress:
        '0x89A00Bb0947a30FF95BEeF77a66AEdE3842Fe5B7',
    emissionsContractAddress: '0xDf94739bd169C84fe6478D8420Bb807F1f47b135',
    voterRewardsContractAddress: '0x838A33AF756a6366f93e201423E1425f67eC0Fa7',
    galaxyMemberContractAddress: '0x93B8cD34A7Fc4f53271b9011161F7A2B5fEA9D1F',
    treasuryContractAddress: '0xD5903BCc66e439c753e525F8AF2FeC7be2429593',
    x2EarnAppsContractAddress: '0x8392B7CCc763dB03b47afcD8E8f5e24F9cf0554D',
    x2EarnRewardsPoolContractAddress:
        '0x6Bee7DDab6c99d5B2Af0554EaEA484CE18F52631',
    x2EarnCreatorContractAddress: '0xe8e96a768ffd00417d4bd985bec9EcfC6F732a7f',
    nodeManagementContractAddress: '0xB0EF9D89C6b49CbA6BBF86Bf2FDf0Eee4968c6AB',
    veBetterPassportContractAddress:
        '0x35a267671d8EDD607B2056A9a13E7ba7CF53c8b3',
    veDelegate: '0xfc32a9895C78CE00A1047d602Bd81Ea8134CC32b',
    veDelegateVotes: '0xeb71148c9B3cd57e228c2152d79f6e78F5F1ef9a',
    veDelegateTokenContractAddress:
        '0xD3f7b82Df5705D34f64C634d2dEf6B1cB3116950',
    oracleContractAddress: '0x49eC7192BF804Abc289645ca86F1eD01a6C17713',
    accountFactoryAddress: '0xC06Ad8573022e2BE416CA89DA47E8c592971679A',
    cleanifyCampaignsContractAddress:
        '0x7a11D63338576aE8c038868433ea199d7E5319A6',
    cleanifyChallengesContractAddress:
        '0xa58681692AdDD2e8E37f9113D40Bb9253C03F65e',
    veWorldSubdomainClaimerContractAddress:
        '0xa4173c32fe8a61a8fd0d0234675b559fc360446a',
    vetDomainsContractAddress: '0xa9231da8BF8D10e2df3f6E03Dd5449caD600129b',
    vetDomainsPublicResolverAddress:
        '0xabac49445584C8b6c1472b030B1076Ac3901D7cf',
    vetDomainsReverseRegistrarAddress:
        '0x5c970901a587BA3932C835D4ae5FAE2BEa7e78Bc',
    vnsResolverAddress: '0xA11413086e163e41901bb81fdc5617c975Fa5a1A',
    sassContractAddress: '0x84b0caf6436aace4e21d10f126963fdd53ac31ea',
    vvetContractAddress: '0x45429A2255e7248e57fce99E7239aED3f84B7a53',
    stargateContractAddress: '0x03C557bE98123fdb6faD325328AC6eB77de7248C',
    stargateNftContractAddress: '0x1856c533ac2d94340aaa8544d35a5c1d4a21dee7',
    betterSwapRouterAddress: '0xf21Dd7108D93af56FaB07423EfB90F4a3604DA89',
    veTradeRouterAddress: '0xE5fA980a6EfE5B79C2150a529da06AeF455963b6',
    veTradeCustomRouterAddress: '0x7C755EC0165fCD926cC6faB10E7BB16a72E9f34A',
};

// Testnet contract addresses are out of scope for this host (cross-app
// requesters running on testnet bring their own dapp; the host doesn't
// need a separate mapping unless we want to label them too).
const TESTNET: Partial<KnownContracts> = {
    vthoContractAddress: '0x0000000000000000000000000000456E65726779',
    accountFactoryAddress: '0x713b908Bcf77f3E00EFEf328E50b657a1A23AeaF',
};

// Validate explicitly — an unexpected value otherwise sneaks past the
// `as` cast and silently falls back to undefined when indexed.
const rawNetworkType = process.env.NEXT_PUBLIC_NETWORK_TYPE;
const NETWORK_TYPE: 'main' | 'test' =
    rawNetworkType === 'test' ? 'test' : 'main';

export const knownContracts: KnownContracts =
    NETWORK_TYPE === 'main' ? MAINNET : ({ ...MAINNET, ...TESTNET } as KnownContracts);
````

## Source: `cross-app-connect/src/app/cross-app/_lib/client.ts`

````typescript
'use client';

import { useMemo } from 'react';
import { createClient } from '@privy-io/cross-app-provider/connect';

export const useCrossAppClient = () =>
    useMemo(() => {
        const privyDomain = process.env.NEXT_PUBLIC_PRIVY_DOMAIN;
        if (!privyDomain) {
            throw new Error(
                'NEXT_PUBLIC_PRIVY_DOMAIN is required. Set it to the whitelabel ' +
                    'auth subdomain provisioned in the Privy dashboard (e.g. ' +
                    'https://privy.your-app.privy.dev).',
            );
        }
        const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
        if (!appId) {
            throw new Error(
                'NEXT_PUBLIC_PRIVY_APP_ID is required. Set it to the Privy ' +
                    'app id provisioned for the whitelabel cross-app host.',
            );
        }
        return createClient({
            appId,
            appClientId: process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID,
            privyDomain,
        });
    }, []);
````

## Source: `cross-app-connect/src/app/cross-app/_lib/contracts.ts`

````typescript
/**
 * Resolve a raw address into a human-readable contract label so the user
 * can tell a real contract from a phishing spoof. The registry walks a
 * known-contracts map (inlined from the kit's mainnet config) and labels
 * each entry.
 *
 * Verified = present in `knownContracts`. Anything else gets an
 * "Unverified" treatment so the UI shows a warning rather than silently
 * rendering a truncated hex string.
 */
import { knownContracts, type KnownContracts } from './appConfig';

export type ContractLabel = {
    label: string;
    verified: boolean;
};

const APP_CONFIG_LABELS: Partial<Record<keyof KnownContracts, string>> = {
    vthoContractAddress: 'VTHO Token',
    b3trContractAddress: 'B3TR Token',
    vot3ContractAddress: 'VOT3 Token',
    b3trGovernorAddress: 'VeBetter Governor',
    timelockContractAddress: 'Timelock',
    xAllocationPoolContractAddress: 'X-Allocation Pool',
    xAllocationVotingContractAddress: 'X-Allocation Voting',
    emissionsContractAddress: 'Emissions',
    voterRewardsContractAddress: 'Voter Rewards',
    galaxyMemberContractAddress: 'Galaxy Member',
    treasuryContractAddress: 'VeBetter Treasury',
    x2EarnAppsContractAddress: 'X2Earn Apps Registry',
    x2EarnCreatorContractAddress: 'X2Earn Creator',
    x2EarnRewardsPoolContractAddress: 'X2Earn Rewards Pool',
    nodeManagementContractAddress: 'Node Management',
    veBetterPassportContractAddress: 'VeBetter Passport',
    veDelegateTokenContractAddress: 'veDelegate Token',
    oracleContractAddress: 'Oracle',
    accountFactoryAddress: 'Smart Account Factory',
    cleanifyCampaignsContractAddress: 'Cleanify Campaigns',
    cleanifyChallengesContractAddress: 'Cleanify Challenges',
    veWorldSubdomainClaimerContractAddress: 'VeWorld Subdomain Claimer',
    vetDomainsContractAddress: 'VeChain Domains',
    vetDomainsPublicResolverAddress: 'VeChain Domains Resolver',
    vetDomainsReverseRegistrarAddress: 'VeChain Domains Reverse Registrar',
    vnsResolverAddress: 'VNS Resolver',
    sassContractAddress: 'SASS Token',
    vvetContractAddress: 'vVET',
    stargateContractAddress: 'Stargate',
    stargateNftContractAddress: 'Stargate NFT',
    veDelegate: 'veDelegate',
    veDelegateVotes: 'veDelegate Votes',
};

export function resolveContractLabel(
    address: string | undefined,
): ContractLabel | null {
    if (!address) return null;
    const lower = address.toLowerCase();

    for (const [field, label] of Object.entries(APP_CONFIG_LABELS) as Array<
        [keyof KnownContracts, string]
    >) {
        const value = knownContracts[field];
        if (typeof value === 'string' && value.toLowerCase() === lower) {
            return { label, verified: true };
        }
    }

    return null;
}
````

## Source: `cross-app-connect/src/app/cross-app/_lib/decoder.ts`

````typescript
/**
 * Translates raw VeChain clauses into plain-language summaries the average
 * (non-crypto) user can understand. Three layers:
 *
 *  1. Native VET transfer (no calldata, value > 0) -> "Send X VET".
 *  2. ERC-20 transfer / approve (4-byte selector match) -> "Send X B3TR",
 *     "Allow up to Y USDC", or "Allow unlimited B3TR spending". Token symbol
 *     and decimals come from the kit's address book (B3TR / VOT3 / VTHO) or
 *     a live Thor read on the token's ERC-20 metadata, whichever resolves
 *     first.
 *  3. Anything else -> b32 lookup at https://b32.vecha.in/ for a human-
 *     readable function name; falls back to "Interact with contract" if
 *     the selector is unknown.
 *
 *  The transact page treats any 'unknown' result as a "couldn't be checked"
 *  warning so equally-loud rows don't make malicious calls look as safe as
 *  benign ones.
 */
import {
    decodeFunctionData,
    formatUnits,
    parseAbi,
    isAddress,
} from 'viem';
import type { ThorClient } from '@vechain/sdk-network';
import { type NETWORK_TYPE, getConfig } from './network-tokens';
import {
    recognizeKnownAction,
    type KnownAction,
    type KnownActionCategory,
    type KnownActionData,
} from './knownActions';
import i18n from '../../i18n/config';

const t = i18n.t.bind(i18n);

const ERC20_ABI = parseAbi([
    'function transfer(address to, uint256 amount)',
    'function approve(address spender, uint256 amount)',
    'function transferFrom(address from, address to, uint256 amount)',
]);

const ERC20_METADATA_ABI = parseAbi([
    'function symbol() view returns (string)',
    'function decimals() view returns (uint8)',
]);

const SELECTOR_TRANSFER = '0xa9059cbb';
const SELECTOR_APPROVE = '0x095ea7b3';
const SELECTOR_TRANSFER_FROM = '0x23b872dd';

// Treat anything above 2^240 as "unlimited" — covers UI tools that send
// 2^256-1, 2^255-1, etc. BigInt() constructor (not the `n` suffix) so the
// kit's ES5 tsconfig target is happy.
const UNLIMITED_THRESHOLD = BigInt(1) << BigInt(240);
const ZERO = BigInt(0);

export type Clause = { to: string; value: string; data: string };

export type TokenInfo = {
    address: string;
    symbol: string;
    decimals: number;
};

export type DecodedClause =
    | {
          kind: 'native_transfer';
          summary: string;
          recipient: string;
          amount: string;
      }
    | {
          kind: 'token_transfer';
          summary: string;
          token: TokenInfo;
          recipient: string;
          amount: string;
      }
    | {
          kind: 'token_approve';
          summary: string;
          token: TokenInfo;
          spender: string;
          amount: string;
          unlimited: boolean;
      }
    | {
          // Ecosystem-recognized call (VeChain Kit domain ops, VeBetterDAO
          // governance, NFT transfers, etc.). Treated as fully understood —
          // no "couldn't double-check" warning fires for these.
          kind: 'known_action';
          summary: string;
          detail?: string;
          category: KnownActionCategory;
          recipient?: string;
          spender?: string;
          /** Structured fields the batch subtitle logic reads instead of
           *  parsing localized summaries. Populated by each known-action
           *  decoder when relevant; see `KnownActionData` in knownActions.ts. */
          data?: KnownActionData;
      }
    | {
          kind: 'unknown';
          summary: string;
          selector?: string;
          functionName?: string;
          signature?: string;
      };

export async function decodeClause(
    clause: Clause,
    thor: ThorClient | null,
    network: NETWORK_TYPE,
    self?: string,
    /** Lowercased address of the generic delegator's deposit account. When
     *  set, clauses transferring VET / VTHO / B3TR / VOT3 to this address
     *  are re-labelled as "Pay transaction fee" instead of an opaque
     *  "Send X VET to 0x86…fa" — the user understands the clause exists
     *  to fund the gas payer, not as a separate transfer. */
    feeDepositAccount?: string,
): Promise<DecodedClause> {
    const data = (clause.data ?? '0x').toLowerCase();
    const value = (() => {
        try {
            return BigInt(clause.value || '0');
        } catch {
            return ZERO;
        }
    })();

    const isFeeDeposit = (recipient: string): boolean =>
        !!feeDepositAccount &&
        recipient.toLowerCase() === feeDepositAccount;

    // 1. Native VET transfer
    if ((data === '0x' || data === '') && value > ZERO) {
        const amount = formatUnits(value, 18);
        if (isFeeDeposit(clause.to)) {
            return {
                kind: 'known_action',
                category: 'fee',
                recipient: clause.to,
                summary: t('action.fee.payTransactionFee'),
                detail: t('action.fee.amount', {
                    amount: trimAmount(amount),
                    symbol: 'VET',
                }),
            };
        }
        return {
            kind: 'native_transfer',
            recipient: clause.to,
            amount,
            summary: t('action.transfer.native', { amount: trimAmount(amount) }),
        };
    }

    // 2. ERC-20 transfer / approve
    if (data.length >= 10 && isAddress(clause.to as `0x${string}`)) {
        const selector = data.slice(0, 10);
        if (
            selector === SELECTOR_TRANSFER ||
            selector === SELECTOR_APPROVE
        ) {
            try {
                const decoded = decodeFunctionData({
                    abi: ERC20_ABI,
                    data: data as `0x${string}`,
                });
                const token = await lookupToken(
                    clause.to,
                    network,
                    thor,
                );
                if (decoded.functionName === 'transfer') {
                    const [recipient, raw] = decoded.args as [
                        string,
                        bigint,
                    ];
                    const amount = formatUnits(raw, token.decimals);
                    if (isFeeDeposit(recipient)) {
                        return {
                            kind: 'known_action',
                            category: 'fee',
                            recipient,
                            summary: t('action.fee.payTransactionFee'),
                            detail: t('action.fee.amount', {
                                amount: trimAmount(amount),
                                symbol: token.symbol,
                            }),
                        };
                    }
                    return {
                        kind: 'token_transfer',
                        recipient,
                        token,
                        amount,
                        summary: t('action.transfer.token', {
                            amount: trimAmount(amount),
                            symbol: token.symbol,
                        }),
                    };
                }
                if (decoded.functionName === 'approve') {
                    const [spender, raw] = decoded.args as [
                        string,
                        bigint,
                    ];
                    const unlimited = raw >= UNLIMITED_THRESHOLD;
                    const amount = unlimited
                        ? 'unlimited'
                        : formatUnits(raw, token.decimals);
                    return {
                        kind: 'token_approve',
                        spender,
                        token,
                        amount,
                        unlimited,
                        summary: unlimited
                            ? t('action.approve.unlimited', {
                                  symbol: token.symbol,
                              })
                            : t('action.approve.upTo', {
                                  amount: trimAmount(amount),
                                  symbol: token.symbol,
                              }),
                    };
                }
            } catch {
                // fall through to unknown / b32 lookup
            }
        }
        if (selector === SELECTOR_TRANSFER_FROM) {
            // Falls through to the known-action recognizer below, which
            // handles ERC-721 transferFrom and ERC-20 pull-style transfers.
        }
    }

    // 3. Ecosystem-recognized calls — VeChain Kit domain ops, VeBetterDAO
    // governance, NFT transfers, etc. Defined in `knownActions.ts`.
    const known = recognizeKnownAction(clause.to, data, { self });
    if (known) {
        return {
            kind: 'known_action',
            summary: known.summary,
            detail: known.detail,
            category: known.category,
            recipient: known.recipient,
            spender: known.spender,
            data: known.data,
        };
    }

    // 4. b32 fallback — at least show the function name when known.
    if (data.length >= 10) {
        const selector = data.slice(0, 10);
        const sig = await fetchB32Signature(selector);
        if (sig) {
            const fnName = sig.split('(')[0];
            return {
                kind: 'unknown',
                selector,
                functionName: fnName,
                signature: sig,
                summary: t('action.unknown.runOn', { fn: humanize(fnName) }),
            };
        }
        return {
            kind: 'unknown',
            selector,
            summary: t('action.unknown.interact'),
        };
    }

    return {
        kind: 'unknown',
        summary: t('action.unknown.interact'),
    };
}

// Strip trailing zeros and excessive decimals: 10.000000000000000000 -> 10,
// 0.123456789012345678 -> 0.123456789012345678 (kept as-is for tokens with
// long fractional parts). Limit to 6 fractional digits for readability.
function trimAmount(amount: string): string {
    if (!amount.includes('.')) return amount;
    const [whole, frac] = amount.split('.');
    const trimmedFrac = frac.replace(/0+$/, '').slice(0, 6);
    return trimmedFrac.length === 0 ? whole : `${whole}.${trimmedFrac}`;
}

function humanize(fnName: string): string {
    // camelCase -> "camel case", then capitalise.
    const spaced = fnName.replace(/([A-Z])/g, ' $1').toLowerCase().trim();
    return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

const b32Cache = new Map<string, string | null>();

async function fetchB32Signature(selector: string): Promise<string | null> {
    if (b32Cache.has(selector)) return b32Cache.get(selector)!;
    try {
        const res = await fetch(`https://b32.vecha.in/q/${selector}.json`, {
            cache: 'force-cache',
        });
        if (!res.ok) {
            b32Cache.set(selector, null);
            return null;
        }
        const json = (await res.json()) as Array<{ name?: string }>;
        const name =
            Array.isArray(json) && json[0]?.name ? json[0].name : null;
        b32Cache.set(selector, name);
        return name;
    } catch {
        b32Cache.set(selector, null);
        return null;
    }
}

const tokenInfoCache = new Map<string, TokenInfo>();

/**
 * Resolve a token's symbol + decimals. Order:
 *   1. Static address book (VET, VTHO, B3TR, VOT3 — instant).
 *   2. In-memory cache from a previous live lookup.
 *   3. Live Thor read of `symbol()` + `decimals()` on the contract.
 *   4. Generic "tokens" / 18-decimals fallback if the contract doesn't
 *      implement the standard interface or Thor is unreachable.
 */
async function lookupToken(
    address: string,
    network: NETWORK_TYPE,
    thor: ThorClient | null,
): Promise<TokenInfo> {
    const lower = address.toLowerCase();
    const known = getConfig(network)[lower];
    if (known) return known;
    const cached = tokenInfoCache.get(lower);
    if (cached) return cached;
    if (!thor) {
        return { address, symbol: t('common.tokens'), decimals: 18 };
    }
    try {
        const contract = thor.contracts.load(address, ERC20_METADATA_ABI);
        const [symbolRes, decimalsRes] = await Promise.all([
            contract.read.symbol(),
            contract.read.decimals(),
        ]);
        const info: TokenInfo = {
            address,
            symbol: String((symbolRes as unknown as [string])[0]),
            decimals: Number((decimalsRes as unknown as [number])[0]),
        };
        tokenInfoCache.set(lower, info);
        return info;
    } catch {
        const fallback: TokenInfo = {
            address,
            symbol: t('common.tokens'),
            decimals: 18,
        };
        tokenInfoCache.set(lower, fallback);
        return fallback;
    }
}
````

## Source: `cross-app-connect/src/app/cross-app/_lib/format.ts`

````typescript
/**
 * Shared display helpers for addresses and amounts. Centralised so the
 * IdentityRow, AddressTag, transact inspect panel, and any future surface
 * format the same way -- no mixed-case `0x2e25…2D1B` etc.
 */

/**
 * Truncate an address to `0xabcdef…1234`. Forces lowercase to avoid the
 * checksum-casing mismatch you get from naïve `slice` (the first 6 and last
 * 4 chars come from different checksum-cased regions of the same address).
 *
 * If you ever want full EIP-55 display, replace this with a checksum
 * formatter (e.g. viem's `getAddress`) -- but keep both halves consistent.
 */
export function truncateAddress(addr?: string | null): string {
    if (!addr) return '';
    const lower = addr.toLowerCase();
    if (lower.length < 12) return lower;
    return `${lower.slice(0, 6)}…${lower.slice(-4)}`;
}
````

## Source: `cross-app-connect/src/app/cross-app/_lib/knownActions.ts`

````typescript
/**
 * Registry of well-known ecosystem function calls — VeChain Kit domains,
 * VeBetterDAO governance, ERC-721/1155 transfers, etc. The decoder
 * consults this BEFORE the b32 fallback, so common operations users
 * trigger through our own hooks get a plain-language summary and the
 * transact page can stop firing the "we couldn't double-check this" warning
 * on functionality we ship.
 *
 * Adding a new known action: append an entry below. Either pin it to a
 * specific contract address (via `contractField`, which maps to
 * `appConfig.ts`) or leave the address open for patterns that appear on
 * many contracts (ERC-721 transfers, setApprovalForAll, etc.).
 *
 * The `decode` callback receives the typed args and must return a
 * `KnownAction` describing what the user sees. Keep summaries imperative
 * and free of jargon: "Set your primary VeChain domain", not "Call
 * setName on ReverseRegistrar".
 */
import { decodeFunctionData, parseAbi, formatUnits, type Abi } from 'viem';
import { knownContracts, type KnownContracts } from './appConfig';
import i18n from '../../i18n/config';

const t = i18n.t.bind(i18n);

export type KnownActionCategory =
    | 'domain'
    | 'governance'
    | 'rewards'
    | 'nft'
    | 'token'
    | 'staking'
    | 'swap'
    | 'fee';

/**
 * Structured side-channel that travels alongside the localized summary so
 * batch-level title/subtitle logic in `labels.ts` can read facts about a
 * clause without parsing localized text back out. Populate the fields a
 * given action genuinely produces; leave the rest undefined.
 */
export type KnownActionData = {
    // Domain
    setPrimaryName?: string;
    removePrimary?: boolean;
    // Governance
    voteSupport?: 'for' | 'against' | 'abstain';
    allocationAppCount?: number;
    endorse?: boolean;
    // Rewards
    rewardCycle?: string;
    rewardRound?: string;
    // Token conversion (B3TR ↔ VOT3)
    convertAmount?: string;
    convertFrom?: string;
    convertTo?: string;
    // DEX
    dex?: string;
};

export type KnownAction = {
    summary: string;
    detail?: string;
    category: KnownActionCategory;
    recipient?: string;
    spender?: string;
    data?: KnownActionData;
};

type DecodeContext = {
    self?: string;
};

type Pattern = {
    /** When set, this entry only applies to calls TO this kit-known contract. */
    contractField?: keyof KnownContracts;
    abi: Abi;
    decoders: Record<
        string,
        (args: readonly unknown[], ctx: DecodeContext) => KnownAction | null
    >;
};

// --- VET Domains -----------------------------------------------------------

const reverseRegistrarPattern: Pattern = {
    contractField: 'vetDomainsReverseRegistrarAddress',
    abi: parseAbi(['function setName(string name)']),
    decoders: {
        setName: ([name]) => {
            const v = String(name ?? '');
            if (v === '') {
                return {
                    summary: t('action.domain.removePrimary'),
                    category: 'domain',
                    data: { removePrimary: true },
                };
            }
            return {
                summary: t('action.domain.setPrimary', { name: v }),
                category: 'domain',
                data: { setPrimaryName: v },
            };
        },
    },
};

const publicResolverPattern: Pattern = {
    contractField: 'vetDomainsPublicResolverAddress',
    abi: parseAbi([
        'function setAddr(bytes32 node, address addr)',
        'function setText(bytes32 node, string key, string value)',
    ]),
    decoders: {
        setAddr: ([, addr], ctx) => {
            const a = String(addr ?? '').toLowerCase();
            const self = ctx.self?.toLowerCase();
            if (self && a === self) {
                return {
                    summary: t('action.domain.pointToYou'),
                    category: 'domain',
                };
            }
            return {
                summary: t('action.domain.updateAddress'),
                detail: t('action.domain.newTarget', { addr }),
                category: 'domain',
                recipient: String(addr ?? ''),
            };
        },
        setText: ([, key, value]) => {
            const k = String(key ?? '');
            const v = String(value ?? '');
            const label = friendlyTextRecordKey(k);
            if (v === '') {
                return {
                    summary: t('action.domain.removeRecord', { label }),
                    category: 'domain',
                };
            }
            // Short, readable values (a Twitter handle, a name) inline well
            // in the summary. Opaque identifiers (IPFS hashes, data URLs,
            // long hex) are noise -- "Update avatar" is enough, the raw
            // value is meaningless to a human anyway.
            if (isReadableValue(v)) {
                return {
                    summary: t('action.domain.setRecordTo', { label, value: v }),
                    category: 'domain',
                };
            }
            return {
                summary: t('action.domain.updateRecord', { label }),
                category: 'domain',
            };
        },
    },
};

const subdomainClaimerPattern: Pattern = {
    contractField: 'veWorldSubdomainClaimerContractAddress',
    abi: parseAbi(['function claim(string subdomain, address resolver)']),
    decoders: {
        claim: ([subdomain]) => ({
            summary: t('action.domain.claim', { subdomain: String(subdomain) }),
            category: 'domain',
            // The cascade ends with a setName for the new primary, which
            // already populates setPrimaryName. Subtitle uses that.
        }),
    },
};

// --- VeBetterDAO governance -------------------------------------------------

const governorPattern: Pattern = {
    contractField: 'b3trGovernorAddress',
    abi: parseAbi([
        'function castVote(uint256 proposalId, uint8 support)',
        'function castVoteWithReason(uint256 proposalId, uint8 support, string reason)',
    ]),
    decoders: {
        castVote: ([, support]) => {
            const vote = voteKey(Number(support));
            return {
                summary: t('action.governance.voteOnProposal', {
                    vote: voteLabel(vote),
                }),
                category: 'governance',
                data: { voteSupport: vote },
            };
        },
        castVoteWithReason: ([, support, reason]) => {
            const vote = voteKey(Number(support));
            return {
                summary: t('action.governance.voteOnProposal', {
                    vote: voteLabel(vote),
                }),
                detail: t('action.governance.reason', {
                    reason: String(reason ?? ''),
                }),
                category: 'governance',
                data: { voteSupport: vote },
            };
        },
    },
};

const xAllocationVotingPattern: Pattern = {
    contractField: 'xAllocationVotingContractAddress',
    abi: parseAbi([
        'function castVote(uint256 roundId, bytes32[] appsIds, uint256[] voteWeights)',
    ]),
    decoders: {
        castVote: ([, appsIds]) => {
            const count = Array.isArray(appsIds) ? appsIds.length : 0;
            return {
                summary:
                    count === 1
                        ? t('action.governance.allocateSingle')
                        : t('action.governance.allocateMany', { count }),
                category: 'governance',
                data: { allocationAppCount: count },
            };
        },
    },
};

const x2EarnAppsPattern: Pattern = {
    contractField: 'x2EarnAppsContractAddress',
    abi: parseAbi([
        'function endorseApp(bytes32 appId, uint256 nodeId)',
        'function unendorseApp(bytes32 appId, uint256 nodeId)',
    ]),
    decoders: {
        endorseApp: () => ({
            summary: t('action.governance.endorse'),
            category: 'governance',
            data: { endorse: true },
        }),
        unendorseApp: () => ({
            summary: t('action.governance.unendorse'),
            category: 'governance',
            data: { endorse: true },
        }),
    },
};

// --- B3TR / VOT3 conversion -------------------------------------------------

const vot3Pattern: Pattern = {
    contractField: 'vot3ContractAddress',
    abi: parseAbi([
        // VOT3 wraps B3TR. `convertToVOT3` locks B3TR and mints VOT3;
        // `convertToB3TR` burns VOT3 to release B3TR.
        'function convertToVOT3(uint256 amount)',
        'function convertToB3TR(uint256 amount)',
    ]),
    decoders: {
        convertToVOT3: ([amount]) => {
            const amt = trimUnits(amount as bigint, 18);
            return {
                summary: t('action.token.convertToVot3', { amount: amt }),
                category: 'token',
                data: {
                    convertAmount: amt,
                    convertFrom: 'B3TR',
                    convertTo: 'VOT3',
                },
            };
        },
        convertToB3TR: ([amount]) => {
            const amt = trimUnits(amount as bigint, 18);
            return {
                summary: t('action.token.convertToB3tr', { amount: amt }),
                category: 'token',
                data: {
                    convertAmount: amt,
                    convertFrom: 'VOT3',
                    convertTo: 'B3TR',
                },
            };
        },
    },
};

// --- Rewards ----------------------------------------------------------------

const voterRewardsPattern: Pattern = {
    contractField: 'voterRewardsContractAddress',
    abi: parseAbi(['function claimReward(uint256 cycle, address user)']),
    decoders: {
        claimReward: ([cycle]) => {
            const c = String(cycle);
            return {
                summary: t('action.rewards.voter', { cycle: c }),
                category: 'rewards',
                data: { rewardCycle: c },
            };
        },
    },
};

const xAllocationPoolPattern: Pattern = {
    contractField: 'xAllocationPoolContractAddress',
    abi: parseAbi(['function claim(uint256 roundId, bytes32 appId)']),
    decoders: {
        claim: ([roundId]) => {
            const r = String(roundId);
            return {
                summary: t('action.rewards.allocation', { round: r }),
                category: 'rewards',
                data: { rewardRound: r },
            };
        },
    },
};

// --- DEX routers ----------------------------------------------------------

const DEX_ROUTERS: Array<{
    field: keyof KnownContracts;
    name: string;
}> = [
    { field: 'betterSwapRouterAddress', name: 'BetterSwap' },
    { field: 'veTradeRouterAddress', name: 'VeTrade' },
    { field: 'veTradeCustomRouterAddress', name: 'VeTrade' },
];

export function isDexRouterAddress(address: string): boolean {
    const lower = address.toLowerCase();
    return DEX_ROUTERS.some(({ field }) => {
        const v = knownContracts[field];
        return typeof v === 'string' && v.toLowerCase() === lower;
    });
}

export function dexRouterName(address: string): string | null {
    const lower = address.toLowerCase();
    for (const { field, name } of DEX_ROUTERS) {
        const v = knownContracts[field];
        if (typeof v === 'string' && v.toLowerCase() === lower) return name;
    }
    return null;
}

const UNISWAP_V2_ROUTER_ABI = parseAbi([
    'function swapExactETHForTokens(uint256 amountOutMin, address[] path, address to, uint256 deadline) payable',
    'function swapETHForExactTokens(uint256 amountOut, address[] path, address to, uint256 deadline) payable',
    'function swapExactTokensForETH(uint256 amountIn, uint256 amountOutMin, address[] path, address to, uint256 deadline)',
    'function swapTokensForExactETH(uint256 amountOut, uint256 amountInMax, address[] path, address to, uint256 deadline)',
    'function swapExactTokensForTokens(uint256 amountIn, uint256 amountOutMin, address[] path, address to, uint256 deadline)',
    'function swapTokensForExactTokens(uint256 amountOut, uint256 amountInMax, address[] path, address to, uint256 deadline)',
]);

function uniswapV2RouterPattern(field: keyof KnownContracts): Pattern {
    const swap = (): KnownAction => {
        const dex = routerNameForField(field);
        return {
            summary: t('action.swap.onDex', { dex }),
            category: 'swap',
            data: { dex },
        };
    };
    return {
        contractField: field,
        abi: UNISWAP_V2_ROUTER_ABI,
        decoders: {
            swapExactETHForTokens: swap,
            swapETHForExactTokens: swap,
            swapExactTokensForETH: swap,
            swapTokensForExactETH: swap,
            swapExactTokensForTokens: swap,
            swapTokensForExactTokens: swap,
        },
    };
}

function routerNameForField(field: keyof KnownContracts): string {
    const entry = DEX_ROUTERS.find((d) => d.field === field);
    return entry?.name ?? 'a DEX';
}

// --- Address-bound patterns ------------------------------------------------

const CONTRACT_PATTERNS: Pattern[] = [
    uniswapV2RouterPattern('betterSwapRouterAddress'),
    uniswapV2RouterPattern('veTradeRouterAddress'),
    reverseRegistrarPattern,
    publicResolverPattern,
    subdomainClaimerPattern,
    governorPattern,
    xAllocationVotingPattern,
    x2EarnAppsPattern,
    vot3Pattern,
    voterRewardsPattern,
    xAllocationPoolPattern,
];

// --- Address-agnostic patterns (NFTs etc.) ---------------------------------

const ERC721_TRANSFER_ABI = parseAbi([
    'function safeTransferFrom(address from, address to, uint256 tokenId)',
    'function safeTransferFrom(address from, address to, uint256 tokenId, bytes data)',
    'function transferFrom(address from, address to, uint256 tokenId)',
]);
const ERC1155_TRANSFER_ABI = parseAbi([
    'function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes data)',
    'function safeBatchTransferFrom(address from, address to, uint256[] ids, uint256[] amounts, bytes data)',
]);
const APPROVAL_FOR_ALL_ABI = parseAbi([
    'function setApprovalForAll(address operator, bool approved)',
]);
const ERC20_TRANSFER_FROM_ABI = parseAbi([
    'function transferFrom(address from, address to, uint256 amount)',
]);

const GLOBAL_PATTERNS: Pattern[] = [
    {
        abi: ERC721_TRANSFER_ABI,
        decoders: {
            safeTransferFrom: (args) => {
                const to = String(args[1] ?? '');
                return {
                    summary: t('action.nft.send'),
                    detail: t('action.nft.toDetail', { to }),
                    category: 'nft',
                    recipient: to,
                };
            },
            transferFrom: (args) => {
                const to = String(args[1] ?? '');
                return {
                    summary: t('action.nft.transfer'),
                    detail: t('action.nft.toDetail', { to }),
                    category: 'nft',
                    recipient: to,
                };
            },
        },
    },
    {
        abi: ERC1155_TRANSFER_ABI,
        decoders: {
            safeTransferFrom: (args) => {
                const to = String(args[1] ?? '');
                const amount = args[3] as bigint;
                return {
                    summary:
                        (amount ?? BigInt(0)) > BigInt(1)
                            ? t('action.nft.sendEditions', {
                                  count: Number(amount),
                              })
                            : t('action.nft.send'),
                    detail: t('action.nft.toDetail', { to }),
                    category: 'nft',
                    recipient: to,
                };
            },
            safeBatchTransferFrom: (args) => {
                const to = String(args[1] ?? '');
                const ids = args[2] as readonly unknown[];
                const count = Array.isArray(ids) ? ids.length : 0;
                return {
                    summary: t('action.nft.sendBatch', { count }),
                    detail: t('action.nft.toDetail', { to }),
                    category: 'nft',
                    recipient: to,
                };
            },
        },
    },
    {
        abi: APPROVAL_FOR_ALL_ABI,
        decoders: {
            setApprovalForAll: ([operator, approved]) => {
                const op = String(operator ?? '');
                if (approved) {
                    return {
                        summary: t('action.nft.approveAll'),
                        detail: t('action.nft.operatorDetail', { operator: op }),
                        category: 'nft',
                        spender: op,
                    };
                }
                return {
                    summary: t('action.nft.revokeAll'),
                    detail: t('action.nft.operatorDetail', { operator: op }),
                    category: 'nft',
                    spender: op,
                };
            },
        },
    },
    {
        abi: ERC20_TRANSFER_FROM_ABI,
        decoders: {
            transferFrom: ([, to]) => ({
                summary: t('action.token.pullFrom'),
                detail: t('action.token.recipientDetail', {
                    to: String(to ?? ''),
                }),
                category: 'token',
                recipient: String(to ?? ''),
            }),
        },
    },
];

// --- Recognizer ------------------------------------------------------------

export function recognizeKnownAction(
    to: string,
    data: string,
    ctx: DecodeContext,
): KnownAction | null {
    if (!data || data === '0x' || data.length < 10) return null;
    const lowerTo = to.toLowerCase();

    // Address-bound patterns first — they're authoritative when they match.
    for (const pattern of CONTRACT_PATTERNS) {
        if (!pattern.contractField) continue;
        const expected = knownContracts[pattern.contractField];
        if (typeof expected !== 'string') continue;
        if (expected.toLowerCase() !== lowerTo) continue;
        const hit = tryDecode(pattern, data, ctx);
        if (hit) return hit;
    }

    // Address-agnostic patterns (NFTs etc).
    for (const pattern of GLOBAL_PATTERNS) {
        const hit = tryDecode(pattern, data, ctx);
        if (hit) return hit;
    }

    // DEX router catch-all: if the call targets a known router but the
    // calldata didn't match any Uniswap V2 selector (e.g. VeTrade's custom
    // router has non-standard signatures), we still recognise the intent
    // and surface a meaningful summary instead of "Interact with contract".
    const dex = dexRouterName(to);
    if (dex) {
        return {
            summary: t('action.swap.onDex', { dex }),
            category: 'swap',
            data: { dex },
        };
    }

    return null;
}

function tryDecode(
    pattern: Pattern,
    data: string,
    ctx: DecodeContext,
): KnownAction | null {
    try {
        const decoded = decodeFunctionData({
            abi: pattern.abi,
            data: data as `0x${string}`,
        });
        const fn = pattern.decoders[decoded.functionName];
        if (!fn) return null;
        return fn(decoded.args as readonly unknown[], ctx);
    } catch {
        return null;
    }
}

// --- Helpers ---------------------------------------------------------------

// True if the value is short enough and not an opaque blob (IPFS hash,
// Arweave URI, data URL, raw hex). Used to decide whether to inline a
// `setText` value in the summary or hide it behind the detail line.
function isReadableValue(v: string): boolean {
    if (v.length > 40) return false;
    if (/^(ipfs|ipns|ar|data):/i.test(v)) return false;
    if (/^0x[0-9a-fA-F]{16,}$/.test(v)) return false;
    return true;
}

function friendlyTextRecordKey(key: string): string {
    switch (key) {
        case 'avatar':
            return t('domains.label.avatar');
        case 'description':
            return t('domains.label.description');
        case 'email':
            return t('domains.label.email');
        case 'url':
            return t('domains.label.website');
        case 'com.twitter':
        case 'twitter':
            return t('domains.label.twitter');
        case 'com.github':
        case 'github':
            return t('domains.label.github');
        case 'org.telegram':
        case 'telegram':
            return t('domains.label.telegram');
        default:
            return t('domains.label.fallback', { key });
    }
}

function voteKey(support: number): 'for' | 'against' | 'abstain' {
    switch (support) {
        case 0:
            return 'against';
        case 1:
            return 'for';
        case 2:
            return 'abstain';
        default:
            return 'for';
    }
}

function voteLabel(key: 'for' | 'against' | 'abstain'): string {
    return t(`vote.${key}`);
}

function trimUnits(raw: bigint, decimals: number): string {
    if (raw === undefined || raw === null) return '0';
    const str = formatUnits(raw, decimals);
    if (!str.includes('.')) return str;
    const [whole, frac] = str.split('.');
    const cap = whole === '0' ? 4 : 2;
    const trimmed = frac.replace(/0+$/, '').slice(0, cap);
    return trimmed.length === 0 ? whole : `${whole}.${trimmed}`;
}
````

## Source: `cross-app-connect/src/app/cross-app/_lib/labels.ts`

````typescript
/**
 * Human-readable labels + risk classification for the technical strings the
 * smart-account flow surfaces. Kept separate from decoder.ts so it stays
 * trivial to scan and extend when new EIP-712 primary types or action
 * shapes show up.
 *
 * All copy goes through i18next so the cross-app popup speaks the user's
 * language. Batch-level title/subtitle logic reads structured fields off
 * `known_action` clauses (see `KnownActionData` in knownActions.ts) rather
 * than parsing the localized summary text back out.
 */
import type { DecodedClause } from './decoder';
import { isDexRouterAddress } from './knownActions';
import { truncateAddress } from './format';
import i18n from '../../i18n/config';

const t = i18n.t.bind(i18n);

export type Risk = 'safe' | 'caution' | 'danger';

export function computeRisk(
    decoded: DecodedClause[] | null,
    blocked: boolean,
): Risk {
    if (blocked) return 'danger';
    if (!decoded) return 'safe';
    const hasUnknown = decoded.some((d) => d.kind === 'unknown');
    const hasUnlimited = decoded.some(
        (d) => d.kind === 'token_approve' && d.unlimited,
    );
    if (hasUnknown && hasUnlimited) return 'danger';
    if (hasUnknown || hasUnlimited) return 'caution';
    return 'safe';
}

/**
 * Title for the transact card — always verb-led "Confirm X" so the user
 * sees a parallel structure across every kind of transaction.
 */
export function titleForActions(
    decoded: DecodedClause[] | null,
    blocked: boolean,
): string {
    if (blocked) return t('transact.title.actionBlocked');
    if (!decoded || decoded.length === 0) return t('transact.title.confirmAction');

    const transfers = decoded.filter(
        (d) => d.kind === 'native_transfer' || d.kind === 'token_transfer',
    );
    const approves = decoded.filter((d) => d.kind === 'token_approve');
    const unknowns = decoded.filter((d) => d.kind === 'unknown');
    const knownByCategory = groupKnownByCategory(decoded);

    if (transfers.length === decoded.length) {
        return decoded.length === 1
            ? t('transact.title.confirmTokenTransfer')
            : t('transact.title.confirmTokenTransfers');
    }
    if (approves.length === decoded.length) {
        return decoded.length === 1
            ? t('transact.title.confirmTokenApproval')
            : t('transact.title.confirmTokenApprovals');
    }
    if (unknowns.length === decoded.length) {
        return t('transact.title.confirmContractCall');
    }

    if (isSwapBatch(decoded)) return t('transact.title.confirmTokenSwap');

    if (
        decoded.every((d) => d.kind === 'known_action') &&
        knownByCategory.length === 1
    ) {
        switch (knownByCategory[0]) {
            case 'domain':
                return t('transact.title.confirmDomainUpdate');
            case 'governance':
                return t('transact.title.confirmVeBetterDaoVote');
            case 'rewards':
                return t('transact.title.confirmRewardsClaim');
            case 'nft':
                return decoded.length === 1
                    ? t('transact.title.confirmNftTransfer')
                    : t('transact.title.confirmNftActions');
            case 'token':
                return t('transact.title.confirmTokenAction');
            case 'staking':
                return t('transact.title.confirmStakeUpdate');
            case 'swap':
                return t('transact.title.confirmTokenSwap');
        }
    }
    return t('transact.title.confirmNActions', { count: decoded.length });
}

/**
 * Detect the canonical DEX pattern: at least one `swap` known-action plus
 * (optionally) `token_approve` clauses whose spender is a known router
 * address. Anything else in the batch disqualifies the pattern.
 */
function isSwapBatch(decoded: DecodedClause[]): boolean {
    const hasSwap = decoded.some(
        (d) => d.kind === 'known_action' && d.category === 'swap',
    );
    if (!hasSwap) return false;
    return decoded.every((d) => {
        if (d.kind === 'known_action' && d.category === 'swap') return true;
        if (d.kind === 'token_approve' && isDexRouterAddress(d.spender))
            return true;
        return false;
    });
}

function groupKnownByCategory(
    decoded: DecodedClause[],
): Array<DecodedClause extends { category: infer C } ? C : never> {
    const set = new Set<string>();
    for (const d of decoded) {
        if (d.kind === 'known_action') set.add(d.category);
    }
    return Array.from(set) as Array<
        DecodedClause extends { category: infer C } ? C : never
    >;
}

/**
 * Label for the primary CTA. Escalates verb as risk grows so the user is
 * given more friction the closer they get to signing something we can't
 * vouch for. The button is disabled outright when phase==='blocked', so the
 * "danger" copy only fires for non-blocking risk (unknown + unlimited
 * approve together).
 */
export function continueLabel(risk: Risk): string {
    switch (risk) {
        case 'safe':
            return t('transact.button.confirm');
        case 'caution':
            return t('transact.button.confirmAnyway');
        case 'danger':
            return t('transact.button.confirmAsDanger');
    }
}

export function humanPrimaryType(value: string): string {
    switch (value) {
        case 'ExecuteWithAuthorization':
            return t('transact.detail.authorizedCall');
        case 'ExecuteBatchWithAuthorization':
            return t('transact.detail.authorizedBatchCall');
        default:
            // Fallback: SCREAMING_SNAKE -> Title Case, camelCase -> Title Case.
            return value
                .replace(/_/g, ' ')
                .replace(/([a-z])([A-Z])/g, '$1 $2')
                .toLowerCase()
                .replace(/(^|\s)\S/g, (m) => m.toUpperCase());
    }
}

/**
 * One-line subtitle carrying the *specifics* of the batch (amounts,
 * counterparties, DEX names) — complementing the title which carries the
 * *kind* of action. Returns empty when the per-clause action list below
 * already communicates the specifics on its own.
 */
export function summarizeActions(decoded: DecodedClause[]): string {
    if (decoded.length === 0) return '';

    // Single-clause: lean on the structured fields the decoder already has.
    if (decoded.length === 1) {
        const d = decoded[0];
        if (d.kind === 'native_transfer') {
            return t('transact.subtitle.sendVet', {
                amount: trimAmount(d.amount),
                recipient: truncateAddress(d.recipient),
            });
        }
        if (d.kind === 'token_transfer') {
            return t('transact.subtitle.sendToken', {
                amount: trimAmount(d.amount),
                symbol: d.token.symbol,
                recipient: truncateAddress(d.recipient),
            });
        }
        if (d.kind === 'token_approve') {
            const amt = d.unlimited
                ? t('common.amount.unlimited')
                : trimAmount(d.amount);
            return t('transact.subtitle.approveFor', {
                amount: amt,
                symbol: d.token.symbol,
                spender: truncateAddress(d.spender),
            });
        }
        // known_action / unknown: title or per-clause row says enough.
        return '';
    }

    // Approve → swap pair: surface the spent amount + DEX name.
    if (isSwapBatch(decoded)) {
        const approve = decoded.find(
            (d) => d.kind === 'token_approve',
        ) as Extract<DecodedClause, { kind: 'token_approve' }> | undefined;
        const dex = dexNameFromSwapBatch(decoded);
        if (approve) {
            const amt = approve.unlimited
                ? t('common.amount.unlimited')
                : trimAmount(approve.amount);
            return dex
                ? t('transact.subtitle.swapVia', {
                      amount: amt,
                      symbol: approve.token.symbol,
                      dex,
                  })
                : t('transact.subtitle.swapAmount', {
                      amount: amt,
                      symbol: approve.token.symbol,
                  });
        }
        return dex ? t('transact.subtitle.swapViaOnly', { dex }) : '';
    }

    // Pure transfer batch — list the moved assets compactly.
    const transfers = decoded.filter(
        (d) => d.kind === 'native_transfer' || d.kind === 'token_transfer',
    );
    if (transfers.length === decoded.length) {
        return assetsList(transfers);
    }

    // Pure approve batch — list approvals.
    const approves = decoded.filter((d) => d.kind === 'token_approve');
    if (approves.length === decoded.length) {
        return assetsList(approves);
    }

    // Multi-clause known-action of one category — read structured data
    // off the clauses instead of parsing localized summaries back out.
    const known = decoded.filter((d) => d.kind === 'known_action');
    if (known.length === decoded.length && sameCategory(known) !== null) {
        return batchSubtitleForCategory(sameCategory(known)!, decoded);
    }

    // Mixed batches: the per-clause rows show the breakdown. Subtitle stays
    // empty unless there's an unverified clause worth calling out.
    const unknowns = decoded.filter((d) => d.kind === 'unknown');
    if (unknowns.length > 0) {
        return t('transact.subtitle.actionsWithUnverified', {
            count: decoded.length,
            unverified: unknowns.length,
        });
    }
    return '';
}

/** DEX name from any `swap` known_action in the batch (data.dex). */
function dexNameFromSwapBatch(decoded: DecodedClause[]): string | null {
    for (const d of decoded) {
        if (d.kind !== 'known_action') continue;
        if (d.category !== 'swap') continue;
        if (d.data?.dex) return d.data.dex;
    }
    return null;
}

/**
 * Compact comma-separated list of "amount symbol" for a batch of token
 * transfers or approvals — "1 B3TR, 50 VOT3" rather than enumerating
 * recipients which would overflow the subtitle.
 */
function assetsList(clauses: DecodedClause[]): string {
    const parts: string[] = [];
    for (const c of clauses) {
        if (c.kind === 'native_transfer') {
            parts.push(`${trimAmount(c.amount)} VET`);
        } else if (c.kind === 'token_transfer') {
            parts.push(`${trimAmount(c.amount)} ${c.token.symbol}`);
        } else if (c.kind === 'token_approve') {
            const amt = c.unlimited
                ? t('common.amount.unlimited')
                : trimAmount(c.amount);
            parts.push(`${amt} ${c.token.symbol}`);
        }
    }
    return parts.join(', ');
}

/**
 * Batch subtitle for a single-category known-action group. Reads
 * `KnownActionData` fields off the clauses rather than parsing summaries.
 */
function batchSubtitleForCategory(
    category: string,
    decoded: DecodedClause[],
): string {
    if (category === 'domain') {
        // Final setName carries the new primary domain.
        for (const d of decoded) {
            if (d.kind !== 'known_action') continue;
            if (d.data?.setPrimaryName) {
                return t('transact.subtitle.switchingTo', {
                    domain: d.data.setPrimaryName,
                });
            }
        }
        if (
            decoded.length === 1 &&
            decoded[0].kind === 'known_action' &&
            decoded[0].data?.removePrimary
        ) {
            return t('transact.subtitle.clearingPrimary');
        }
        return '';
    }
    if (category === 'governance') {
        for (const d of decoded) {
            if (d.kind !== 'known_action') continue;
            if (d.data?.voteSupport) {
                return t('transact.subtitle.voteOnProposal', {
                    vote: t(`vote.${d.data.voteSupport}`),
                });
            }
            if (d.data?.allocationAppCount && d.data.allocationAppCount > 0) {
                return t('transact.subtitle.allocatingAcross', {
                    count: d.data.allocationAppCount,
                });
            }
            if (d.data?.endorse) {
                return t('transact.subtitle.endorsingApp');
            }
        }
        return '';
    }
    if (category === 'rewards') {
        for (const d of decoded) {
            if (d.kind !== 'known_action') continue;
            if (d.data?.rewardCycle) {
                return t('transact.subtitle.fromCycle', {
                    cycle: d.data.rewardCycle,
                });
            }
            if (d.data?.rewardRound) {
                return t('transact.subtitle.fromRound', {
                    round: d.data.rewardRound,
                });
            }
        }
        return '';
    }
    if (category === 'token') {
        for (const d of decoded) {
            if (d.kind !== 'known_action') continue;
            if (
                d.data?.convertAmount &&
                d.data?.convertFrom &&
                d.data?.convertTo
            ) {
                return t('transact.subtitle.conversion', {
                    amount: d.data.convertAmount,
                    from: d.data.convertFrom,
                    to: d.data.convertTo,
                });
            }
        }
        return '';
    }
    return '';
}

function sameCategory(known: DecodedClause[]): string | null {
    let cat: string | null = null;
    for (const d of known) {
        if (d.kind !== 'known_action') return null;
        if (cat === null) cat = d.category;
        else if (cat !== d.category) return null;
    }
    return cat;
}

// Trim a `formatUnits` output to a human-readable amount: 2 decimals for
// values ≥ 1, up to 4 for values < 1, no trailing zeros.
function trimAmount(amount: string): string {
    if (!amount.includes('.')) return amount;
    const [whole, frac] = amount.split('.');
    const cap = whole === '0' ? 4 : 2;
    const trimmed = frac.replace(/0+$/, '').slice(0, cap);
    return trimmed.length === 0 ? whole : `${whole}.${trimmed}`;
}
````

## Source: `cross-app-connect/src/app/cross-app/_lib/lastIdentity.ts`

````typescript
/**
 * Remember the identifier of the most recently signed-in user (email / phone
 * / Privy DID), scoped per Privy app id. Used so that when a Privy session
 * expires and the user lands on the "Sign in to continue" screen, we can
 * greet them with "Welcome back, dan@email.com" and pre-highlight the
 * provider they used last — turning a cold re-login into a one-tap path.
 *
 * The stash happens whenever `usePrivy().user` is non-null. It's not
 * sensitive data; the user already typed it once into Privy and Privy
 * itself stores far more in its own localStorage.
 */
const KEY_PREFIX = 'vk-cross-app-connect:last-identity';

function key(): string {
    const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID ?? 'default';
    return `${KEY_PREFIX}:${appId}`;
}

export type LastIdentity = {
    /** Human-readable display string — email, phone, or Privy DID prefix. */
    label: string;
    /** Provider id matching `OAUTH_PROVIDERS[].id` plus 'phone' / 'farcaster'. */
    provider?: string;
};

// 30-day retention. The label can carry semi-sensitive identifiers (email,
// phone) so we don't keep it around indefinitely — long enough that a
// returning user still gets the "Welcome back, …" greeting, short enough
// that an abandoned device or shared browser flushes it on its own.
const TTL_MS = 30 * 24 * 60 * 60 * 1000;

type StoredIdentity = LastIdentity & { savedAt?: number };

export function getLastIdentity(): LastIdentity | null {
    if (typeof localStorage === 'undefined') return null;
    try {
        const raw = localStorage.getItem(key());
        if (!raw) return null;
        const parsed = JSON.parse(raw) as StoredIdentity;
        if (!parsed || typeof parsed.label !== 'string') return null;
        // Expire records older than the TTL. Records written before the
        // TTL was introduced have no `savedAt`; treat them as fresh once
        // and let the next write upgrade the shape.
        if (
            typeof parsed.savedAt === 'number' &&
            Date.now() - parsed.savedAt > TTL_MS
        ) {
            localStorage.removeItem(key());
            return null;
        }
        return { label: parsed.label, provider: parsed.provider };
    } catch {
        return null;
    }
}

export function setLastIdentity(identity: LastIdentity): void {
    if (typeof localStorage === 'undefined') return;
    try {
        const record: StoredIdentity = { ...identity, savedAt: Date.now() };
        localStorage.setItem(key(), JSON.stringify(record));
    } catch {
        // quota / private-browsing — fail open
    }
}

/**
 * Extract a display label from Privy's `user` object. Preference order:
 *   1. Explicit email / phone (user typed it themselves)
 *   2. Email lifted from a linked Google / Apple / GitHub / Discord account
 *   3. Social handle from X (Twitter), GitHub, Discord, TikTok, Farcaster,
 *      LINE — handles get an "@" prefix for the few platforms that
 *      conventionally use it (X / Farcaster), the rest stay raw.
 *   4. Privy DID prefix as a last resort, truncated to 10 chars.
 *
 * Defensively `any`-typed because Privy's User shape evolves between
 * SDK versions and we don't want a single missing field to break the
 * label.
 */
export function labelFromPrivyUser(user: unknown): string | null {
    if (!user || typeof user !== 'object') return null;
    const u = user as Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
    if (u.email?.address) return String(u.email.address);
    if (u.phone?.number) return String(u.phone.number);
    if (u.google?.email) return String(u.google.email);
    if (u.apple?.email) return String(u.apple.email);
    if (u.github?.email) return String(u.github.email);
    if (u.discord?.email) return String(u.discord.email);
    if (u.linkedin?.email) return String(u.linkedin.email);
    if (u.line?.email) return String(u.line.email);
    if (u.twitter?.username) return `@${String(u.twitter.username)}`;
    if (u.farcaster?.username) return `@${String(u.farcaster.username)}`;
    if (u.github?.username) return String(u.github.username);
    if (u.discord?.username) return String(u.discord.username);
    if (u.tiktok?.username) return String(u.tiktok.username);
    // Fall back to display names if a provider didn't surface a username.
    if (u.twitter?.name) return String(u.twitter.name);
    if (u.github?.name) return String(u.github.name);
    if (u.farcaster?.displayName) return String(u.farcaster.displayName);
    if (typeof u.id === 'string') {
        // did:privy:abcd1234... → "abcd1234" truncated
        const tail = u.id.replace(/^did:privy:/, '');
        return tail.length > 10 ? `${tail.slice(0, 10)}…` : tail;
    }
    return null;
}
````

## Source: `cross-app-connect/src/app/cross-app/_lib/network-tokens.ts`

````typescript
/**
 * Static address book of the well-known VeChain tokens, lifted from the kit's
 * config (packages/vechain-kit/src/config/{mainnet,testnet,solo}.ts). Hits
 * before any live RPC lookup so common cases ("Send 10 B3TR") render
 * instantly without a network round trip.
 */
import type { TokenInfo } from './decoder';

export type NETWORK_TYPE = 'main' | 'test' | 'solo';

const lower = (s: string) => s.toLowerCase();

const VTHO_ADDR = '0x0000000000000000000000000000456E65726779';

const MAINNET: Record<string, TokenInfo> = {
    [lower(VTHO_ADDR)]: {
        address: VTHO_ADDR,
        symbol: 'VTHO',
        decimals: 18,
    },
    [lower('0x5ef79995FE8a89e0812330E4378eB2660ceDe699')]: {
        address: '0x5ef79995FE8a89e0812330E4378eB2660ceDe699',
        symbol: 'B3TR',
        decimals: 18,
    },
    [lower('0x76Ca782B59C74d088C7D2Cce2f211BC00836c602')]: {
        address: '0x76Ca782B59C74d088C7D2Cce2f211BC00836c602',
        symbol: 'VOT3',
        decimals: 18,
    },
};

const TESTNET: Record<string, TokenInfo> = {
    [lower(VTHO_ADDR)]: {
        address: VTHO_ADDR,
        symbol: 'VTHO',
        decimals: 18,
    },
    [lower('0x95761346d18244bb91664181bf91193376197088')]: {
        address: '0x95761346d18244bb91664181bf91193376197088',
        symbol: 'B3TR',
        decimals: 18,
    },
    [lower('0x6e8b4a88d37897fc11f6ba12c805695f1c41f40e')]: {
        address: '0x6e8b4a88d37897fc11f6ba12c805695f1c41f40e',
        symbol: 'VOT3',
        decimals: 18,
    },
};

const SOLO: Record<string, TokenInfo> = {
    [lower(VTHO_ADDR)]: {
        address: VTHO_ADDR,
        symbol: 'VTHO',
        decimals: 18,
    },
    [lower('0xd31A6f2DBa8785cE41AB68Ea192791B5175309F4')]: {
        address: '0xd31A6f2DBa8785cE41AB68Ea192791B5175309F4',
        symbol: 'B3TR',
        decimals: 18,
    },
    [lower('0x028Af33230576c1e073C8245F72a7A4aa53564E4')]: {
        address: '0x028Af33230576c1e073C8245F72a7A4aa53564E4',
        symbol: 'VOT3',
        decimals: 18,
    },
};

export function getConfig(network: NETWORK_TYPE): Record<string, TokenInfo> {
    if (network === 'main') return MAINNET;
    if (network === 'test') return TESTNET;
    return SOLO;
}
````

## Source: `cross-app-connect/src/app/cross-app/_lib/recent.ts`

````typescript
/**
 * Tracks the most recently used login provider per browser, so the SignInPanel
 * can surface a "Recent" badge in the next popup. Scoped per app id so a host
 * pointed at multiple Privy apps doesn't cross-pollute.
 */
const KEY_PREFIX = 'vk-cross-app-connect:recent-provider';

function key(): string {
    const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID ?? 'default';
    return `${KEY_PREFIX}:${appId}`;
}

export function getRecentProvider(): string | null {
    if (typeof localStorage === 'undefined') return null;
    try {
        return localStorage.getItem(key());
    } catch {
        return null;
    }
}

export function setRecentProvider(providerId: string): void {
    if (typeof localStorage === 'undefined') return;
    try {
        localStorage.setItem(key(), providerId);
    } catch {
        // quota / private-browsing — fail open
    }
}
````

## Source: `cross-app-connect/src/app/cross-app/_lib/thor.ts`

````typescript
'use client';

import { ThorClient } from '@vechain/sdk-network';
import { Address } from '@vechain/sdk-core';
import {
    getAddressDomain,
    getAvatar,
    getDomainAddress,
    isPrimaryDomain,
} from '@vechain/contract-getters';
import { picasso } from '@vechain/picasso';

// Network configuration: hardcoded once, no React context required.
// Matches the kit's mainnet/testnet config (`packages/vechain-kit/src/config/*.ts`).
// Validate the env var explicitly — a stray value (e.g. 'production') would
// fall through `NETWORK[NETWORK_TYPE]` undefined and crash on `.nodeUrl`.
const rawNetworkType = process.env.NEXT_PUBLIC_NETWORK_TYPE;
const NETWORK_TYPE: 'main' | 'test' =
    rawNetworkType === 'test' ? 'test' : 'main';

const NETWORK = {
    main: {
        nodeUrl: 'https://mainnet.vechain.org',
        accountFactoryAddress: '0xC06Ad8573022e2BE416CA89DA47E8c592971679A',
        genericDelegatorUrl: 'https://mainnet.delegator.vechain.org/api/v1/',
    },
    test: {
        nodeUrl: 'https://testnet.vechain.org',
        accountFactoryAddress: '0x713b908Bcf77f3E00EFEf328E50b657a1A23AeaF',
        genericDelegatorUrl: 'https://testnet.delegator.vechain.org/api/v1/',
    },
} as const;

export const networkType = NETWORK_TYPE;
export const networkConfig = NETWORK[NETWORK_TYPE];
export const thor = ThorClient.at(networkConfig.nodeUrl);

// Fetch the generic delegator's current deposit account once per page load.
// The recogniser in decoder.ts uses the result to re-label clauses sending
// gas tokens to that address as "Pay transaction fee" instead of an opaque
// "Send X VET to 0x86…fa", so the user understands what they're paying.
let depositAccountPromise: Promise<string | null> | null = null;
export async function fetchGenericDelegatorDepositAccount(): Promise<
    string | null
> {
    if (!depositAccountPromise) {
        depositAccountPromise = (async () => {
            try {
                const res = await fetch(
                    new URL(
                        'deposit/account',
                        networkConfig.genericDelegatorUrl,
                    ),
                    { method: 'GET', headers: { 'Content-Type': 'application/json' } },
                );
                if (!res.ok) return null;
                const data = (await res.json()) as { depositAccount?: string };
                return data.depositAccount?.toLowerCase() ?? null;
            } catch {
                return null;
            }
        })();
    }
    return depositAccountPromise;
}

// Minimal ABI for SocialLoginSmartAccountFactory.getAccountAddress. Inlined
// to avoid pulling the full `@vechain/vechain-contract-types` package; this
// single read is all the host needs.
const SMART_ACCOUNT_FACTORY_ABI = [
    {
        type: 'function',
        name: 'getAccountAddress',
        stateMutability: 'view',
        inputs: [{ name: 'owner', type: 'address' }],
        outputs: [{ name: '', type: 'address' }],
    },
] as const;

export type SmartAccountInfo = {
    address: string;
    isDeployed: boolean;
};

export async function getSmartAccountAddress(
    owner: string,
): Promise<SmartAccountInfo> {
    const res = await thor.contracts
        .load(
            networkConfig.accountFactoryAddress,
            SMART_ACCOUNT_FACTORY_ABI,
        )
        .read.getAccountAddress(owner);
    const address = Address.of((res as unknown as [string])[0].toString()).toString();
    const detail = await thor.accounts.getAccount(Address.of(address));
    return { address, isDeployed: detail.hasCode };
}

export async function getChainId(): Promise<string> {
    const genesis = await thor.blocks.getGenesisBlock();
    if (!genesis) throw new Error('Could not fetch genesis block');
    return genesis.id;
}

// VNS lookups are only defined on mainnet and testnet.
const vnsSupported = NETWORK_TYPE === 'main' || NETWORK_TYPE === 'test';

export type DomainInfo = {
    address?: string;
    domain?: string;
    isPrimaryDomain: boolean;
};

export async function getDomainOfAddress(
    address: string,
): Promise<DomainInfo> {
    if (!vnsSupported || !address) {
        return { address, isPrimaryDomain: false };
    }
    const domain = await getAddressDomain(address, {
        networkUrl: networkConfig.nodeUrl,
    });
    if (!domain) return { address, isPrimaryDomain: false };
    const isPrimary = await isPrimaryDomain(domain, address, {
        networkUrl: networkConfig.nodeUrl,
    });
    return { address, domain, isPrimaryDomain: isPrimary };
}

export async function resolveDomainToAddress(
    domain: string,
): Promise<string | undefined> {
    if (!vnsSupported || !domain) return undefined;
    const res = await getDomainAddress(domain, {
        networkUrl: networkConfig.nodeUrl,
    });
    return res ?? undefined;
}

// Avatar resolution: VET-domain avatar → Picasso identicon fallback.
// The kit also resolves cross-app-specific avatars from localStorage, but
// this host doesn't carry those connection caches.
export async function getAvatarForAddress(address: string): Promise<string> {
    if (!vnsSupported) return picassoFallback(address);
    const domain = await getAddressDomain(address, {
        networkUrl: networkConfig.nodeUrl,
    });
    if (!domain) return picassoFallback(address);
    const avatar = await getAvatar(domain, {
        networkUrl: networkConfig.nodeUrl,
    });
    return avatar ?? picassoFallback(address);
}

export function picassoFallback(address: string): string {
    const svg = picasso(address.toLowerCase());
    return `data:image/svg+xml;utf8,${svg}`;
}
````

## Source: `cross-app-connect/src/app/cross-app/_lib/useAddressInfo.ts`

````typescript
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
````

## Source: `cross-app-connect/src/app/cross-app/connect/ConnectClient.tsx`

````tsx
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
````

## Source: `cross-app-connect/src/app/cross-app/connect/PinInput.module.css`

````css
.row {
    display: flex;
    gap: 8px;
    justify-content: center;
    align-items: center;
}

.cell {
    width: 40px;
    height: 48px;
    text-align: center;
    font-size: 18px;
    font-weight: 600;
    font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
    background: var(--bg-card);
    color: var(--text-strong);
    border: 1px solid var(--border-button);
    border-radius: var(--radius-md);
    outline: none;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.cell:focus-visible {
    border-color: var(--accent);
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.cellFilled {
    border-color: var(--text-strong);
}
````

## Source: `cross-app-connect/src/app/cross-app/connect/PinInput.tsx`

````tsx
'use client';

import { useEffect, useRef } from 'react';
import styles from './PinInput.module.css';

type Props = {
    value: string;
    length?: number;
    autoFocus?: boolean;
    onChange: (next: string) => void;
    onComplete?: (full: string) => void;
};

/**
 * Six-cell OTP-style input. Replaces Chakra's `PinInput` + `PinInputField`.
 *
 * Behaviour:
 *   - Auto-advance focus when a digit is entered.
 *   - Backspace on an empty cell goes back and clears the previous cell.
 *   - Paste anywhere distributes digits across cells.
 *   - Only digits are accepted; everything else is filtered.
 */
export function PinInput({
    value,
    length = 6,
    autoFocus = false,
    onChange,
    onComplete,
}: Props) {
    const refs = useRef<Array<HTMLInputElement | null>>([]);

    useEffect(() => {
        if (autoFocus) refs.current[0]?.focus();
    }, [autoFocus]);

    const digits = value.padEnd(length, ' ').slice(0, length).split('');

    const updateAt = (index: number, ch: string) => {
        const arr = digits.slice();
        arr[index] = ch;
        const joined = arr.join('').replace(/\s/g, '');
        onChange(joined);
        if (joined.length === length) onComplete?.(joined);
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        index: number,
    ) => {
        const raw = e.target.value.replace(/\D/g, '');
        if (!raw) {
            updateAt(index, '');
            return;
        }
        // Paste from autocomplete or user typing fast — distribute extras.
        if (raw.length > 1) {
            const arr = digits.slice();
            for (let i = 0; i < raw.length && index + i < length; i++) {
                arr[index + i] = raw[i];
            }
            const joined = arr.join('').replace(/\s/g, '');
            onChange(joined);
            const focusIndex = Math.min(index + raw.length, length - 1);
            refs.current[focusIndex]?.focus();
            if (joined.length === length) onComplete?.(joined);
            return;
        }
        updateAt(index, raw);
        if (index < length - 1) refs.current[index + 1]?.focus();
    };

    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>,
        index: number,
    ) => {
        if (e.key === 'Backspace' && !digits[index].trim() && index > 0) {
            e.preventDefault();
            const arr = digits.slice();
            arr[index - 1] = '';
            onChange(arr.join('').replace(/\s/g, ''));
            refs.current[index - 1]?.focus();
        } else if (e.key === 'ArrowLeft' && index > 0) {
            refs.current[index - 1]?.focus();
        } else if (e.key === 'ArrowRight' && index < length - 1) {
            refs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (
        e: React.ClipboardEvent<HTMLInputElement>,
        index: number,
    ) => {
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '');
        if (!pasted) return;
        e.preventDefault();
        const arr = digits.slice();
        for (let i = 0; i < pasted.length && index + i < length; i++) {
            arr[index + i] = pasted[i];
        }
        const joined = arr.join('').replace(/\s/g, '');
        onChange(joined);
        const focusIndex = Math.min(index + pasted.length, length - 1);
        refs.current[focusIndex]?.focus();
        if (joined.length === length) onComplete?.(joined);
    };

    return (
        <div className={styles.row}>
            {Array.from({ length }).map((_, i) => {
                const ch = digits[i].trim();
                return (
                    <input
                        key={i}
                        ref={(el) => {
                            refs.current[i] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={1}
                        className={`${styles.cell} ${
                            ch ? styles.cellFilled : ''
                        }`}
                        value={ch}
                        onChange={(e) => handleChange(e, i)}
                        onKeyDown={(e) => handleKeyDown(e, i)}
                        onPaste={(e) => handlePaste(e, i)}
                        aria-label={`Digit ${i + 1}`}
                    />
                );
            })}
        </div>
    );
}
````

## Source: `cross-app-connect/src/app/cross-app/connect/connect.module.css`

````css
.shell {
    max-width: 24rem;
    margin: 0 auto;
    padding: 32px 16px;
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.card {
    background: var(--bg-card);
    border-radius: var(--radius-md);
    padding: 16px;
}

.cardBody {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.cardBodyTight {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.center {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px 0;
}

.spinner {
    width: 28px;
    height: 28px;
    border: 3px solid var(--border-button);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

.fallbackText {
    color: var(--text-muted);
    text-align: center;
    font-size: 14px;
    line-height: 1.4;
    margin: 0;
}

.alert {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    padding: 12px;
    border-radius: var(--radius-md);
    font-size: 13px;
    line-height: 1.3;
    border-left: 3px solid;
}

.alertError {
    background: rgba(239, 68, 68, 0.08);
    border-left-color: var(--danger);
    color: var(--text-strong);
}

.alertWarn {
    background: rgba(245, 158, 11, 0.08);
    border-left-color: var(--warn);
    color: var(--text-strong);
}

.alertIcon {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
}

.btnBrand {
    background: var(--primary-btn-bg);
    color: var(--primary-btn-color);
    border: none;
    border-radius: var(--radius-full);
    height: 60px;
    padding: 0 16px;
    font-weight: 500;
    font-size: 15px;
    width: 100%;
    transition: opacity 0.2s;
}

.btnBrand:hover:not(:disabled) {
    opacity: 0.85;
}

.btnBrand:disabled {
    opacity: 0.5;
}

.btnRow {
    background: var(--login-btn-bg);
    color: var(--login-btn-color);
    border: 1px solid var(--border-button);
    border-radius: var(--radius-lg);
    height: 52px;
    padding: 0 18px;
    font-weight: 600;
    font-size: 15px;
    width: 100%;
    display: flex;
    align-items: center;
    gap: 12px;
    text-align: left;
    transition: all 0.2s;
}

.btnRow:hover:not(:disabled) {
    background: var(--login-btn-hover-bg);
}

.btnRow:active {
    transform: scale(0.99);
}

.btnRow:disabled {
    opacity: 0.5;
}

.rowLabel {
    flex: 1;
}

.rowIcon {
    flex-shrink: 0;
    width: 22px;
    height: 22px;
}

.recentDot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--success);
    flex-shrink: 0;
}

.btnGhost {
    background: transparent;
    color: var(--text-muted);
    border: 1px solid var(--border-button);
    border-radius: var(--radius-full);
    height: 48px;
    padding: 0 24px;
    font-weight: 500;
    width: 100%;
    transition: all 0.2s;
}

.btnGhost:hover:not(:disabled) {
    background: var(--login-btn-hover-bg);
    color: var(--text-strong);
}

.btnGhost:disabled {
    opacity: 0.4;
}

.btnSm {
    height: 40px;
    font-size: 14px;
}

.linkBtn {
    background: transparent;
    border: none;
    padding: 0;
    color: var(--text-muted);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
}

.linkBtn:hover {
    color: var(--text-strong);
    text-decoration: underline;
}

.linkCenter {
    text-align: center;
    padding-top: 4px;
}

.inputRow {
    width: 100%;
    height: 48px;
    padding: 0 14px;
    background: var(--bg-card);
    border: 1px solid var(--border-button);
    border-radius: var(--radius-md);
    color: var(--text-strong);
    font-size: 16px;
    font-family: var(--font-body);
    outline: none;
    transition: border-color 0.2s;
}

.inputRow::placeholder {
    color: var(--text-subtle);
}

.inputRow:focus-visible {
    border-color: var(--accent);
}

.muted {
    font-size: 12px;
    color: var(--text-subtle);
    margin: 0;
}

.mutedBody {
    font-size: 14px;
    color: var(--text-muted);
    margin: 0;
    line-height: 1.4;
}

.strong {
    color: var(--text-strong);
}

.identityRow {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    border-radius: var(--radius-md);
    background: var(--bg-card-elevated);
    border: 1px solid var(--border-default);
}

.identityAvatar {
    width: 44px;
    height: 44px;
    border-radius: var(--radius-full);
    flex-shrink: 0;
    background: var(--login-btn-hover-bg);
}

.identityAvatarPlaceholder {
    width: 44px;
    height: 44px;
    border-radius: var(--radius-full);
    background: var(--login-btn-hover-bg);
    flex-shrink: 0;
}

.identityBody {
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex: 1;
    min-width: 0;
}

.identityHead {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
}

.identityName {
    font-weight: 600;
    color: var(--text-strong);
    line-height: 1.2;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.identityBadges {
    display: flex;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
}

.identityBadge {
    width: 14px;
    height: 14px;
}

.identityWallet {
    font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
    font-size: 12px;
    color: var(--text-subtle);
    line-height: 1.2;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.skeleton {
    background: var(--login-btn-hover-bg);
    border-radius: var(--radius-sm);
    animation: pulse 1.5s ease-in-out infinite;
}

.skeletonAvatar {
    width: 44px;
    height: 44px;
    border-radius: var(--radius-full);
}

.skeletonWallet {
    height: 14px;
    width: 60%;
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.55; }
}

.notYouRow {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 4px;
    padding-top: 4px;
}

.pinRow {
    display: flex;
    justify-content: center;
}
````

## Source: `cross-app-connect/src/app/cross-app/connect/page.tsx`

````tsx
import { ConnectClient } from './ConnectClient';
import styles from './connect.module.css';

/**
 * Server Component shell for the connect popup. Renders the page container
 * to HTML so the browser paints structure before the client island parses.
 * Login flow + cross-app handshake live in `ConnectClient.tsx`.
 */
export default function CrossAppConnectPage() {
    return (
        <main className={styles.shell}>
            <ConnectClient />
        </main>
    );
}
````

## Source: `cross-app-connect/src/app/cross-app/transact/TransactClient.tsx`

````tsx
'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuChevronDown, LuChevronUp } from 'react-icons/lu';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import type { VerifiedTransactionRequest } from '@privy-io/cross-app-provider/connect';
import { formatUnits } from 'viem';
import { useCrossAppClient } from '../_lib/client';
import { VechainHeader } from '../../components/VechainHeader';
import { AddressTag } from '../../components/AddressTag';
import { IdentityRow } from '../../components/IdentityRow';
import { truncateAddress } from '../_lib/format';
import { decodeClause, type DecodedClause } from '../_lib/decoder';
import { SignInPanel } from '../_components/SignInPanel';
import {
    getLastIdentity,
    labelFromPrivyUser,
    setLastIdentity,
} from '../_lib/lastIdentity';
import { getRecentProvider } from '../_lib/recent';
import {
    computeRisk,
    continueLabel,
    humanPrimaryType,
    summarizeActions,
    titleForActions,
    type Risk,
} from '../_lib/labels';
import {
    fetchGenericDelegatorDepositAccount,
    getChainId,
    getSmartAccountAddress,
    networkType,
    thor,
    type SmartAccountInfo,
} from '../_lib/thor';
import styles from './transact.module.css';

const SUPPORTED_METHODS = [
    'eth_signTypedData_v4',
    'personal_sign',
] as const;
const SMART_ACCOUNT_PRIMARY_TYPES = [
    'ExecuteWithAuthorization',
    'ExecuteBatchWithAuthorization',
] as const;

type Clause = {
    to: string;
    value: string;
    data: string;
};

type SmartAccountTypedData = {
    domain: {
        name: string;
        version: string;
        chainId: string | number;
        verifyingContract: string;
    };
    types: Record<string, Array<{ name: string; type: string }>>;
    primaryType: string;
    message: Record<string, unknown> & {
        to: string | string[];
        value: string | string[];
        data: string | string[];
        validAfter: string | number;
        validBefore: string | number;
    };
};

type GenericTypedData = {
    domain: {
        name?: string;
        version?: string;
        chainId?: string | number;
        verifyingContract?: string;
    };
    types: Record<string, Array<{ name: string; type: string }>>;
    primaryType: string;
    message: Record<string, unknown>;
};

type ParsedRequest =
    | {
          kind: 'smart_account';
          typedData: SmartAccountTypedData;
          clauses: Clause[];
      }
    | { kind: 'typed_data'; typedData: GenericTypedData }
    | { kind: 'message'; message: string; raw: string };

// Decode hex-encoded message payloads back to UTF-8 so the user sees the
// actual text being signed, not 0x6f6e6c79... For non-hex strings, pass
// through as-is.
function decodePersonalSignMessage(raw: string): string {
    if (typeof raw !== 'string') return '';
    if (!raw.startsWith('0x')) return raw;
    try {
        const hex = raw.slice(2);
        const bytes = new Uint8Array(
            hex.match(/.{1,2}/g)?.map((b) => parseInt(b, 16)) ?? [],
        );
        return new TextDecoder('utf-8', { fatal: false }).decode(bytes);
    } catch {
        return raw;
    }
}

/**
 * Pull a usable message out of whatever the caught value happens to be.
 * SDK backends sometimes throw Errors with `message: ''`, sometimes plain
 * objects, sometimes strings. Without this helper the alert renders blank
 * and the user gets a dead-end screen with no idea what failed.
 */
function errorMessage(err: unknown, fallback: string): string {
    if (err instanceof Error && err.message.trim()) return err.message;
    if (typeof err === 'string' && err.trim()) return err;
    if (err && typeof err === 'object') {
        const m = (err as { message?: unknown }).message;
        if (typeof m === 'string' && m.trim()) return m;
    }
    return fallback;
}

function parseClauses(typedData: SmartAccountTypedData): Clause[] {
    const { to, value, data } = typedData.message;
    if (Array.isArray(to)) {
        const values = (value as string[]) ?? [];
        const datas = (data as string[]) ?? [];
        return to.map((t, i) => ({
            to: t,
            value: String(values[i] ?? '0'),
            data: datas[i] ?? '0x',
        }));
    }
    return [
        {
            to: to as string,
            value: String(value ?? '0'),
            data: (data as string) ?? '0x',
        },
    ];
}


export function TransactClient() {
    const { t } = useTranslation();
    const client = useCrossAppClient();
    const {
        ready,
        authenticated,
        user,
        signTypedData,
        signMessage,
        getAccessToken,
    } = usePrivy();
    const { wallets } = useWallets();
    const embedded = wallets.find((w) => w.walletClientType === 'privy');

    // Persist a friendly identity label whenever a user is active. Read
    // back on the "session expired" branch below so we can greet the user
    // by name and pre-highlight the right provider on re-login.
    useEffect(() => {
        if (!user) return;
        const label = labelFromPrivyUser(user);
        if (!label) return;
        setLastIdentity({ label, provider: getRecentProvider() ?? undefined });
    }, [user]);

    const [smartAccount, setSmartAccount] = useState<SmartAccountInfo | null>(
        null,
    );
    const [chainId, setChainId] = useState<string | null>(null);
    const [verified, setVerified] = useState<VerifiedTransactionRequest | null>(
        null,
    );
    const [parseError, setParseError] = useState<
        | { kind: 'no_params' }
        | { kind: 'invalid'; message: string }
        | { kind: 'connection_expired' }
        | null
    >(null);
    const [block, setBlock] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [decoded, setDecoded] = useState<DecodedClause[] | null>(null);
    const [inspectOpen, setInspectOpen] = useState(false);

    // Smart account lookup once the embedded wallet is available.
    useEffect(() => {
        if (!embedded?.address) return;
        let ignore = false;
        getSmartAccountAddress(embedded.address)
            .then((r) => {
                if (!ignore) setSmartAccount(r);
            })
            .catch(() => {
                /* keep null; UI handles missing smart account */
            });
        return () => {
            ignore = true;
        };
    }, [embedded?.address]);

    // Chain id from the genesis block. Fires once.
    useEffect(() => {
        let ignore = false;
        getChainId()
            .then((id) => {
                if (!ignore) setChainId(id);
            })
            .catch(() => {
                /* keep null */
            });
        return () => {
            ignore = true;
        };
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (!window.location.search) {
            setParseError({ kind: 'no_params' });
        }
    }, []);

    useEffect(() => {
        if (!authenticated || !user?.id) return;
        if (typeof window !== 'undefined' && !window.location.search) return;
        let cancelled = false;
        (async () => {
            try {
                const data = await client.getVerifiedTransactionRequest({
                    userId: user.id,
                });
                if (!cancelled) setVerified(data);
            } catch (e) {
                // "No connection found for requester" / "Connection has
                // expired" / "User ID mismatch" → the requester app encrypted
                // this payload with a connection record Privy no longer has
                // for this user. We can't recover inline (a fresh connection
                // would mint new keys that can't decrypt the existing
                // payload). The kit-using app listens for our postMessage
                // and routes the user through a fresh connect flow.
                const msg = errorMessage(e, '');
                const isStaleConnection =
                    /no connection|connection has expired|user id mismatch/i.test(
                        msg,
                    );
                if (isStaleConnection && typeof window !== 'undefined') {
                    try {
                        window.opener?.postMessage(
                            { type: 'vk:cross-app-no-connection' },
                            '*',
                        );
                    } catch {
                        /* opener cross-origin-blocked; ignore */
                    }
                }
                if (!cancelled)
                    setParseError(
                        isStaleConnection
                            ? { kind: 'connection_expired' }
                            : {
                                  kind: 'invalid',
                                  message:
                                      msg || t('transact.error.failedToRead'),
                              },
                    );
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [
        client,
        authenticated,
        user?.id,
        t,
    ]);

    const parsed = useMemo<ParsedRequest | null>(() => {
        if (!verified) return null;
        const { method, params } = verified.request;

        if (method === 'personal_sign') {
            const args = Array.isArray(params) ? params : [];
            const rawMessage = args.find(
                (p) =>
                    typeof p === 'string' &&
                    !/^0x[a-fA-F0-9]{40}$/.test(p),
            );
            if (typeof rawMessage !== 'string') return null;
            return {
                kind: 'message',
                message: decodePersonalSignMessage(rawMessage),
                raw: rawMessage,
            };
        }

        if (method === 'eth_signTypedData_v4') {
            const raw = Array.isArray(params) ? params[1] : undefined;
            let typedData: SmartAccountTypedData | undefined;
            try {
                typedData =
                    typeof raw === 'string' ? JSON.parse(raw) : raw;
            } catch {
                // Malformed JSON from the requester app — return null so
                // the UI falls back to the "couldn't read request" screen
                // instead of crashing the component.
                return null;
            }
            if (!typedData?.domain || !typedData?.message) return null;
            const primaryType = typedData.primaryType;
            const isSmartAccountAuth =
                SMART_ACCOUNT_PRIMARY_TYPES.includes(
                    primaryType as 'ExecuteWithAuthorization',
                ) &&
                typedData.domain?.name === 'Wallet' &&
                typedData.domain?.version === '1';
            if (isSmartAccountAuth) {
                return {
                    kind: 'smart_account',
                    typedData,
                    clauses: parseClauses(typedData),
                };
            }
            return { kind: 'typed_data', typedData };
        }

        return null;
    }, [verified]);

    useEffect(() => {
        if (!verified) {
            setBlock(null);
            return;
        }
        const method = verified.request?.method;
        if (
            !SUPPORTED_METHODS.includes(
                method as (typeof SUPPORTED_METHODS)[number],
            )
        ) {
            setBlock(t('transact.block.unsupportedMethod', { method }));
            return;
        }
        if (!parsed) {
            setBlock(null);
            return;
        }
        if (parsed.kind !== 'smart_account') {
            setBlock(null);
            return;
        }
        if (!smartAccount?.address || !chainId) {
            setBlock(null);
            return;
        }
        const { typedData } = parsed;
        try {
            if (BigInt(typedData.domain.chainId) !== BigInt(chainId)) {
                setBlock(t('transact.block.chainIdMismatch'));
                return;
            }
        } catch {
            setBlock(t('transact.block.invalidChainId'));
            return;
        }
        if (
            typedData.domain.verifyingContract.toLowerCase() !==
            smartAccount.address.toLowerCase()
        ) {
            setBlock(t('transact.block.smartAccountMismatch'));
            return;
        }
        setBlock(null);
    }, [verified, parsed, smartAccount?.address, chainId, t]);

    // Decode each clause to a human-readable summary.
    useEffect(() => {
        if (parsed?.kind !== 'smart_account') {
            setDecoded(null);
            return;
        }
        const selfAddress = smartAccount?.address;
        let cancelled = false;
        (async () => {
            // Resolve the generic delegator's deposit account so transfers
            // funding the gas payer get re-labelled as "Pay transaction fee".
            // Cached after the first call; null if the delegator is
            // unreachable (decoder gracefully falls back to the raw label).
            const feeDepositAccount =
                (await fetchGenericDelegatorDepositAccount()) ?? undefined;
            const results = await Promise.all(
                parsed.clauses.map((c) =>
                    decodeClause(
                        c,
                        thor,
                        networkType,
                        selfAddress,
                        feeDepositAccount,
                    ),
                ),
            );
            if (!cancelled) setDecoded(results);
        })();
        return () => {
            cancelled = true;
        };
    }, [parsed, smartAccount?.address]);

    const onApprove = useCallback(async () => {
        if (!verified || !parsed) return;
        setSubmitting(true);
        setSubmitError(null);
        try {
            let signature: string;
            if (parsed.kind === 'message') {
                const result = await signMessage(
                    { message: parsed.message },
                    {
                        uiOptions: {
                            title: t('transact.privyUi.signMessage'),
                            buttonText: t('transact.privyUi.signButton'),
                        },
                    },
                );
                signature = result.signature;
            } else {
                const result = await signTypedData(
                    parsed.typedData as Parameters<typeof signTypedData>[0],
                    {
                        uiOptions: {
                            title:
                                parsed.kind === 'smart_account'
                                    ? t('transact.privyUi.approveVeChainTx')
                                    : t('transact.privyUi.signStructuredData'),
                            buttonText: t('transact.privyUi.signButton'),
                        },
                    },
                );
                signature = result.signature;
            }
            const accessToken = await getAccessToken();
            await client.handleRequestResult({
                accessToken: accessToken ?? undefined,
                result: signature,
                connection: verified.connection,
            });
            window.close();
        } catch (e) {
            const message =
                e instanceof Error ? e.message : t('transact.error.failedToSign');
            setSubmitError(message);
            try {
                const accessToken = await getAccessToken();
                await client.handleError({
                    accessToken: accessToken ?? undefined,
                    error: e instanceof Error ? e : new Error(message),
                    callbackUrl: verified.connection.callbackUrl,
                    errorCode: 4001,
                });
            } catch {
                /* swallow; user can still close window manually */
            }
        } finally {
            setSubmitting(false);
        }
    }, [
        client,
        verified,
        parsed,
        signMessage,
        signTypedData,
        getAccessToken,
    ]);

    const onReject = useCallback(async () => {
        // Stale-connection close path: there's no `verified` (decrypt
        // failed), so we have no callbackUrl to do a proper rejectRequest.
        // Instead, post a PRIVY_CROSS_APP_ACTION_ERROR with our marker
        // directly to the opener. Privy's SDK on the kit-using app side
        // listens for this type, rejects the pending sign promise with our
        // error string, and auto-closes this window. The kit then sees
        // "vk:cross-app-no-connection" in the rejection and runs the
        // disconnect + reopen-modal recovery — much more reliable than a
        // custom postMessage that requires our own listener to be live.
        if (parseError?.kind === 'connection_expired') {
            try {
                window.opener?.postMessage(
                    {
                        type: 'PRIVY_CROSS_APP_ACTION_ERROR',
                        error: 'vk:cross-app-no-connection',
                        errorCode: 4002,
                    },
                    '*',
                );
            } catch {
                /* opener gone; fall back to plain close */
            }
            window.close();
            return;
        }
        if (!verified) {
            window.close();
            return;
        }
        setSubmitting(true);
        try {
            const accessToken = await getAccessToken();
            await client.rejectRequest({
                accessToken: accessToken ?? undefined,
                callbackUrl: verified.connection.callbackUrl,
            });
        } finally {
            window.close();
        }
    }, [client, verified, getAccessToken, parseError]);

    if (parseError?.kind === 'no_params') {
        return (
            <>
                <VechainHeader title={t('transact.title.noRequest')} />
                <div className={styles.card}>
                    <p className={styles.fallbackText}>
                        {t('transact.noRequestBody')}
                    </p>
                </div>
            </>
        );
    }

    if (!ready) {
        return (
            <>
                <VechainHeader title={t('transact.title.reviewing')} />
                <div className={styles.center}>
                    <div className={styles.spinner} />
                </div>
            </>
        );
    }

    if (!authenticated) {
        // Privy session expired (or first-time visitor). Skip Privy's modal
        // entirely and drive the headless login hooks through our own
        // SignInPanel. If we stashed an identity from a previous session,
        // greet the user with it and pre-highlight the provider they used
        // last — a cold re-login becomes a one-tap.
        const last = getLastIdentity();
        return (
            <>
                <VechainHeader
                    title={
                        last
                            ? t('transact.title.welcomeBack', {
                                  identity: last.label,
                              })
                            : t('transact.title.signIn')
                    }
                    subtitle={t('transact.subtitle.signInWaiting')}
                />
                <SignInPanel
                    intent={null}
                    onCancel={onReject}
                    presetRecent={last?.provider ?? null}
                />
            </>
        );
    }

    if (parseError?.kind === 'connection_expired') {
        // The kit-using app encrypted this payload with a connection that
        // Privy no longer has on file (TTL expired or first-time visitor).
        // Don't expose the raw "No connection found" string — it reads as
        // an internal error. Tell the user what actually happened and what
        // to do next. The parent app has already been notified via
        // postMessage and will re-prompt login on close.
        return (
            <>
                <VechainHeader
                    title={t('transact.title.connectionExpired')}
                    subtitle={t('transact.subtitle.connectionExpired')}
                />
                <div className={styles.card}>
                    <p className={styles.fallbackText}>
                        {t('transact.copy.connectionExpiredBody')}
                    </p>
                </div>
                <button
                    type="button"
                    className={styles.btnGhost}
                    onClick={onReject}
                >
                    {t('common.button.close')}
                </button>
            </>
        );
    }

    if (parseError?.kind === 'invalid') {
        // Two cards: the error alert + a way out. Without the close button
        // the user is stuck — no spinner moves, nothing's clickable, and
        // `window.close()` isn't reachable from anywhere on this screen.
        // `onReject` falls back to plain `window.close()` when there's no
        // verified request to send a reject postMessage to, which is
        // exactly the state we're in here.
        return (
            <>
                <VechainHeader title={t('transact.title.couldNotLoad')} />
                <div className={`${styles.alert} ${styles.alertError}`}>
                    {parseError.message ||
                        t('transact.error.failedToRead')}
                </div>
                <button
                    type="button"
                    className={styles.btnGhost}
                    onClick={onReject}
                >
                    {t('common.button.cancel')}
                </button>
            </>
        );
    }

    // Keep the loading shell until *all* account info is ready: the
    // verified cross-app request, the parsed clause shape, AND the user's
    // smart-account address. Without the smart account we'd render a card
    // with a hole where the IdentityRow goes, then pop it in -- jarring.
    // Better to spin a beat longer and reveal the full UI in one frame.
    if (!verified || !parsed || !smartAccount?.address) {
        return (
            <>
                <VechainHeader title={t('transact.title.reviewing')} />
                <div className={styles.center}>
                    <div className={styles.spinner} />
                </div>
            </>
        );
    }

    const blocked = block !== null;
    const isSmartAccount = parsed.kind === 'smart_account';
    const stillDecoding = isSmartAccount && decoded === null;
    const hasUnknown =
        isSmartAccount && (decoded?.some((d) => d.kind === 'unknown') ?? false);
    const hasUnlimitedApprove =
        isSmartAccount &&
        (decoded?.some(
            (d) => d.kind === 'token_approve' && d.unlimited,
        ) ?? false);
    const risk: Risk = isSmartAccount ? computeRisk(decoded, blocked) : 'safe';
    const title = isSmartAccount
        ? titleForActions(decoded, blocked)
        : parsed.kind === 'message'
        ? t('transact.title.signMessage')
        : t('transact.title.signData');
    const subtitle = isSmartAccount
        ? decoded
            ? summarizeActions(decoded)
            : ''
        : parsed.kind === 'message'
        ? t('transact.subtitle.reviewMessage')
        : t('transact.subtitle.reviewData');
    const ctaLabel = isSmartAccount ? continueLabel(risk) : t('transact.button.sign');
    // Always surface the smart account as "your account" -- it's the address
    // apps see on-chain and where the user's identity sits. The embedded EOA
    // is an implementation detail; for personal_sign / generic typed data
    // the signature comes from it, but the user thinks in terms of their
    // VeChain identity. We render the chip only once the smart account
    // resolves so we don't flash the embedded address first.
    const accountChipAddress = smartAccount?.address;
    const continueDisabled =
        blocked ||
        submitting ||
        (isSmartAccount && (!smartAccount?.address || stillDecoding));

    return (
        <>
            <VechainHeader
                title={title}
                subtitle={subtitle}
                requesterUrl={verified.connection.callbackUrl}
            />
            <div className={styles.card}>
                <div className={styles.cardBody}>
                    {accountChipAddress && (
                        <IdentityRow
                            walletAddress={accountChipAddress}
                            user={user}
                        />
                    )}
                    {parsed.kind === 'smart_account' && (
                        <div className={styles.section}>
                            <p className={styles.sectionHeader}>
                                {t('transact.section.actionsToApprove')}
                            </p>
                            {stillDecoding ? (
                                <div className={styles.actionList}>
                                    {parsed.clauses.map((_, i) => (
                                        <ActionRowSkeleton key={i} />
                                    ))}
                                </div>
                            ) : (
                                <div className={styles.actionList}>
                                    {decoded!.map((d, i) => (
                                        <ActionRow
                                            key={i}
                                            action={d}
                                            self={smartAccount?.address}
                                            index={
                                                decoded!.length > 1
                                                    ? i + 1
                                                    : undefined
                                            }
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                    {parsed.kind === 'message' && (
                        <MessageView message={parsed.message} />
                    )}
                    {parsed.kind === 'typed_data' && (
                        <TypedDataView typedData={parsed.typedData} />
                    )}

                    {blocked && (
                        <div className={`${styles.alert} ${styles.alertError}`}>
                            {block}
                        </div>
                    )}

                    {!blocked && hasUnknown && (
                        <div className={`${styles.alert} ${styles.alertWarn}`}>
                            {t('transact.alert.unverifiedStep')}
                        </div>
                    )}

                    {!blocked && !hasUnknown && hasUnlimitedApprove && (
                        <div className={`${styles.alert} ${styles.alertWarn}`}>
                            {t('transact.alert.unlimitedApprove')}
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
                        onClick={onApprove}
                        disabled={continueDisabled}
                    >
                        {submitting ? t('transact.button.signing') : ctaLabel}
                    </button>
                    <button
                        type="button"
                        className={styles.btnGhost}
                        onClick={onReject}
                        disabled={submitting}
                    >
                        {t('common.button.cancel')}
                    </button>

                    <div className={styles.inspectRow}>
                        <span className={styles.muted}>
                            {t('transact.inspect.prompt')}
                        </span>
                        <button
                            type="button"
                            className={styles.linkBtn}
                            onClick={() => setInspectOpen((s) => !s)}
                        >
                            {inspectOpen
                                ? t('transact.inspect.hide')
                                : t('transact.inspect.show')}
                            {inspectOpen ? (
                                <LuChevronUp size={12} />
                            ) : (
                                <LuChevronDown size={12} />
                            )}
                        </button>
                    </div>
                    <div
                        className={`${styles.collapse} ${
                            inspectOpen
                                ? styles.collapseOpen
                                : styles.collapseClosed
                        }`}
                    >
                        <div className={styles.detailsList}>
                            <DetailRow
                                label={t('transact.detail.yourAccount')}
                                value={
                                    accountChipAddress
                                        ? truncateAddress(accountChipAddress)
                                        : t('transact.detail.resolving')
                                }
                            />
                            <DetailRow
                                label={t('transact.detail.network')}
                                value={networkLabel(networkType, t)}
                            />
                            {parsed.kind === 'smart_account' && (
                                <>
                                    <DetailRow
                                        label={t('transact.detail.type')}
                                        value={humanPrimaryType(
                                            parsed.typedData.primaryType,
                                        )}
                                    />
                                    <div className={styles.clauseStack}>
                                        <p className={styles.typedHead}>
                                            {parsed.clauses.length === 1
                                                ? t('transact.detail.clauseSingular')
                                                : t('transact.detail.clausePlural', { count: parsed.clauses.length })}
                                        </p>
                                        {parsed.clauses.map((c, i) => (
                                            <RawClauseRow
                                                key={i}
                                                clause={c}
                                                index={i}
                                                total={parsed.clauses.length}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                            {parsed.kind === 'typed_data' && (
                                <>
                                    <DetailRow
                                        label={t('transact.detail.type')}
                                        value={humanPrimaryType(
                                            parsed.typedData.primaryType,
                                        )}
                                    />
                                    {parsed.typedData.domain.name && (
                                        <DetailRow
                                            label={t('transact.detail.domain')}
                                            value={parsed.typedData.domain.name}
                                        />
                                    )}
                                    <RawJsonBlock
                                        label={t('transact.detail.rawData')}
                                        value={JSON.stringify(
                                            parsed.typedData,
                                            null,
                                            2,
                                        )}
                                    />
                                </>
                            )}
                            {parsed.kind === 'message' && (
                                <RawJsonBlock
                                    label={t('transact.detail.rawHex')}
                                    value={parsed.raw}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

function MessageView({ message }: { message: string }) {
    const { t } = useTranslation();
    return (
        <div className={styles.subPanel}>
            <p className={styles.subPanelLabel}>{t('transact.detail.message')}</p>
            <p className={styles.messageBody}>
                {message || t('transact.detail.emptyMessage')}
            </p>
        </div>
    );
}

/**
 * Render a typed-data message as labelled key/value rows instead of a raw
 * JSON dump. Uses the EIP-712 `types` schema to drive per-field rendering:
 *   - `address` → AddressTag (avatar, domain, truncated hex)
 *   - `bool` → Yes / No
 *   - bytes / numbers → monospace
 *   - nested struct types → recurse with a left-bar indent
 *   - arrays → bullet list
 * The full raw JSON is still available in the Inspect panel below.
 */
function TypedDataView({ typedData }: { typedData: GenericTypedData }) {
    const fields = typedData.types[typedData.primaryType] ?? [];
    return (
        <div className={styles.subPanel}>
            <p className={styles.typedHead}>
                {humanPrimaryType(typedData.primaryType)}
            </p>
            {typedData.domain.name && (
                <p className={styles.typedFrom}>From: {typedData.domain.name}</p>
            )}
            <div className={styles.typedFields}>
                {fields.length > 0 ? (
                    fields.map((f) => (
                        <TypedField
                            key={f.name}
                            label={f.name}
                            type={f.type}
                            value={(typedData.message as Record<string, unknown>)[f.name]}
                            types={typedData.types}
                        />
                    ))
                ) : (
                    // No schema → fall back to JSON so we don't render nothing.
                    <pre className={styles.code}>
                        {JSON.stringify(typedData.message, null, 2)}
                    </pre>
                )}
            </div>
        </div>
    );
}

function TypedField({
    label,
    type,
    value,
    types,
}: {
    label: string;
    type: string;
    value: unknown;
    types: Record<string, Array<{ name: string; type: string }>>;
}) {
    return (
        <div className={styles.typedField}>
            <span className={styles.typedFieldLabel}>
                {humanizeFieldName(label)}
            </span>
            <div className={styles.typedFieldValue}>
                <TypedValue type={type} value={value} types={types} />
            </div>
        </div>
    );
}

function TypedValue({
    type,
    value,
    types,
}: {
    type: string;
    value: unknown;
    types: Record<string, Array<{ name: string; type: string }>>;
}) {
    const { t } = useTranslation();

    // Array type: render each entry recursively.
    if (type.endsWith('[]')) {
        const elemType = type.slice(0, -2);
        const arr = Array.isArray(value) ? value : [];
        if (arr.length === 0) {
            return (
                <span style={{ color: 'var(--text-subtle)' }}>
                    {t('common.empty')}
                </span>
            );
        }
        return (
            <ul className={styles.typedFieldList}>
                {arr.map((entry, i) => (
                    <li key={i}>
                        <TypedValue type={elemType} value={entry} types={types} />
                    </li>
                ))}
            </ul>
        );
    }

    // Nested struct: recurse into its fields with an indented sub-block.
    const nestedFields = types[type];
    if (nestedFields && typeof value === 'object' && value !== null) {
        return (
            <div className={styles.typedFieldNested}>
                {nestedFields.map((f) => (
                    <TypedField
                        key={f.name}
                        label={f.name}
                        type={f.type}
                        value={(value as Record<string, unknown>)[f.name]}
                        types={types}
                    />
                ))}
            </div>
        );
    }

    // Primitives.
    if (type === 'address' && typeof value === 'string') {
        return <AddressTag address={value} kind="recipient" />;
    }
    if (type === 'bool') {
        return <span>{value ? t('common.yes') : t('common.no')}</span>;
    }
    if (type === 'string') {
        return <span>{String(value)}</span>;
    }
    if (
        type.startsWith('bytes') ||
        type.startsWith('uint') ||
        type.startsWith('int')
    ) {
        return (
            <span className={styles.typedFieldMono}>
                {value === undefined || value === null ? '' : String(value)}
            </span>
        );
    }
    // Unknown type — stringify but flag visually.
    return (
        <span className={styles.typedFieldMono}>{JSON.stringify(value)}</span>
    );
}

// "myFieldName" → "My field name". Leaves abbreviations and snake_case alone
// where possible; the goal is to read as a label, not a variable identifier.
function humanizeFieldName(name: string): string {
    if (!name) return '';
    const spaced = name
        .replace(/_/g, ' ')
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .toLowerCase();
    return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

function RawJsonBlock({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className={styles.typedHead}>{label}</p>
            <pre className={styles.codeBlock}>{value}</pre>
        </div>
    );
}

function ActionRowSkeleton() {
    return (
        <div className={styles.skeletonStack}>
            <div className={`${styles.skeletonBar} ${styles.skeletonBarLg}`} />
            <div className={`${styles.skeletonBar} ${styles.skeletonBarSm}`} />
        </div>
    );
}

function ActionRow({
    action,
    self,
    index,
}: {
    action: DecodedClause;
    self?: string;
    /** When set, renders a small numbered chip before the title. Used to
     *  visually frame multi-step batches as a sequence. */
    index?: number;
}) {
    const warn =
        action.kind === 'unknown' ||
        (action.kind === 'token_approve' &&
            (action as { unlimited: boolean }).unlimited);
    return (
        <div
            className={`${styles.actionRow} ${warn ? styles.actionRowWarn : ''}`}
        >
            {index !== undefined && (
                <span className={styles.actionStep}>{index}</span>
            )}
            <div className={styles.actionBody}>
                <p className={styles.actionTitle}>{action.summary}</p>
                <ActionRowDetail action={action} self={self} />
            </div>
        </div>
    );
}

function ActionRowDetail({
    action,
    self,
}: {
    action: DecodedClause;
    self?: string;
}) {
    const { t } = useTranslation();
    switch (action.kind) {
        case 'native_transfer':
        case 'token_transfer':
            return (
                <p className={styles.actionDetail}>
                    <span className={styles.actionDetailLabel}>
                        {t('transact.detail.to')}
                    </span>
                    <AddressTag
                        address={action.recipient}
                        self={self}
                        kind="recipient"
                    />
                </p>
            );
        case 'token_approve':
            return (
                <p className={styles.actionDetail}>
                    <span className={styles.actionDetailLabel}>
                        {t('transact.detail.spender')}
                    </span>
                    <AddressTag
                        address={action.spender}
                        self={self}
                        kind="contract"
                    />
                </p>
            );
        case 'known_action':
            if (action.recipient) {
                return (
                    <p className={styles.actionDetail}>
                        <span className={styles.actionDetailLabel}>
                            {t('transact.detail.to')}
                        </span>
                        <AddressTag
                            address={action.recipient}
                            self={self}
                            kind="recipient"
                        />
                    </p>
                );
            }
            if (action.spender) {
                return (
                    <p className={styles.actionDetail}>
                        <span className={styles.actionDetailLabel}>
                            {t('transact.detail.operator')}
                        </span>
                        <AddressTag
                            address={action.spender}
                            self={self}
                            kind="contract"
                        />
                    </p>
                );
            }
            if (action.detail) {
                return (
                    <p className={styles.actionDetail}>{action.detail}</p>
                );
            }
            return null;
        case 'unknown':
            if (action.signature) {
                return (
                    <p className={styles.actionDetail}>
                        {t('transact.detail.function', { signature: action.signature })}
                    </p>
                );
            }
            if (action.selector) {
                return (
                    <p className={styles.actionDetail}>
                        {t('transact.detail.selector', { selector: action.selector })}
                    </p>
                );
            }
            return null;
        default:
            return null;
    }
}

function formatAmount(raw: bigint, decimals: number): string {
    const str = formatUnits(raw, decimals);
    if (!str.includes('.')) return str;
    const [whole, frac] = str.split('.');
    const trimmed = frac.replace(/0+$/, '').slice(0, 4);
    return trimmed.length === 0 ? whole : `${whole}.${trimmed}`;
}

function parseValueOrZero(value: string): bigint {
    if (!value) return BigInt(0);
    try {
        return BigInt(value);
    } catch {
        return BigInt(0);
    }
}

function RawClauseRow({
    clause,
    index,
    total,
}: {
    clause: { to: string; value: string; data: string };
    index: number;
    total: number;
}) {
    const { t } = useTranslation();
    const [showRaw, setShowRaw] = useState(false);
    const valueWei = parseValueOrZero(clause.value);
    const hasValue = valueWei > BigInt(0);
    const hasData = Boolean(clause.data) && clause.data !== '0x';
    return (
        <div className={styles.subPanel}>
            <div className={styles.clauseHeader}>
                <span className={styles.detailLabel}>
                    {t('transact.detail.clauseLabel', {
                        index: index + 1,
                        total,
                    })}
                </span>
                <AddressTag address={clause.to} />
            </div>
            {hasValue && (
                <DetailRow
                    label={t('transact.detail.value')}
                    value={`${formatAmount(valueWei, 18)} VET`}
                />
            )}
            {hasData && (
                <div>
                    <button
                        type="button"
                        className={styles.linkBtn}
                        onClick={() => setShowRaw((s) => !s)}
                    >
                        {showRaw
                            ? t('transact.inspect.hideCalldata')
                            : t('transact.inspect.showCalldata')}
                        {showRaw ? (
                            <LuChevronUp size={12} />
                        ) : (
                            <LuChevronDown size={12} />
                        )}
                    </button>
                    <div
                        className={`${styles.collapse} ${
                            showRaw
                                ? styles.collapseOpen
                                : styles.collapseClosed
                        }`}
                    >
                        <pre className={styles.code}>{clause.data}</pre>
                    </div>
                </div>
            )}
        </div>
    );
}

function DetailRow({
    label,
    value,
}: {
    label: string;
    value: React.ReactNode;
}) {
    return (
        <div className={styles.detailRow}>
            <span className={styles.detailLabel}>{label}</span>
            {typeof value === 'string' ? (
                <span className={styles.detailValue}>{value}</span>
            ) : (
                value
            )}
        </div>
    );
}

function networkLabel(
    type: string,
    t: (key: string) => string,
): string {
    switch (type) {
        case 'main':
            return t('transact.network.mainnet');
        case 'test':
            return t('transact.network.testnet');
        case 'solo':
            return t('transact.network.solo');
        default:
            return type;
    }
}
````

## Source: `cross-app-connect/src/app/cross-app/transact/page.tsx`

````tsx
import { TransactClient } from './TransactClient';
import styles from './transact.module.css';

/**
 * Server Component shell for the transact popup. Renders the page container
 * directly to HTML so the browser paints structure before the client island
 * parses. All dynamic behaviour (decrypt URL params, fetch on-chain data,
 * sign + submit) lives in `TransactClient.tsx`.
 */
export default function CrossAppTransactPage() {
    return (
        <main className={styles.shell}>
            <TransactClient />
        </main>
    );
}
````

## Source: `cross-app-connect/src/app/cross-app/transact/transact.module.css`

````css
.shell {
    max-width: 28rem;
    margin: 0 auto;
    padding: 32px 16px;
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.card {
    background: var(--bg-card);
    border-radius: var(--radius-md);
    padding: 16px;
}

.cardBody {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.section {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.sectionHeader {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--text-subtle);
    margin: 0;
    padding: 0 4px;
}

.center {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px 0;
}

.spinner {
    width: 32px;
    height: 32px;
    border: 3px solid var(--border-button);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

.fallbackText {
    color: var(--text-muted);
    text-align: center;
    font-size: 14px;
    line-height: 1.4;
    margin: 0;
}

.alert {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    padding: 12px;
    border-radius: var(--radius-md);
    border-left: 3px solid;
    font-size: 12px;
    line-height: 1.3;
}

.alertError {
    background: rgba(239, 68, 68, 0.08);
    border-left-color: var(--danger);
    color: var(--text-strong);
}

.alertWarn {
    background: rgba(245, 158, 11, 0.08);
    border-left-color: var(--warn);
    color: var(--text-strong);
}

.btnBrand {
    background: var(--primary-btn-bg);
    color: var(--primary-btn-color);
    border: none;
    border-radius: var(--radius-full);
    height: 48px;
    padding: 0 16px;
    font-weight: 500;
    font-size: 15px;
    width: 100%;
    transition: opacity 0.2s;
}

.btnBrand:hover:not(:disabled) {
    opacity: 0.85;
}

.btnBrand:disabled {
    opacity: 0.5;
}

.btnGhost {
    background: transparent;
    color: var(--text-muted);
    border: 1px solid var(--border-button);
    border-radius: var(--radius-full);
    height: 48px;
    padding: 0 24px;
    font-weight: 500;
    width: 100%;
    transition: all 0.2s;
}

.btnGhost:hover:not(:disabled) {
    background: var(--login-btn-hover-bg);
    color: var(--text-strong);
}

.btnGhost:disabled {
    opacity: 0.4;
}

.linkBtn {
    background: transparent;
    border: none;
    padding: 0;
    color: var(--text-muted);
    font-size: 14px;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    gap: 4px;
}

.linkBtn:hover {
    color: var(--text-strong);
    text-decoration: underline;
}

.inspectRow {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 4px;
    padding-top: 4px;
}

.muted {
    font-size: 12px;
    color: var(--text-subtle);
    margin: 0;
}

.actionList {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.actionRow {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 4px 0 4px 12px;
    border-left: 2px solid var(--border-button);
}

.actionRowWarn {
    border-left-color: var(--warn);
}

.actionStep {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border-radius: var(--radius-full);
    background: var(--login-btn-hover-bg);
    color: var(--text-muted);
    font-size: 11px;
    font-weight: 600;
    font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
    flex-shrink: 0;
    margin-top: 1px;
}

.actionBody {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
    gap: 8px;
}

.actionTitle {
    font-weight: 600;
    color: var(--text-strong);
    margin: 0;
}

.actionDetail {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
    color: var(--text-muted);
    margin: 0;
}

.actionDetailLabel {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--text-subtle);
    flex-shrink: 0;
}

.skeletonStack {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding-left: 12px;
    border-left: 2px solid var(--border-button);
}

.skeletonBar {
    background: var(--login-btn-hover-bg);
    border-radius: var(--radius-sm);
    animation: pulse 1.5s ease-in-out infinite;
}

.skeletonBarLg {
    height: 16px;
    width: 55%;
}

.skeletonBarSm {
    height: 12px;
    width: 35%;
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.55; }
}

.subPanel {
    padding: 12px;
    border-radius: var(--radius-md);
    background: var(--bg-card-elevated);
    border: 1px solid var(--border-default);
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.subPanelLabel {
    font-size: 12px;
    color: var(--text-subtle);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin: 0 0 8px;
}

.messageBody {
    font-size: 14px;
    color: var(--text-strong);
    white-space: pre-wrap;
    word-break: break-word;
    margin: 0;
}

.typedHead {
    font-size: 12px;
    color: var(--text-subtle);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin: 0;
}

.typedFrom {
    font-size: 12px;
    color: var(--text-muted);
    margin: 0;
}

.code {
    font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
    font-size: 12px;
    color: var(--text-strong);
    white-space: pre-wrap;
    word-break: break-word;
    background: transparent;
    margin: 0;
}

.typedFields {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 4px;
}

.typedField {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
}

.typedFieldLabel {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--text-subtle);
}

.typedFieldValue {
    font-size: 14px;
    color: var(--text-strong);
    word-break: break-word;
    min-width: 0;
}

.typedFieldNested {
    margin-top: 4px;
    padding-left: 12px;
    border-left: 1px solid var(--border-default);
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.typedFieldMono {
    font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
    font-size: 13px;
}

.typedFieldList {
    display: flex;
    flex-direction: column;
    gap: 4px;
    list-style: none;
    margin: 0;
    padding: 0;
}

.codeBlock {
    font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
    font-size: 12px;
    color: var(--text-muted);
    white-space: pre-wrap;
    word-break: break-all;
    padding: 12px;
    border-radius: var(--radius-md);
    background: var(--bg-card-elevated);
    border: 1px solid var(--border-default);
    margin: 0;
}

.detailsList {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 8px;
}

.detailRow {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.detailLabel {
    font-size: 12px;
    color: var(--text-subtle);
    margin: 0;
}

.detailValue {
    font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
    font-size: 12px;
    color: var(--text-muted);
    margin: 0;
}

.clauseStack {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.clauseHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.collapse {
    overflow: hidden;
    transition: max-height 0.2s ease, opacity 0.2s ease;
}

.collapseOpen {
    max-height: 2000px;
    opacity: 1;
}

.collapseClosed {
    max-height: 0;
    opacity: 0;
}
````

## Source: `cross-app-connect/src/app/globals.css`

````css
/* Design tokens mirror the defaults used by `@vechain/vechain-kit` so the
   whitelabel host feels native next to consumer dApps. Source of truth was
   `theme/brand.ts` before this migration; tokens are now consumed directly
   as CSS variables. */

:root {
    /* surfaces */
    --bg-page: #ffffff;
    --bg-card: #f5f5f5;
    --bg-card-elevated: #ffffff;
    --border-default: transparent;
    --border-button: #ebebeb;
    --border-hover: #d0d0d0;

    /* text */
    --text-strong: #2e2e2e;
    --text-muted: #4d4d4d;
    --text-subtle: #718096;

    /* buttons */
    --login-btn-bg: #ffffff;
    --login-btn-color: #1a1a1a;
    --login-btn-hover-bg: #f0f0f0;
    --primary-btn-bg: #272a2e;
    --primary-btn-color: #ffffff;

    /* accents */
    --accent: #3b82f6;
    --chip-bg: rgba(114, 102, 255, 0.12);
    --chip-text: #5b50cc;

    /* status */
    --danger: #ef4444;
    --warn: #f59e0b;
    --success: #10b981;

    /* typography */
    --font-heading: "Satoshi", "Inter", system-ui, -apple-system, sans-serif;
    --font-body: "Inter", system-ui, -apple-system, sans-serif;

    /* radii */
    --radius-sm: 8px;
    --radius-md: 12px;
    --radius-lg: 16px;
    --radius-xl: 24px;
    --radius-full: 9999px;
}

[data-color-mode='dark'] {
    --bg-page: #151515;
    --bg-card: rgba(255, 255, 255, 0.04);
    --bg-card-elevated: #2a2a2a;
    --border-default: rgba(255, 255, 255, 0.1);
    --border-button: rgba(255, 255, 255, 0.1);
    --border-hover: rgba(255, 255, 255, 0.2);

    --text-strong: rgb(223, 223, 221);
    --text-muted: rgba(223, 223, 221, 0.6);
    --text-subtle: rgba(223, 223, 221, 0.4);

    --login-btn-bg: transparent;
    --login-btn-color: #ffffff;
    --login-btn-hover-bg: rgba(255, 255, 255, 0.05);
    --primary-btn-bg: #ffffff;
    --primary-btn-color: rgba(0, 0, 0, 0.9);

    --accent: #60a5fa;
    --chip-bg: rgba(114, 102, 255, 0.2);
    --chip-text: #b9b0ff;
}

html,
body {
    margin: 0;
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

body {
    background: var(--bg-page);
    color: var(--text-strong);
    font-family: var(--font-body);
}

*,
*::before,
*::after {
    box-sizing: border-box;
}

button {
    font-family: inherit;
    cursor: pointer;
}

button:disabled {
    cursor: not-allowed;
}

a {
    color: inherit;
    text-decoration: none;
}
````

## Source: `cross-app-connect/src/app/i18n/I18nProvider.tsx`

````tsx
'use client';

import { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n, { resolveLanguage } from './config';

/**
 * Wraps the app in the i18next React context. Why the mounted gate:
 *
 * The browser paints the server-rendered HTML *before* any JavaScript
 * loads. If that HTML contained English copy and the user's language is
 * Italian, the user would see "Reviewing transaction" then a re-paint of
 * "Revisione transazione" once React hydrates — a real visual flash that
 * `useLayoutEffect` can't fix (the effect runs after JS loads, too late).
 *
 * So during SSR and the first client render we return `null` — no
 * translatable text in the initial HTML. Once mounted, we detect the
 * language (URL → localStorage → navigator → 'en') and apply it before
 * showing the children. The user's first painted frame is already in
 * their language; the brief blank moment is hidden behind the spinner
 * shell each page renders during its own loading state.
 *
 * Trade-off: routes are no longer SSR-rendered for translated content.
 * For a one-shot popup this is acceptable — JS loads fast and the popup
 * is too short-lived for SEO or Core Web Vitals to matter.
 */
export function I18nProvider({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const detected = resolveLanguage();
        if (detected && i18n.language !== detected) {
            i18n.changeLanguage(detected);
        }
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
````

## Source: `cross-app-connect/src/app/i18n/config.ts`

````typescript
'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import de from './locales/de.json';
import it from './locales/it.json';
import fr from './locales/fr.json';
import es from './locales/es.json';
import zh from './locales/zh.json';
import ja from './locales/ja.json';
import ru from './locales/ru.json';
import ro from './locales/ro.json';
import vi from './locales/vi.json';
import nl from './locales/nl.json';
import ko from './locales/ko.json';
import sv from './locales/sv.json';
import tw from './locales/tw.json';
import tr from './locales/tr.json';
import hi from './locales/hi.json';
import pt from './locales/pt.json';

/**
 * Languages we ship, matching the vechain-kit's set. Order is irrelevant;
 * the value is a string-set lookup used by `normalizeBrowserTag`.
 */
export const SUPPORTED_LANGUAGES = [
    'en', 'de', 'it', 'fr', 'es', 'zh', 'ja', 'ru', 'ro',
    'vi', 'nl', 'ko', 'sv', 'tw', 'tr', 'hi', 'pt',
] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

const SUPPORTED = new Set<string>(SUPPORTED_LANGUAGES);

const resources = {
    en: { translation: en },
    de: { translation: de },
    it: { translation: it },
    fr: { translation: fr },
    es: { translation: es },
    zh: { translation: zh },
    ja: { translation: ja },
    ru: { translation: ru },
    ro: { translation: ro },
    vi: { translation: vi },
    nl: { translation: nl },
    ko: { translation: ko },
    sv: { translation: sv },
    tw: { translation: tw },
    tr: { translation: tr },
    hi: { translation: hi },
    pt: { translation: pt },
};

/**
 * Map a BCP-47 tag from `navigator.language` (`en-US`, `zh-TW`, `pt-BR`,
 * `de-AT`, …) to the closest tag we ship. Variants of Chinese get special
 * treatment: Traditional → `tw`, everything else → `zh`.
 */
function normalizeBrowserTag(raw: string | undefined): SupportedLanguage | null {
    if (!raw) return null;
    const lower = raw.toLowerCase();
    if (lower.startsWith('zh')) {
        if (
            lower === 'zh-tw' ||
            lower === 'zh-hk' ||
            lower === 'zh-mo' ||
            lower.includes('hant')
        ) {
            return 'tw';
        }
        return 'zh';
    }
    const base = lower.split('-')[0];
    return SUPPORTED.has(base) ? (base as SupportedLanguage) : null;
}

/**
 * Always use the device's language; fall back to English when the browser
 * locale isn't one we ship. No URL override, no localStorage stash — the
 * popup mirrors the OS / browser setting every time it opens.
 */
export function resolveLanguage(): SupportedLanguage {
    if (typeof navigator === 'undefined') return 'en';
    return normalizeBrowserTag(navigator.language) ?? 'en';
}

// Initialise once at module load with 'en' so server-rendered HTML and the
// client's first React render produce *identical* strings — that's what
// avoids React's hydration-mismatch warning. The actual language is applied
// in `<I18nProvider>` after the SSR/first-render gate.
i18n.use(initReactI18next).init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false, // React already escapes
    },
    returnNull: false,
});

export default i18n;
````

## Source: `cross-app-connect/src/app/i18n/locales/en.json`

````json
{
    "common": {
        "button": {
            "back": "Back",
            "cancel": "Cancel",
            "close": "Close",
            "continue": "Continue",
            "continueAnyway": "Continue anyway"
        },
        "amount": {
            "unlimited": "Unlimited"
        },
        "tokens": "tokens",
        "yes": "Yes",
        "no": "No",
        "empty": "(empty)"
    },
    "vote": {
        "for": "FOR",
        "against": "AGAINST",
        "abstain": "ABSTAIN"
    },
    "header": {
        "title": {
            "default": "Log in to your wallet"
        }
    },
    "identity": {
        "creatingAccount": "Creating your VeChain account…",
        "signedIn": "Signed in"
    },
    "addressTag": {
        "verifiedContract": "Verified VeChain contract",
        "unverifiedContract": "Unverified contract — make sure you trust it before continuing"
    },
    "requester": {
        "localDev": "Local development site"
    },
    "domains": {
        "label": {
            "avatar": "avatar",
            "description": "description",
            "email": "email",
            "website": "website",
            "twitter": "Twitter handle",
            "github": "GitHub",
            "telegram": "Telegram",
            "fallback": "{{key}} record"
        }
    },
    "action": {
        "transfer": {
            "native": "Send {{amount}} VET",
            "token": "Send {{amount}} {{symbol}}"
        },
        "fee": {
            "payTransactionFee": "Pay transaction fee",
            "amount": "{{amount}} {{symbol}} to the gas payer"
        },
        "approve": {
            "unlimited": "Allow unlimited {{symbol}} spending",
            "upTo": "Allow spending up to {{amount}} {{symbol}}"
        },
        "unknown": {
            "runOn": "Run {{fn}} on a contract",
            "interact": "Interact with a contract"
        },
        "domain": {
            "removePrimary": "Remove your primary VeChain domain",
            "setPrimary": "Set {{name}} as your primary VeChain domain",
            "pointToYou": "Point your VeChain domain to your account",
            "updateAddress": "Update your VeChain domain address",
            "newTarget": "New target: {{addr}}",
            "removeRecord": "Remove {{label}}",
            "setRecordTo": "Set {{label}} to {{value}}",
            "updateRecord": "Update {{label}}",
            "claim": "Claim {{subdomain}}.veworld.vet"
        },
        "governance": {
            "voteOnProposal": "Vote {{vote}} on a VeBetterDAO proposal",
            "reason": "Reason: {{reason}}",
            "allocateSingle": "Vote in this VeBetterDAO allocation round",
            "allocateMany": "Allocate your vote across {{count}} apps this round",
            "endorse": "Endorse a VeBetterDAO app",
            "unendorse": "Withdraw your endorsement from a VeBetterDAO app"
        },
        "token": {
            "convertToVot3": "Convert {{amount}} B3TR → VOT3 (lock to vote)",
            "convertToB3tr": "Convert {{amount}} VOT3 → B3TR (unlock)",
            "pullFrom": "Pull tokens from an address",
            "recipientDetail": "Recipient: {{to}}"
        },
        "rewards": {
            "voter": "Claim VeBetterDAO voter rewards (cycle {{cycle}})",
            "allocation": "Claim allocation rewards for round {{round}}"
        },
        "swap": {
            "onDex": "Swap tokens on {{dex}}"
        },
        "nft": {
            "send": "Send an NFT",
            "transfer": "Transfer an NFT",
            "sendEditions": "Send {{count}} editions of an NFT",
            "sendBatch": "Send {{count}} NFTs in one go",
            "approveAll": "Allow this site to manage your NFTs",
            "revokeAll": "Revoke NFT management permission",
            "toDetail": "To: {{to}}",
            "operatorDetail": "Operator: {{operator}}"
        }
    },
    "transact": {
        "title": {
            "actionBlocked": "Action blocked",
            "confirmAction": "Confirm action",
            "confirmTokenTransfer": "Confirm token transfer",
            "confirmTokenTransfers": "Confirm token transfers",
            "confirmTokenApproval": "Confirm token approval",
            "confirmTokenApprovals": "Confirm token approvals",
            "confirmContractCall": "Confirm contract call",
            "confirmTokenSwap": "Confirm token swap",
            "confirmDomainUpdate": "Confirm domain update",
            "confirmVeBetterDaoVote": "Confirm VeBetterDAO vote",
            "confirmRewardsClaim": "Confirm rewards claim",
            "confirmNftTransfer": "Confirm NFT transfer",
            "confirmNftActions": "Confirm NFT actions",
            "confirmTokenAction": "Confirm token action",
            "confirmStakeUpdate": "Confirm stake update",
            "confirmNActions": "Confirm {{count}} actions",
            "noRequest": "No transaction request",
            "reviewing": "Reviewing transaction",
            "signIn": "Sign in to continue",
            "welcomeBack": "Welcome back, {{identity}}",
            "couldNotLoad": "Couldn't load request",
            "connectionExpired": "Reconnection needed",
            "signMessage": "Sign a message",
            "signData": "Sign data"
        },
        "subtitle": {
            "sendVet": "{{amount}} VET to {{recipient}}",
            "sendToken": "{{amount}} {{symbol}} to {{recipient}}",
            "approveFor": "{{amount}} {{symbol}} for {{spender}}",
            "swapVia": "{{amount}} {{symbol}} via {{dex}}",
            "swapAmount": "{{amount}} {{symbol}}",
            "swapViaOnly": "via {{dex}}",
            "switchingTo": "Switching to {{domain}}",
            "clearingPrimary": "Clearing your primary",
            "voteOnProposal": "{{vote}} proposal",
            "allocatingAcross": "Allocating across {{count}} apps",
            "endorsingApp": "Endorsing an app",
            "fromCycle": "From cycle {{cycle}}",
            "fromRound": "From round {{round}}",
            "conversion": "{{amount}} {{from}} → {{to}}",
            "actionsWithUnverified": "{{count}} actions, {{unverified}} unverified",
            "reviewMessage": "Review the message this app wants you to sign.",
            "reviewData": "Review the data this app wants you to sign.",
            "signInWaiting": "A signing request is waiting. Sign in to review it.",
            "connectionExpired": "Your connection session has expired"
        },
        "button": {
            "confirm": "Confirm",
            "confirmAnyway": "Confirm anyway",
            "confirmAsDanger": "I understand, confirm",
            "signing": "Signing…",
            "sign": "Sign"
        },
        "section": {
            "actionsToApprove": "Actions to approve"
        },
        "alert": {
            "unverifiedStep": "We couldn't double-check every step, so only continue if you trust this app.",
            "unlimitedApprove": "This app is asking for unlimited access to one of your tokens — make sure you trust it."
        },
        "inspect": {
            "prompt": "Want the technical details?",
            "show": "Inspect",
            "hide": "Hide",
            "showCalldata": "Show raw calldata",
            "hideCalldata": "Hide raw calldata"
        },
        "detail": {
            "yourAccount": "Your account",
            "resolving": "resolving…",
            "network": "Network",
            "type": "Type",
            "clauseSingular": "Clause",
            "clausePlural": "Clauses ({{count}})",
            "clauseLabel": "Clause {{index}} of {{total}} · to",
            "value": "Value",
            "domain": "Domain",
            "rawData": "Raw data",
            "rawHex": "Raw hex",
            "function": "Function: {{signature}}",
            "selector": "Selector: {{selector}}",
            "message": "Message",
            "emptyMessage": "(empty message)",
            "authorizedCall": "Authorized call",
            "authorizedBatchCall": "Authorized batch call",
            "to": "To",
            "spender": "Spender",
            "operator": "Operator"
        },
        "network": {
            "mainnet": "VeChain Mainnet",
            "testnet": "VeChain Testnet",
            "solo": "Local Thor Solo"
        },
        "block": {
            "unsupportedMethod": "Unsupported method: {{method}}",
            "chainIdMismatch": "Chain id mismatch",
            "invalidChainId": "Invalid chain id in request",
            "smartAccountMismatch": "Smart account mismatch: the request is signing for a different smart account."
        },
        "error": {
            "failedToRead": "Failed to read request",
            "failedToSign": "Failed to sign request"
        },
        "copy": {
            "connectionExpiredBody": "Return to the app that opened this window and log in again — your wallet will reconnect automatically, and you can retry the action."
        },
        "privyUi": {
            "signMessage": "Sign message",
            "signButton": "Sign",
            "approveVeChainTx": "Approve VeChain transaction",
            "signStructuredData": "Sign structured data"
        },
        "noRequestBody": "This page handles cross-app transaction requests from other VeChain dApps. It can't be opened directly — the requesting app will open it with the parameters it needs."
    },
    "connect": {
        "title": {
            "default": "VeChain Connect",
            "couldNotLoad": "Couldn't load request",
            "logIn": "Log in to your wallet",
            "connectTo": "Connect to {{app}}",
            "confirmConnection": "Confirm connection"
        },
        "subtitle": {
            "grantAccessTo": "Sign in to grant access to",
            "notBefore": "You haven't connected here before",
            "connecting": "Connecting…"
        },
        "button": {
            "connecting": "Connecting…",
            "useAnotherAccount": "Use another account"
        },
        "copy": {
            "notYou": "Not you?",
            "noRequestBody": "This page handles cross-app connection requests from other VeChain dApps. It can't be opened directly — the requesting app will open it with the parameters it needs."
        },
        "phone": {
            "placeholder": "+1 555 555 5555",
            "codeHint": "Include the country code, e.g. +1 for US, +44 for UK.",
            "sendCode": "Send code",
            "sending": "Sending…",
            "codeSent": "We sent a 6-digit code to {{phone}}.",
            "verify": "Verify",
            "verifying": "Verifying…"
        },
        "farcaster": {
            "comingSoon": "Farcaster sign-in is coming soon. It uses Sign In With Farcaster (SIWF), which needs a Warpcast scan and isn't wired up here yet. Please choose another option for now."
        },
        "provider": {
            "continueWith": "Continue with {{provider}}",
            "continueWithPhone": "Continue with Phone",
            "continueWithFarcaster": "Continue with Farcaster",
            "lastUsed": "Last used",
            "moreOptions": "+ {{count}} more options"
        },
        "alert": {
            "notListed": "This app isn't listed in the VeChain App Hub, so only continue if you trust the site."
        },
        "error": {
            "failedToAccept": "Failed to accept connection",
            "failedToSendCode": "Failed to send code",
            "failedToVerifyCode": "Failed to verify code",
            "missingAccessToken": "Missing access token"
        }
    },
    "landing": {
        "title": "VeChain Connect",
        "subtitle": "Whitelabel host for Privy cross-app connection and transaction flows.",
        "routes": "Routes",
        "connectDesc": "handles connection requests",
        "transactDesc": "handles transaction / signing requests",
        "footer": "This page isn't opened directly by users."
    }
}
````

## Source: `cross-app-connect/src/app/layout.tsx`

````tsx
import Script from 'next/script';
import { PrivyProviderWrapper } from './providers/PrivyProviderWrapper';
import { I18nProvider } from './i18n/I18nProvider';
import './globals.css';

// Pre-paint script: set `data-color-mode` on <html> from
// `prefers-color-scheme` so CSS vars resolve before first paint and we don't
// flash light → dark on cold load. Defaults to 'light' if matchMedia isn't
// available (older browsers). Uses Next's <Script> with the
// `beforeInteractive` strategy so it runs *before* React hydrates and
// doesn't trip React 19's "script in component" warning.
const colorModeScript = `(function(){try{var d=window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.dataset.colorMode=d?'dark':'light';}catch(e){document.documentElement.dataset.colorMode='light';}})();`;

export const metadata = {
    title: 'VeChain Connect',
    icons: {
        // Switch the favicon variant on prefers-color-scheme so the
        // VeChain logomark stays legible against both light and dark
        // browser tab UIs. The `dark` glyph is for light tabs (dark V
        // on light); the `light` glyph is for dark tabs (white V on
        // dark). Reuses the existing 300×300 PNGs in public/brand/.
        icon: [
            {
                url: '/brand/vechain-logomark-dark.png',
                media: '(prefers-color-scheme: light)',
            },
            {
                url: '/brand/vechain-logomark-light.png',
                media: '(prefers-color-scheme: dark)',
            },
        ],
        // iOS Add-to-Home-Screen — Apple doesn't honour prefers-color-scheme
        // here, so we always send the dark glyph (which reads against the
        // typical white home-screen tile).
        apple: '/brand/vechain-logomark-dark.png',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning data-color-mode="light">
            <head>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body suppressHydrationWarning>
                <Script
                    id="vk-color-mode"
                    strategy="beforeInteractive"
                >
                    {colorModeScript}
                </Script>
                <I18nProvider>
                    <PrivyProviderWrapper>{children}</PrivyProviderWrapper>
                </I18nProvider>
            </body>
        </html>
    );
}
````

## Source: `cross-app-connect/src/app/page.module.css`

````css
.shell {
    max-width: 42rem;
    margin: 0 auto;
    padding: 48px 16px;
    display: flex;
    flex-direction: column;
    gap: 32px;
}

.heading {
    font-family: var(--font-heading);
    font-size: 14px;
    font-weight: 600;
    color: var(--text-strong);
    margin: 0 0 8px;
}

.list {
    list-style: disc;
    padding-left: 20px;
    color: var(--text-muted);
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin: 0;
}

.code {
    font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
    font-size: 13px;
    background: var(--bg-card);
    padding: 2px 6px;
    border-radius: var(--radius-sm);
    color: var(--text-strong);
}

.footer {
    font-size: 14px;
    color: var(--text-subtle);
    text-align: center;
    margin: 0;
}
````

## Source: `cross-app-connect/src/app/page.tsx`

````tsx
'use client';

import { useTranslation } from 'react-i18next';
import { VechainHeader } from './components/VechainHeader';
import styles from './page.module.css';

export default function LandingPage() {
    const { t } = useTranslation();
    return (
        <main className={styles.shell}>
            <VechainHeader
                title={t('landing.title')}
                subtitle={t('landing.subtitle')}
            />
            <section>
                <h2 className={styles.heading}>{t('landing.routes')}</h2>
                <ul className={styles.list}>
                    <li>
                        <code className={styles.code}>/cross-app/connect</code>
                        {' '}&mdash; {t('landing.connectDesc')}
                    </li>
                    <li>
                        <code className={styles.code}>/cross-app/transact</code>
                        {' '}&mdash; {t('landing.transactDesc')}
                    </li>
                </ul>
            </section>
            <p className={styles.footer}>{t('landing.footer')}</p>
        </main>
    );
}
````

## Source: `cross-app-connect/src/app/providers/PrivyProviderWrapper.tsx`

````tsx
'use client';

import { PrivyProvider } from '@privy-io/react-auth';

const coloredLogo =
    'https://vechain.org/wp-content/uploads/2025/02/VeChain_Icon_Quartz_300ppi.png';

interface Props {
    children: React.ReactNode;
}

/**
 * Minimal Privy provider for the cross-app host. We don't wrap the kit's
 * VeChainKitProvider (DAppKit + PrivyWalletProvider + ModalProvider) because
 * this app only signs and hands the signature back -- the broadcast happens
 * in the requester's app. On-chain reads use ThorClient directly via
 * `cross-app/_lib/thor.ts`.
 */
export function PrivyProviderWrapper({ children }: Props) {
    const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
    if (!appId) {
        throw new Error(
            'NEXT_PUBLIC_PRIVY_APP_ID is required to bootstrap the ' +
                'cross-app host. Set it in the environment before building.',
        );
    }
    return (
        <PrivyProvider
            appId={appId}
            clientId={process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID}
            config={{
                loginMethodsAndOrder: {
                    primary: ['google', 'apple', 'twitter', 'email'],
                    overflow: ['discord'],
                },
                externalWallets: {
                    walletConnect: { enabled: false },
                },
                appearance: {
                    theme: 'light',
                    loginMessage: 'Sign in to continue',
                    logo: coloredLogo,
                },
                embeddedWallets: {
                    createOnLogin: 'all-users',
                },
                passkeys: {
                    shouldUnlinkOnUnenrollMfa: false,
                },
            }}
        >
            {children}
        </PrivyProvider>
    );
}
````

## Source: `cross-app-connect/src/types/css-modules.d.ts`

````typescript
// Ambient typing for CSS Modules so `tsc --noEmit` resolves
// `import styles from './foo.module.css'` without relying on Next.js's
// per-build generated types under `.next/types/`. The CI typecheck step
// runs before `next build`, so without this declaration TS reports
// "Cannot find module './foo.module.css'" on every CSS Module import.
declare module '*.module.css' {
    const classes: { readonly [key: string]: string };
    export default classes;
}
````
