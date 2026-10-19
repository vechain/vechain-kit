/**
 * Privy rejects an OAuth `redirect_to` that carries the popup's per-request
 * query ("Redirect URL is not allowed"), so OAuth returns to the bare page
 * URL and the query is stashed here and merged back on return.
 */
const KEY_PREFIX = 'vk-cross-app-connect:oauth-return-query';

function key(pathname: string): string {
    return `${KEY_PREFIX}:${pathname}`;
}

function hasPrivyOAuthParams(params: URLSearchParams): boolean {
    return Array.from(params.keys()).some((k) => k.startsWith('privy_oauth_'));
}

export function getOAuthRedirectUrl(): string | undefined {
    if (typeof window === 'undefined') return undefined;
    return `${window.location.origin}${window.location.pathname}`;
}

export function stashQueryForOAuth(): void {
    if (typeof window === 'undefined') return;
    try {
        sessionStorage.setItem(
            key(window.location.pathname),
            window.location.search,
        );
    } catch {
        // private browsing — the request is lost, the page shows its error
    }
}

/** Must run before PrivyProvider mounts so both Privy and the page see the full URL. */
export function restoreQueryAfterOAuth(): void {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    if (!hasPrivyOAuthParams(url.searchParams)) return;
    let saved: string | null = null;
    try {
        saved = sessionStorage.getItem(key(url.pathname));
        sessionStorage.removeItem(key(url.pathname));
    } catch {
        return;
    }
    if (saved === null) return;
    const merged = new URLSearchParams(saved);
    url.searchParams.forEach((value, name) => merged.set(name, value));
    url.search = merged.toString();
    window.history.replaceState(window.history.state, '', url);
}
