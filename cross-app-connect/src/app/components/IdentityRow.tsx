'use client';

import { Fragment, useEffect, useState, type ReactNode } from 'react';
import { Address } from '@vechain/sdk-core';
import { formatUnits, parseAbi } from 'viem';
import { useAddressInfo } from '../cross-app/_lib/useAddressInfo';
import { truncateAddress } from '../cross-app/_lib/format';
import { thor } from '../cross-app/_lib/thor';
import type { TokenInfo } from '../cross-app/_lib/decoder';
import { linkedSocials } from './socials';
import styles from './IdentityRow.module.css';

const ERC20_BALANCE_ABI = parseAbi([
    'function balanceOf(address owner) view returns (uint256)',
]);

const VET_TOKEN: TokenInfo = {
    address: 'VET',
    symbol: 'VET',
    decimals: 18,
};

type LiveBalance = { token: TokenInfo; raw: bigint };

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
    /**
     * When supplied, the row renders a right-side balance column showing
     * (transaction-relevant tokens first, VET last). Used on transact / sign
     * popups so the user can sanity-check coverage before signing. Omit on
     * the connect screen where there's no transaction context.
     */
    balanceTokens?: TokenInfo[];
};

type PrivyUserShape = {
    id?: string;
    email?: { address?: string } | null;
    google?: { email?: string } | null;
    phone?: unknown;
    farcaster?: unknown;
};

// 2 decimals when there's a whole-number part, 4 when value is < 1 (so tiny
// balances like 0.0042 are still readable). Inspect panel reveals full
// precision via the raw clause value field.
function formatBalance(raw: bigint, decimals: number): string {
    const str = formatUnits(raw, decimals);
    if (!str.includes('.')) return str;
    const [whole, frac] = str.split('.');
    const cap = whole === '0' ? 4 : 2;
    const trimmed = frac.replace(/0+$/, '').slice(0, cap);
    return trimmed.length === 0 ? whole : `${whole}.${trimmed}`;
}

/**
 * Shared "your account" row: avatar + display name (email or Privy id) +
 * linked-social icon badges + the smart-account address (with .vet domain
 * when one is set). On transact / sign popups it can also render a
 * right-side balance column (pass `balanceTokens`); on connect it stays
 * identity-only.
 */
export function IdentityRow({
    walletAddress,
    user,
    pendingLabel,
    balanceTokens,
}: Props) {
    const { domain, avatar, isLoading } = useAddressInfo(walletAddress);
    const u = user as PrivyUserShape | null | undefined;
    const email = u?.email?.address ?? u?.google?.email ?? u?.id;
    const linked = linkedSocials(u);
    const walletPending = !walletAddress || isLoading;

    const showBalances = balanceTokens !== undefined && !!walletAddress;
    const [balances, setBalances] = useState<LiveBalance[] | null>(null);
    const tokenKey = (balanceTokens ?? [])
        .map((t) => t.address.toLowerCase())
        .sort()
        .join(',');

    useEffect(() => {
        if (!showBalances || !walletAddress) return;
        let cancelled = false;
        (async () => {
            try {
                const vetTask = thor.accounts
                    .getAccount(Address.of(walletAddress))
                    .then((acc) => ({
                        token: VET_TOKEN,
                        raw: BigInt(acc.balance.toString()),
                    }));
                const erc20Tasks = (balanceTokens ?? [])
                    .filter(
                        (t) => t.address !== 'VET' && t.address !== 'vet',
                    )
                    .map(async (token) => {
                        const res = await thor.contracts
                            .load(token.address, ERC20_BALANCE_ABI)
                            .read.balanceOf(walletAddress as `0x${string}`);
                        return {
                            token,
                            raw: BigInt((res as unknown as [bigint])[0]),
                        };
                    });
                // Transaction-relevant tokens first; VET trails because it's
                // almost always there but rarely the asset being moved.
                const results = await Promise.all([...erc20Tasks, vetTask]);
                if (!cancelled) setBalances(results);
            } catch {
                if (!cancelled) setBalances(null);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [showBalances, walletAddress, tokenKey]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className={styles.container}>
            <div className={styles.row}>
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
                            title={email ?? undefined}
                        >
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
                            {pendingLabel ??
                                'Creating your VeChain account…'}
                        </p>
                    )}
                </div>
            </div>
            {showBalances && (
                <div className={styles.balanceRow}>
                    <span className={styles.balanceLabel}>Balance</span>
                    {balances === null ? (
                        <span
                            className={`${styles.skeleton} ${styles.skeletonBalance}`}
                        />
                    ) : (
                        balances.map((b, i) => (
                            <Fragment key={b.token.address}>
                                {i > 0 && (
                                    <span className={styles.balanceSep}>·</span>
                                )}
                                <span className={styles.balanceValue}>
                                    {formatBalance(b.raw, b.token.decimals)}{' '}
                                    {b.token.symbol}
                                </span>
                            </Fragment>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
