'use client';

import { useState } from 'react';
import {
    LuCircleCheck,
    LuGlobe,
    LuLockKeyhole,
    LuTriangleAlert,
} from 'react-icons/lu';
import { lookupAppByUrl } from '../cross-app/_lib/app-hub';
import styles from './RequesterChip.module.css';

type Props = {
    url: string;
};

/**
 * Identifies the dApp asking to connect. Three signals stacked on the chip:
 *
 *   1. HTTPS lock      -- raw transport security check.
 *   2. Favicon          -- visual recognition cue from the requester's domain.
 *   3. Verified badge   -- match against vechain/app-hub registry. Listed
 *                          apps render their canonical Name + green check;
 *                          everything else gets an orange warning triangle.
 */
export function RequesterChip({ url }: Props) {
    const [iconBroken, setIconBroken] = useState(false);
    const parsed = safeParseUrl(url);
    if (!parsed) {
        return <span className={styles.fallback}>{url}</span>;
    }

    const isSecure = parsed.protocol === 'https:';
    const display =
        parsed.port && parsed.port !== '80' && parsed.port !== '443'
            ? `${parsed.hostname}:${parsed.port}`
            : parsed.hostname;
    const faviconSrc = `https://www.google.com/s2/favicons?domain=${parsed.hostname}&sz=64`;
    const appHubEntry = lookupAppByUrl(url);
    const verified = Boolean(appHubEntry);
    const SecurityIcon = isSecure ? LuLockKeyhole : LuGlobe;
    const VerifiedIcon = verified ? LuCircleCheck : LuTriangleAlert;

    return (
        <span
            className={`${styles.chip} ${verified ? styles.chipVerified : ''}`}
        >
            <SecurityIcon
                className={`${styles.icon} ${isSecure ? styles.iconSecure : styles.iconInsecure}`}
                aria-label={
                    isSecure ? 'Secure (HTTPS)' : 'Not encrypted (HTTP)'
                }
            />
            {!iconBroken && (
                <img
                    src={faviconSrc}
                    alt=""
                    className={styles.favicon}
                    onError={() => setIconBroken(true)}
                    draggable={false}
                />
            )}
            <span className={styles.label}>
                {verified ? appHubEntry!.name : display}
            </span>
            <VerifiedIcon
                className={`${styles.icon} ${verified ? styles.iconVerified : styles.iconUnverified}`}
                aria-label={
                    verified ? 'Verified VeChain app' : 'Unverified app'
                }
                title={
                    verified
                        ? 'Listed in the VeChain App Hub'
                        : 'Not listed in the VeChain App Hub — proceed only if you recognize this site'
                }
            />
        </span>
    );
}

function safeParseUrl(url: string): URL | null {
    try {
        return new URL(url);
    } catch {
        return null;
    }
}
