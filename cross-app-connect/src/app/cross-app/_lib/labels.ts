/**
 * Human-readable labels + risk classification for the technical strings the
 * smart-account flow surfaces. Kept separate from decoder.ts so it stays
 * trivial to scan and extend when new EIP-712 primary types or action
 * shapes show up.
 *
 * All copy goes through i18next so the cross-app popup speaks the user's
 * language. Batch-level title/subtitle logic reads structured fields off
 * `known_action` clauses (see `KnownActionData` in knownActions.ts) rather
 * than parsing the localized summary text back out.
 */
import type { DecodedClause } from './decoder';
import { isDexRouterAddress } from './knownActions';
import { truncateAddress } from './format';
import i18n from '../../i18n/config';

const t = i18n.t.bind(i18n);

export type Risk = 'safe' | 'caution' | 'danger';

export function computeRisk(
    decoded: DecodedClause[] | null,
    blocked: boolean,
): Risk {
    if (blocked) return 'danger';
    if (!decoded) return 'safe';
    const hasUnknown = decoded.some((d) => d.kind === 'unknown');
    const hasUnlimited = decoded.some(
        (d) => d.kind === 'token_approve' && d.unlimited,
    );
    if (hasUnknown && hasUnlimited) return 'danger';
    if (hasUnknown || hasUnlimited) return 'caution';
    return 'safe';
}

/**
 * Title for the transact card — always verb-led "Confirm X" so the user
 * sees a parallel structure across every kind of transaction.
 */
export function titleForActions(
    decoded: DecodedClause[] | null,
    blocked: boolean,
): string {
    if (blocked) return t('transact.title.actionBlocked');
    if (!decoded || decoded.length === 0) return t('transact.title.confirmAction');

    const transfers = decoded.filter(
        (d) => d.kind === 'native_transfer' || d.kind === 'token_transfer',
    );
    const approves = decoded.filter((d) => d.kind === 'token_approve');
    const unknowns = decoded.filter((d) => d.kind === 'unknown');
    const knownByCategory = groupKnownByCategory(decoded);

    if (transfers.length === decoded.length) {
        return decoded.length === 1
            ? t('transact.title.confirmTokenTransfer')
            : t('transact.title.confirmTokenTransfers');
    }
    if (approves.length === decoded.length) {
        return decoded.length === 1
            ? t('transact.title.confirmTokenApproval')
            : t('transact.title.confirmTokenApprovals');
    }
    if (unknowns.length === decoded.length) {
        return t('transact.title.confirmContractCall');
    }

    if (isSwapBatch(decoded)) return t('transact.title.confirmTokenSwap');

    if (
        decoded.every((d) => d.kind === 'known_action') &&
        knownByCategory.length === 1
    ) {
        switch (knownByCategory[0]) {
            case 'domain':
                return t('transact.title.confirmDomainUpdate');
            case 'governance':
                return t('transact.title.confirmVeBetterDaoVote');
            case 'rewards':
                return t('transact.title.confirmRewardsClaim');
            case 'nft':
                return decoded.length === 1
                    ? t('transact.title.confirmNftTransfer')
                    : t('transact.title.confirmNftActions');
            case 'token':
                return t('transact.title.confirmTokenAction');
            case 'staking':
                return t('transact.title.confirmStakeUpdate');
            case 'swap':
                return t('transact.title.confirmTokenSwap');
        }
    }
    return t('transact.title.confirmNActions', { count: decoded.length });
}

/**
 * Detect the canonical DEX pattern: at least one `swap` known-action plus
 * (optionally) `token_approve` clauses whose spender is a known router
 * address. Anything else in the batch disqualifies the pattern.
 */
function isSwapBatch(decoded: DecodedClause[]): boolean {
    const hasSwap = decoded.some(
        (d) => d.kind === 'known_action' && d.category === 'swap',
    );
    if (!hasSwap) return false;
    return decoded.every((d) => {
        if (d.kind === 'known_action' && d.category === 'swap') return true;
        if (d.kind === 'token_approve' && isDexRouterAddress(d.spender))
            return true;
        return false;
    });
}

function groupKnownByCategory(
    decoded: DecodedClause[],
): Array<DecodedClause extends { category: infer C } ? C : never> {
    const set = new Set<string>();
    for (const d of decoded) {
        if (d.kind === 'known_action') set.add(d.category);
    }
    return Array.from(set) as Array<
        DecodedClause extends { category: infer C } ? C : never
    >;
}

