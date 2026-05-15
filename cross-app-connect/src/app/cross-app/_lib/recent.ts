/**
 * Tracks the most recently used login provider per browser, so the SignInPanel
 * can surface a "Recent" badge in the next popup. Scoped per app id so a host
 * pointed at multiple Privy apps doesn't cross-pollute.
 */
const KEY_PREFIX = 'vk-cross-app-connect:recent-provider';

function key(): string {
    const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID ?? 'default';
    return `${KEY_PREFIX}:${appId}`;
}

export function getRecentProvider(): string | null {
    if (typeof localStorage === 'undefined') return null;
    try {
        return localStorage.getItem(key());
    } catch {
        return null;
    }
}

export function setRecentProvider(providerId: string): void {
    if (typeof localStorage === 'undefined') return;
    try {
        localStorage.setItem(key(), providerId);
    } catch {
        // quota / private-browsing — fail open
    }
}
