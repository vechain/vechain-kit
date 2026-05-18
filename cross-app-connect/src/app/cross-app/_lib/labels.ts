/**
 * Human-readable labels + risk classification for the technical strings the
 * smart-account flow surfaces. Kept separate from decoder.ts so it stays
 * trivial to scan and extend when new EIP-712 primary types or action
 * shapes show up.
 */
import type { DecodedClause } from './decoder';
import { isDexRouterAddress } from './knownActions';
import { truncateAddress } from './format';

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
 * Title for the transact card. Specific verbs read better than the previous
 * generic "Confirm action" -- users land on the page and immediately know
 * what kind of thing they're about to do.
 */
export function titleForActions(
    decoded: DecodedClause[] | null,
    blocked: boolean,
): string {
    if (blocked) return 'Action blocked';
    if (!decoded || decoded.length === 0) return 'Confirm action';

    const transfers = decoded.filter(
        (d) => d.kind === 'native_transfer' || d.kind === 'token_transfer',
    );
    const approves = decoded.filter((d) => d.kind === 'token_approve');
    const unknowns = decoded.filter((d) => d.kind === 'unknown');
    const knownByCategory = groupKnownByCategory(decoded);

    if (transfers.length === decoded.length) {
        return decoded.length === 1
            ? 'Confirm token transfer'
            : 'Confirm token transfers';
    }
    if (approves.length === decoded.length) {
        return decoded.length === 1
            ? 'Confirm token approval'
            : 'Confirm token approvals';
    }
    if (unknowns.length === decoded.length) return 'Confirm contract call';

    // Approve → swap is the canonical DEX pattern. Coalesce into a single
    // "Confirm token swap" title rather than the generic "Confirm 2 actions".
    if (isSwapBatch(decoded)) return 'Confirm token swap';

    // All clauses share a single ecosystem category → use a domain-specific
    // title rather than "Confirm 3 actions".
    if (
        decoded.every((d) => d.kind === 'known_action') &&
        knownByCategory.length === 1
    ) {
        switch (knownByCategory[0]) {
            case 'domain':
                return 'Confirm domain update';
            case 'governance':
                return 'Confirm VeBetterDAO vote';
            case 'rewards':
                return 'Confirm rewards claim';
            case 'nft':
                return decoded.length === 1
                    ? 'Confirm NFT transfer'
                    : 'Confirm NFT actions';
            case 'token':
                return 'Confirm token action';
            case 'staking':
                return 'Confirm stake update';
            case 'swap':
                return 'Confirm token swap';
        }
    }
    return `Confirm ${decoded.length} actions`;
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
    // "Confirm" beats "Continue" / "Approve": Continue is too soft for a
    // signing action, Approve overlaps with ERC-20 `approve()` and clashes
    // with the per-clause rows that say things like "Allow spending up to X".
    switch (risk) {
        case 'safe':
            return 'Confirm';
        case 'caution':
            return 'Confirm anyway';
        case 'danger':
            return 'I understand, confirm';
    }
}