/**
 * Label for the primary CTA. Escalates verb as risk grows so the user is
 * given more friction the closer they get to signing something we can't
 * vouch for. The button is disabled outright when phase==='blocked', so the
 * "danger" copy only fires for non-blocking risk (unknown + unlimited
 * approve together).
 */
export function continueLabel(risk: Risk): string {
    switch (risk) {
        case 'safe':
            return t('transact.button.confirm');
        case 'caution':
            return t('transact.button.confirmAnyway');
        case 'danger':
            return t('transact.button.confirmAsDanger');
    }
}

export function humanPrimaryType(value: string): string {
    switch (value) {
        case 'ExecuteWithAuthorization':
            return t('transact.detail.authorizedCall');
        case 'ExecuteBatchWithAuthorization':
            return t('transact.detail.authorizedBatchCall');
        default:
            // Fallback: SCREAMING_SNAKE -> Title Case, camelCase -> Title Case.
            return value
                .replace(/_/g, ' ')
                .replace(/([a-z])([A-Z])/g, '$1 $2')
                .toLowerCase()
                .replace(/(^|\s)\S/g, (m) => m.toUpperCase());
    }
}

/**
 * One-line subtitle carrying the *specifics* of the batch (amounts,
 * counterparties, DEX names) — complementing the title which carries the
 * *kind* of action. Returns empty when the per-clause action list below
 * already communicates the specifics on its own.
 */
export function summarizeActions(decoded: DecodedClause[]): string {
    if (decoded.length === 0) return '';

    // Single-clause: lean on the structured fields the decoder already has.
    if (decoded.length === 1) {
        const d = decoded[0];
        if (d.kind === 'native_transfer') {
            return t('transact.subtitle.sendVet', {
                amount: trimAmount(d.amount),
                recipient: truncateAddress(d.recipient),
            });
        }
        if (d.kind === 'token_transfer') {
            return t('transact.subtitle.sendToken', {
                amount: trimAmount(d.amount),
                symbol: d.token.symbol,
                recipient: truncateAddress(d.recipient),
            });
        }
        if (d.kind === 'token_approve') {
            const amt = d.unlimited
                ? t('common.amount.unlimited')
                : trimAmount(d.amount);
            return t('transact.subtitle.approveFor', {
                amount: amt,
                symbol: d.token.symbol,
                spender: truncateAddress(d.spender),
            });
        }
        // known_action / unknown: title or per-clause row says enough.
        return '';
    }

    // Approve → swap pair: surface the spent amount + DEX name.
    if (isSwapBatch(decoded)) {
        const approve = decoded.find(
            (d) => d.kind === 'token_approve',
        ) as Extract<DecodedClause, { kind: 'token_approve' }> | undefined;
        const dex = dexNameFromSwapBatch(decoded);
        if (approve) {
            const amt = approve.unlimited
                ? t('common.amount.unlimited')
                : trimAmount(approve.amount);
            return dex
                ? t('transact.subtitle.swapVia', {
                      amount: amt,
                      symbol: approve.token.symbol,
                      dex,
                  })
                : t('transact.subtitle.swapAmount', {
                      amount: amt,
                      symbol: approve.token.symbol,
                  });
        }
        return dex ? t('transact.subtitle.swapViaOnly', { dex }) : '';
    }

    // Pure transfer batch — list the moved assets compactly.
    const transfers = decoded.filter(
        (d) => d.kind === 'native_transfer' || d.kind === 'token_transfer',
    );
    if (transfers.length === decoded.length) {
        return assetsList(transfers);
    }

    // Pure approve batch — list approvals.
    const approves = decoded.filter((d) => d.kind === 'token_approve');
    if (approves.length === decoded.length) {
        return assetsList(approves);
    }

    // Multi-clause known-action of one category — read structured data
    // off the clauses instead of parsing localized summaries back out.
    const known = decoded.filter((d) => d.kind === 'known_action');
    if (known.length === decoded.length && sameCategory(known) !== null) {
        return batchSubtitleForCategory(sameCategory(known)!, decoded);
    }

    // Mixed batches: the per-clause rows show the breakdown. Subtitle stays
    // empty unless there's an unverified clause worth calling out.
    const unknowns = decoded.filter((d) => d.kind === 'unknown');
    if (unknowns.length > 0) {
        return t('transact.subtitle.actionsWithUnverified', {
            count: decoded.length,
            unverified: unknowns.length,
        });
    }
    return '';
}

