/**
 * Remember the identifier of the most recently signed-in user (email / phone
 * / Privy DID), scoped per Privy app id. Used so that when a Privy session
 * expires and the user lands on the "Sign in to continue" screen, we can
 * greet them with "Welcome back, dan@email.com" and pre-highlight the
 * provider they used last — turning a cold re-login into a one-tap path.
 *
 * The stash happens whenever `usePrivy().user` is non-null. It's not
 * sensitive data; the user already typed it once into Privy and Privy
 * itself stores far more in its own localStorage.
 */
const KEY_PREFIX = 'vk-cross-app-connect:last-identity';

function key(): string {
    const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID ?? 'default';
    return `${KEY_PREFIX}:${appId}`;
}

export type LastIdentity = {
    /** Human-readable display string — email, phone, or Privy DID prefix. */
    label: string;
    /** Provider id matching `OAUTH_PROVIDERS[].id` plus 'phone' / 'farcaster'. */
    provider?: string;
};

export function getLastIdentity(): LastIdentity | null {
    if (typeof localStorage === 'undefined') return null;
    try {
        const raw = localStorage.getItem(key());
        if (!raw) return null;
        const parsed = JSON.parse(raw) as LastIdentity;
        return parsed && typeof parsed.label === 'string' ? parsed : null;
    } catch {
        return null;
    }
}

export function setLastIdentity(identity: LastIdentity): void {
    if (typeof localStorage === 'undefined') return;
    try {
        localStorage.setItem(key(), JSON.stringify(identity));
    } catch {
        // quota / private-browsing — fail open
    }
}

/**
 * Extract a display label from Privy's `user` object. Prefers the explicit
 * email > phone > linked social email > Privy DID prefix. Returns null
 * when nothing usable is present (rare).
 */
export function labelFromPrivyUser(user: unknown): string | null {
    if (!user || typeof user !== 'object') return null;
    const u = user as Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
    if (u.email?.address) return String(u.email.address);
    if (u.phone?.number) return String(u.phone.number);
    if (u.google?.email) return String(u.google.email);
    if (u.apple?.email) return String(u.apple.email);
    if (typeof u.id === 'string') {
        // did:privy:abcd1234... → "abcd1234" truncated
        const tail = u.id.replace(/^did:privy:/, '');
        return tail.length > 10 ? `${tail.slice(0, 10)}…` : tail;
    }
    return null;
}