export function humanPrimaryType(value: string): string {
    switch (value) {
        case 'ExecuteWithAuthorization':
            return 'Authorized call';
        case 'ExecuteBatchWithAuthorization':
            return 'Authorized batch call';
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
 * One-line subtitle that carries the *specifics* of the batch (amounts,
 * counterparties, DEX names) — complementing the title which carries the
 * *kind* of action ("Swap tokens", "Send tokens", "Update your VeChain
 * domain"). Returns empty when the per-clause action list below already
 * communicates the specifics on its own.
 */
export function summarizeActions(decoded: DecodedClause[]): string {
    if (decoded.length === 0) return '';

    // Single-clause: lean on the structured fields the decoder already has.
    if (decoded.length === 1) {
        const d = decoded[0];
        if (d.kind === 'native_transfer') {
            return `${trimAmount(d.amount)} VET to ${truncateAddress(d.recipient)}`;
        }
        if (d.kind === 'token_transfer') {
            return `${trimAmount(d.amount)} ${d.token.symbol} to ${truncateAddress(d.recipient)}`;
        }
        if (d.kind === 'token_approve') {
            const amt = d.unlimited ? 'Unlimited' : trimAmount(d.amount);
            return `${amt} ${d.token.symbol} for ${truncateAddress(d.spender)}`;
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
                ? 'Unlimited'
                : trimAmount(approve.amount);
            return dex
                ? `${amt} ${approve.token.symbol} via ${dex}`
                : `${amt} ${approve.token.symbol}`;
        }
        return dex ? `via ${dex}` : '';
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

    // Multi-clause known-action of one category: extract the most-meaningful
    // identifier from the batch so the user sees the *target* (domain name
    // being set, proposal id, app being endorsed) at a glance.
    const known = decoded.filter((d) => d.kind === 'known_action');
    if (known.length === decoded.length && sameCategory(known) !== null) {
        return batchSubtitleForCategory(sameCategory(known)!, known);
    }

    // Mixed batches: the per-clause rows show the breakdown. Subtitle stays
    // empty unless there's an unverified clause worth calling out.
    const unknowns = decoded.filter((d) => d.kind === 'unknown');
    if (unknowns.length > 0) {
        return `${decoded.length} actions, ${unknowns.length} unverified`;
    }
    return '';
}

/**
 * Compact comma-separated list of "amount symbol" for a batch of token
 * transfers or approvals — "1 B3TR, 50 VOT3" rather than enumerating
 * recipients which would overflow the subtitle.
 */
function assetsList(
    clauses: DecodedClause[],
): string {
    const parts: string[] = [];
    for (const c of clauses) {
        if (c.kind === 'native_transfer') {
            parts.push(`${trimAmount(c.amount)} VET`);
        } else if (c.kind === 'token_transfer') {
            parts.push(`${trimAmount(c.amount)} ${c.token.symbol}`);
        } else if (c.kind === 'token_approve') {
            const amt = c.unlimited ? 'Unlimited' : trimAmount(c.amount);
            parts.push(`${amt} ${c.token.symbol}`);
        }
    }
    return parts.join(', ');
}

/**
 * Most useful detail for a single-category known-action batch.
 *
 * - Domain: the new primary domain name we're switching to (extracted
 *   from the trailing setName clause). For "Remove your primary" only,
 *   we surface that intent instead.
 * - Governance: the proposal / round id from the castVote summary.
 * - Rewards: the cycle / round being claimed.
 * - Token: the converted amount (B3TR ↔ VOT3).
 * - NFT / staking: per-clause rows carry the targets cleanly, no subtitle
 *   adds anything obvious without overflowing.
 */
function batchSubtitleForCategory(
    category: string,
    known: DecodedClause[],
): string {
    if (category === 'domain') {
        // Find a setName clause whose summary names a new primary domain.
        for (const k of known) {
            if (k.kind !== 'known_action') continue;
            const m = k.summary.match(/^Set (\S+) as your primary/);
            if (m) return `Switching to ${m[1]}`;
        }
        if (
            known.length === 1 &&
            known[0].kind === 'known_action' &&
            known[0].summary === 'Remove your primary VeChain domain'
        ) {
            return 'Clearing your primary';
        }
        return '';
    }
    if (category === 'governance') {
        for (const k of known) {
            if (k.kind !== 'known_action') continue;
            // "Vote FOR on a VeBetterDAO proposal" → "FOR proposal"
            const v = k.summary.match(/^Vote (FOR|AGAINST|ABSTAIN)/);
            if (v) return `${v[1]} proposal`;
            const alloc = k.summary.match(
                /across (\d+) apps/,
            );
            if (alloc) return `Allocating across ${alloc[1]} apps`;
            if (k.summary.startsWith('Endorse')) return 'Endorsing an app';
        }
        return '';
    }
    if (category === 'rewards') {
        for (const k of known) {
            if (k.kind !== 'known_action') continue;
            const cycle = k.summary.match(/cycle (\d+)/i);
            if (cycle) return `From cycle ${cycle[1]}`;
            const round = k.summary.match(/round (\d+)/i);
            if (round) return `From round ${round[1]}`;
        }
        return '';
    }
    if (category === 'token') {
        for (const k of known) {
            if (k.kind !== 'known_action') continue;
            const conv = k.summary.match(/Convert (\S+) (B3TR|VOT3) → (B3TR|VOT3)/);
            if (conv) return `${conv[1]} ${conv[2]} → ${conv[3]}`;
        }
        return '';
    }
    return '';
}

/**
 * Pull the DEX name (BetterSwap / VeTrade) out of a swap clause's summary.
 * The recogniser produces "Swap tokens on <DEX>" — we parse the suffix back
 * out rather than thread an extra structured field through the type.
 */
function dexNameFromSwapBatch(decoded: DecodedClause[]): string | null {
    const swap = decoded.find(
        (d) => d.kind === 'known_action' && d.category === 'swap',
    );
    if (!swap || swap.kind !== 'known_action') return null;
    const match = swap.summary.match(/on (.+)$/);
    return match ? match[1] : null;
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

function sameCategory(known: DecodedClause[]): string | null {
    let cat: string | null = null;
    for (const d of known) {
        if (d.kind !== 'known_action') return null;
        if (cat === null) cat = d.category;
        else if (cat !== d.category) return null;
    }
    return cat;
}

