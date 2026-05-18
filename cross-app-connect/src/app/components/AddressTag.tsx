'use client';

import { LuCircleCheck, LuTriangleAlert } from 'react-icons/lu';
import { resolveContractLabel } from '../cross-app/_lib/contracts';
import { useAddressInfo } from '../cross-app/_lib/useAddressInfo';
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

function truncate(addr: string): string {
    if (!addr || addr.length < 12) return addr;
    return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export function AddressTag({
    address,
    self,
    kind = 'contract',
    avatarSize = 20,
}: Props) {
    const { domain, avatar } = useAddressInfo(address);
    const resolved = resolveContractLabel(address, self);

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
                        aria-label="Verified"
                        title="Verified VeChain contract"
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
                        {truncate(address)}
                    </span>
                </span>
            ) : (
                <span className={styles.addressOnly}>{truncate(address)}</span>
            )}
            {kind === 'contract' && (
                <LuTriangleAlert
                    className={styles.iconWarn}
                    aria-label="Unverified"
                    title="Unverified contract — make sure you trust it before continuing"
                />
            )}
        </span>
    );
}
