'use client';

import type { ReactNode } from 'react';
import { useAddressInfo } from '../cross-app/_lib/useAddressInfo';
import { truncateAddress } from '../cross-app/_lib/format';
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

type PrivyUserShape = {
    id?: string;
    email?: { address?: string } | null;
    google?: { email?: string } | null;
    phone?: unknown;
    farcaster?: unknown;
};

/**
 * Shared "your account" card: avatar + display name (email or Privy id) +
 * linked-social icon badges + the smart-account address (with .vet domain
 * when one is set). Used on both the connect confirm screen and the
 * transact/sign popups so the user sees a consistent identity treatment.
 */
export function IdentityRow({
    walletAddress,
    user,
    pendingLabel,
}: Props) {
    const { domain, avatar, isLoading } = useAddressInfo(walletAddress);
    const u = user as PrivyUserShape | null | undefined;
    const email = u?.email?.address ?? u?.google?.email ?? u?.id;
    const linked = linkedSocials(u);
    const walletPending = !walletAddress || isLoading;

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
                    <p className={styles.name} title={email ?? undefined}>
                        {email ?? 'Signed in'}
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
                        {pendingLabel ?? 'Creating your VeChain account…'}
                    </p>
                )}
            </div>
        </div>
    );
}
