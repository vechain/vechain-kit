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
