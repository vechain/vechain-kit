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
