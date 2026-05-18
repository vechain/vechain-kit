'use client';

import { Fragment, useEffect, useState } from 'react';
import { Address } from '@vechain/sdk-core';
import { formatUnits, parseAbi } from 'viem';
import { thor } from '../cross-app/_lib/thor';
import type { TokenInfo } from '../cross-app/_lib/decoder';
import styles from './BalanceLine.module.css';

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
    address: string;
    /**
     * Additional tokens (beyond native VET) to display the balance for.
     * Typically the tokens the current transaction touches.
     */
    relevantTokens?: TokenInfo[];
};

function formatAmount(raw: bigint, decimals: number): string {
    const str = formatUnits(raw, decimals);
    if (!str.includes('.')) return str;
    const [whole, frac] = str.split('.');
    const trimmed = frac.replace(/0+$/, '').slice(0, 4);
    return trimmed.length === 0 ? whole : `${whole}.${trimmed}`;
}

/**
 * Compact balance strip rendered below the IdentityRow on transact / sign
 * popups. Shows the user's native VET balance plus the balance of any
 * tokens the transaction touches, so they can sanity-check coverage before
 * signing. Hidden entirely while loading or if the Thor read fails.
 */
export function BalanceLine({ address, relevantTokens }: Props) {
    const [balances, setBalances] = useState<LiveBalance[] | null>(null);
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
                            .read.balanceOf(address as `0x${string}`);
                        return {
                            token,
                            raw: BigInt((res as unknown as [bigint])[0]),
                        };
                    });
                const results = await Promise.all([vetTask, ...erc20Tasks]);
                if (!cancelled) setBalances(results);
            } catch {
                if (!cancelled) setBalances(null);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [address, tokenKey]); // eslint-disable-line react-hooks/exhaustive-deps

    if (balances === null) {
        return (
            <div className={styles.row}>
                <span className={styles.label}>Balance</span>
                <span className={styles.skeleton} />
            </div>
        );
    }

    return (
        <div className={styles.row}>
            <span className={styles.label}>Balance</span>
            {balances.map((b, i) => (
                <Fragment key={b.token.address}>
                    {i > 0 && <span className={styles.sep}>·</span>}
                    <span className={styles.value}>
                        {formatAmount(b.raw, b.token.decimals)} {b.token.symbol}
                    </span>
                </Fragment>
            ))}
        </div>
    );
}
