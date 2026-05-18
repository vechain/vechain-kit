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
