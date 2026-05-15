/**
 * Human-readable labels + risk classification for the technical strings the
 * smart-account flow surfaces. Kept separate from decoder.ts so it stays
 * trivial to scan and extend when new EIP-712 primary types or action
 * shapes show up.
 */
import type { DecodedClause, TokenInfo } from './decoder';

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

    if (transfers.length === decoded.length) return 'Send tokens';
    if (approves.length === decoded.length) return 'Approve spending';
    if (unknowns.length === decoded.length) return 'Interact with contract';
    return `Confirm ${decoded.length} actions`;
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
            return 'Continue';
        case 'caution':
            return 'Continue anyway';
        case 'danger':
            return 'I understand, continue';
    }
}

/**
 * Distinct token contracts the batch touches. Used by the AccountChip to
 * fetch live balances for the tokens the user is about to move, so the
 * header reads "1,240 B3TR · 12 VET" instead of just "12 VET" when the
 * batch is moving B3TR. Native VET is implicit (the chip always shows it).
 */
export function uniqueTokensFromDecoded(
    decoded: DecodedClause[] | null,
): TokenInfo[] {
    if (!decoded) return [];
    const seen = new Map<string, TokenInfo>();
    for (const d of decoded) {
        if (d.kind === 'token_transfer' || d.kind === 'token_approve') {
            const key = d.token.address.toLowerCase();
            if (!seen.has(key)) seen.set(key, d.token);
        }
    }
    return Array.from(seen.values());
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
 * One-sentence plain-English summary of what the batch does. Read by the
 * user before they look at the per-clause action list; goal is to dramatically
 * reduce signing anxiety / support load.
 */
export function summarizeActions(decoded: DecodedClause[]): string {
    if (decoded.length === 0) return 'Nothing to do.';

    const transfers = decoded.filter(
        (d) => d.kind === 'native_transfer' || d.kind === 'token_transfer',
    );
    const approves = decoded.filter((d) => d.kind === 'token_approve');
    const unknowns = decoded.filter((d) => d.kind === 'unknown');
    const unlimited = approves.some(
        (a) => a.kind === 'token_approve' && a.unlimited,
    );

    // Single-clause shortcuts read most cleanly.
    if (decoded.length === 1) {
        const d = decoded[0];
        if (d.kind === 'native_transfer' || d.kind === 'token_transfer') {
            return 'You’re about to send tokens out of your wallet.';
        }
        if (d.kind === 'token_approve') {
            return d.unlimited
                ? 'You’re giving this app unlimited access to one of your tokens.'
                : 'You’re letting this app spend some of your tokens.';
        }
        return 'You’re running an action we couldn’t fully verify.';
    }

    // Batches.
    if (unknowns.length > 0 && transfers.length === 0 && approves.length === 0) {
        return 'You’re running actions we couldn’t fully verify.';
    }
    if (transfers.length > 0 && approves.length === 0 && unknowns.length === 0) {
        return `You’re sending tokens out of your wallet in ${decoded.length} steps.`;
    }
    if (approves.length > 0 && transfers.length === 0 && unknowns.length === 0) {
        return unlimited
            ? 'You’re giving this app unlimited access to your tokens.'
            : 'You’re letting this app spend some of your tokens.';
    }
    if (unknowns.length > 0) {
        return `You’re approving ${decoded.length} actions, some of which we couldn’t fully verify.`;
    }
    return `You’re approving ${decoded.length} actions on your wallet.`;
}
