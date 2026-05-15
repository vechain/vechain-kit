/**
 * Human-readable labels for the technical strings the smart-account flow
 * surfaces. Kept separate from decoder.ts so it stays trivial to scan and
 * extend when new EIP-712 primary types or action shapes show up.
 */
import type { DecodedClause } from './decoder';

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
