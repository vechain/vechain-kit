/**
 * Balance-change preview for a batch of decoded clauses. Aggregates outflows
 * per token from the decoded actions, then reads the user's current balance
 * from Thor so the screen can show:
 *
 *    USDT   1,234.50  ->  1,224.50   (-10)
 *    VET       100.0  ->     95.0    (-5)
 *
 * Coverage is intentionally limited to *predictable* deltas:
 *
 *   - Native VET transfer     -> -amount on VET
 *   - ERC-20 transfer         -> -amount on that token
 *   - ERC-20 approve / unknown -> no balance prediction
 *
 * Anything we couldn't decode falls under the `unpredictable` flag so the
 * page can show a "some actions couldn't be simulated" banner instead of
 * pretending the preview is exhaustive.
 *
 * Gas is paid by the fee-delegator in the cross-app smart-account flow, so
 * we don't list a VTHO line; the user owes zero.
 */
import type { ThorClient } from '@vechain/sdk-network';
import { Address } from '@vechain/sdk-core';
import { parseAbi, parseUnits } from 'viem';
import { executeCallClause } from '@vechain/vechain-kit/utils';
import type { DecodedClause, TokenInfo } from './decoder';

const ERC20_BALANCE_ABI = parseAbi([
    'function balanceOf(address owner) view returns (uint256)',
]);

const VET_TOKEN: TokenInfo = {
    address: 'VET',
    symbol: 'VET',
    decimals: 18,
};

export type BalanceChange = {
    token: TokenInfo;
    before: bigint;
    after: bigint;
    delta: bigint; // negative for outflow
};

export type Simulation = {
    changes: BalanceChange[];
    unpredictable: boolean;
};

export async function simulateClauses(
    decoded: DecodedClause[],
    account: string,
    thor: ThorClient,
): Promise<Simulation> {
    let unpredictable = false;
    const deltas = new Map<string, { token: TokenInfo; delta: bigint }>();
    const bumpDelta = (key: string, token: TokenInfo, amount: bigint) => {
        const prev = deltas.get(key) ?? { token, delta: BigInt(0) };
        deltas.set(key, { token, delta: prev.delta - amount });
    };

    for (const d of decoded) {
        if (d.kind === 'native_transfer') {
            let raw: bigint;
            try {
                raw = parseUnits(d.amount, 18);
            } catch {
                unpredictable = true;
                continue;
            }
            bumpDelta('VET', VET_TOKEN, raw);
        } else if (d.kind === 'token_transfer') {
            let raw: bigint;
            try {
                raw = parseUnits(d.amount, d.token.decimals);
            } catch {
                unpredictable = true;
                continue;
            }
            bumpDelta(d.token.address.toLowerCase(), d.token, raw);
        } else if (d.kind === 'unknown') {
            // Could move tokens we can't see -- mark the whole simulation
            // as partial so the page surfaces a warning.
            unpredictable = true;
        }
        // token_approve doesn't change balances.
    }

    // No deltas to fetch -- short-circuit.
    if (deltas.size === 0) {
        return { changes: [], unpredictable };
    }

    const tasks = Array.from(deltas.entries()).map(
        async ([key, { token, delta }]): Promise<BalanceChange | null> => {
            try {
                const before = await fetchBalance(thor, account, key, token);
                return { token, before, after: before + delta, delta };
            } catch {
                // Couldn't read the current balance -- flag as partial and
                // skip this row instead of showing 0 -> -X which would be
                // alarming for no reason.
                unpredictable = true;
                return null;
            }
        },
    );
    const results = (await Promise.all(tasks)).filter(
        (r): r is BalanceChange => r !== null,
    );
    return { changes: results, unpredictable };
}

async function fetchBalance(
    thor: ThorClient,
    account: string,
    key: string,
    token: TokenInfo,
): Promise<bigint> {
    if (key === 'VET') {
        const acc = await thor.accounts.getAccount(Address.of(account));
        return BigInt(acc.balance.toString());
    }
    const res = await executeCallClause({
        thor,
        contractAddress: token.address,
        abi: ERC20_BALANCE_ABI,
        method: 'balanceOf' as const,
        args: [account as `0x${string}`],
    });
    return BigInt((res as unknown as [bigint])[0]);
}