/** DEX name from any `swap` known_action in the batch (data.dex). */
function dexNameFromSwapBatch(decoded: DecodedClause[]): string | null {
    for (const d of decoded) {
        if (d.kind !== 'known_action') continue;
        if (d.category !== 'swap') continue;
        if (d.data?.dex) return d.data.dex;
    }
    return null;
}

/**
 * Compact comma-separated list of "amount symbol" for a batch of token
 * transfers or approvals — "1 B3TR, 50 VOT3" rather than enumerating
 * recipients which would overflow the subtitle.
 */
function assetsList(clauses: DecodedClause[]): string {
    const parts: string[] = [];
    for (const c of clauses) {
        if (c.kind === 'native_transfer') {
            parts.push(`${trimAmount(c.amount)} VET`);
        } else if (c.kind === 'token_transfer') {
            parts.push(`${trimAmount(c.amount)} ${c.token.symbol}`);
        } else if (c.kind === 'token_approve') {
            const amt = c.unlimited
                ? t('common.amount.unlimited')
                : trimAmount(c.amount);
            parts.push(`${amt} ${c.token.symbol}`);
        }
    }
    return parts.join(', ');
}

/**
 * Batch subtitle for a single-category known-action group. Reads
 * `KnownActionData` fields off the clauses rather than parsing summaries.
 */
function batchSubtitleForCategory(
    category: string,
    decoded: DecodedClause[],
): string {
    if (category === 'domain') {
        // Final setName carries the new primary domain.
        for (const d of decoded) {
            if (d.kind !== 'known_action') continue;
            if (d.data?.setPrimaryName) {
                return t('transact.subtitle.switchingTo', {
                    domain: d.data.setPrimaryName,
                });
            }
        }
        if (
            decoded.length === 1 &&
            decoded[0].kind === 'known_action' &&
            decoded[0].data?.removePrimary
        ) {
            return t('transact.subtitle.clearingPrimary');
        }
        return '';
    }
    if (category === 'governance') {
        for (const d of decoded) {
            if (d.kind !== 'known_action') continue;
            if (d.data?.voteSupport) {
                return t('transact.subtitle.voteOnProposal', {
                    vote: t(`vote.${d.data.voteSupport}`),
                });
            }
            if (d.data?.allocationAppCount && d.data.allocationAppCount > 0) {
                return t('transact.subtitle.allocatingAcross', {
                    count: d.data.allocationAppCount,
                });
            }
            if (d.data?.endorse) {
                return t('transact.subtitle.endorsingApp');
            }
        }
        return '';
    }
    if (category === 'rewards') {
        for (const d of decoded) {
            if (d.kind !== 'known_action') continue;
            if (d.data?.rewardCycle) {
                return t('transact.subtitle.fromCycle', {
                    cycle: d.data.rewardCycle,
                });
            }
            if (d.data?.rewardRound) {
                return t('transact.subtitle.fromRound', {
                    round: d.data.rewardRound,
                });
            }
        }
        return '';
    }
    if (category === 'token') {
        for (const d of decoded) {
            if (d.kind !== 'known_action') continue;
            if (
                d.data?.convertAmount &&
                d.data?.convertFrom &&
                d.data?.convertTo
            ) {
                return t('transact.subtitle.conversion', {
                    amount: d.data.convertAmount,
                    from: d.data.convertFrom,
                    to: d.data.convertTo,
                });
            }
        }
        return '';
    }
    return '';
}

function sameCategory(known: DecodedClause[]): string | null {
    let cat: string | null = null;
    for (const d of known) {
        if (d.kind !== 'known_action') return null;
        if (cat === null) cat = d.category;
        else if (cat !== d.category) return null;
    }
    return cat;
}

// Trim a `formatUnits` output to a human-readable amount: 2 decimals for
// values ≥ 1, up to 4 for values < 1, no trailing zeros.
function trimAmount(amount: string): string {
    if (!amount.includes('.')) return amount;
    const [whole, frac] = amount.split('.');
    const cap = whole === '0' ? 4 : 2;
    const trimmed = frac.replace(/0+$/, '').slice(0, cap);
    return trimmed.length === 0 ? whole : `${whole}.${trimmed}`;
}
