'use client';

import { useEffect, useState } from 'react';
import { LuCheck, LuCopy } from 'react-icons/lu';
import { Address } from '@vechain/sdk-core';
import { formatUnits, parseAbi } from 'viem';
import { thor } from '../cross-app/_lib/thor';
import { useAddressInfo } from '../cross-app/_lib/useAddressInfo';
import type { TokenInfo } from '../cross-app/_lib/decoder';
import styles from './AccountChip.module.css';

const ERC20_BALANCE_ABI = parseAbi([
    'function balanceOf(address owner) view returns (uint256)',
]);

type Props = {
    address: string;
    /**
     * Additional tokens (beyond native VET) to display the user's balance
     * for. Typically the tokens the current transaction touches.
     */
    relevantTokens?: TokenInfo[];
};

type LiveBalance = { token: TokenInfo; raw: bigint };

const VET_TOKEN: TokenInfo = {
    address: 'VET',
    symbol: 'VET',
    decimals: 18,
};

function truncate(addr: string): string {
    if (!addr || addr.length < 12) return addr;
    return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

function formatVET(raw: bigint): string {
    const str = formatUnits(raw, 18);
    if (!str.includes('.')) return str;
    const [whole, frac] = str.split('.');
    const trimmed = frac.replace(/0+$/, '').slice(0, 4);
    return trimmed.length === 0 ? whole : `${whole}.${trimmed}`;
}

/**
 * Header row identifying the account that will sign. Shows the address with
 * its VeChain domain (if any) plus the avatar (custom for .vet domains,
 * Picasso identicon as fallback), a copy button, and the live VET balance.
 */
export function AccountChip({ address, relevantTokens }: Props) {
    const [balances, setBalances] = useState<LiveBalance[] | null>(null);
    const [copied, setCopied] = useState(false);
    const { domain, avatar, isLoading: addressInfoLoading } =
        useAddressInfo(address);
    const balancesPending = balances === null;

    const tokenKey = (relevantTokens ?? [])
        .map((t) => t.address.toLowerCase())
        .sort()
        .join(',');

    useEffect(() => {
        if (!address) return;
        let cancelled = false;
        (async () => {
            try {
                const vetTask = thor.accounts
                    .getAccount(Address.of(address))
                    .then((acc) => ({
                        token: VET_TOKEN,
                        raw: BigInt(acc.balance.toString()),
                    }));
                const erc20Tasks = (relevantTokens ?? [])
                    .filter(
                        (t) => t.address !== 'VET' && t.address !== 'vet',
                    )
                    .map(async (token) => {
                        const res = await thor.contracts
                            .load(token.address, ERC20_BALANCE_ABI)
                            .read.balanceOf(
                                address as `0x${string}`,
                            );
                        return {
                            token,
                            raw: BigInt(
                                (res as unknown as [bigint])[0],
                            ),
                        };
                    });
                const results = await Promise.all([
                    vetTask,
                    ...erc20Tasks,
                ]);
                if (!cancelled) setBalances(results);
            } catch {
                if (!cancelled) setBalances(null);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [address, tokenKey]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(address);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            // Clipboard API can fail in some browsers; silently ignore.
        }
    };

    return (
        <div className={styles.chip}>
            {addressInfoLoading ? (
                <div className={`${styles.skeleton} ${styles.skeletonAvatar}`} />
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
            <div className={styles.identity}>
                <p className={styles.label}>Your account</p>
                <div className={styles.identityRow}>
                    {addressInfoLoading ? (
                        <div
                            className={`${styles.skeleton} ${styles.skeletonDomain}`}
                        />
                    ) : domain ? (
                        <div className={styles.domainStack}>
                            <p className={styles.domain}>{domain}</p>
                            <p className={styles.addressUnderDomain}>
                                {truncate(address)}
                            </p>
                        </div>
                    ) : (
                        <p className={styles.addressOnly}>{truncate(address)}</p>
                    )}
                    <button
                        type="button"
                        className={styles.copyBtn}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleCopy();
                        }}
                        aria-label={copied ? 'Copied' : 'Copy address'}
                        title={copied ? 'Copied' : 'Copy address'}
                    >
                        {copied ? (
                            <LuCheck className={styles.copyIcon} />
                        ) : (
                            <LuCopy className={styles.copyIcon} />
                        )}
                    </button>
                </div>
            </div>
            <div className={styles.balanceCol}>
                <p className={styles.label}>Balance</p>
                {balancesPending ? (
                    <div
                        className={`${styles.skeleton} ${styles.skeletonText}`}
                    />
                ) : (
                    <div className={styles.balanceList}>
                        {balances!.map((b) => (
                            <p key={b.token.address} className={styles.balanceRow}>
                                {formatVET(b.raw)} {b.token.symbol}
                            </p>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
